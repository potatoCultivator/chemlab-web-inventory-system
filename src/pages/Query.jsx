// Firebase Firestore imports
// import { firestore } from '../firebase'; // Adjust the path as necessary
// import { collection, 
//          writeBatch, 
//          doc, 
//          query, 
//          where, 
//          getDocs, 
//          updateDoc, 
//          arrayUnion, 
//          onSnapshot,
//          deleteDoc
//          } from "firebase/firestore"; 

// // Firebase Storage imports
// import { storage } from '../firebase'; // Adjust the path as necessary
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage, auth } from '../firebase'; // Adjust the path as necessary
import { collection, query, where, writeBatch, doc, getDocs, updateDoc, deleteDoc, onSnapshot, arrayUnion,getDoc, setDoc, } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { sendEmail } from './emailService'; // Import the email service
import { getMonth, getYear, getWeekOfMonth, getDate } from 'date-fns';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth';
import { circIn } from 'framer-motion';
import borrowers from 'menu-items/borrowers';
import equipments from 'menu-items/equipments';
import { teal } from '@mui/material/colors';

// Function to validate tool data
function validateToolData(data) {
  return {
    name: typeof data.name === 'string' ? data.name : '',
    capacity: !isNaN(Number(data.capacity)) ? Number(data.capacity) : 0,
    unit: typeof data.unit === 'string' ? data.unit : 'kg',
    stocks: !isNaN(Number(data.stocks)) ? Number(data.stocks) : 0,
    total: !isNaN(Number(data.stocks)) ? Number(data.stocks) : 0, 
    category: typeof data.category === 'string' ? data.category : 'unknown',
    image: typeof data.image === 'string' ? data.image : '',
    dateAdded: data.dateAdded instanceof Date ? data.dateAdded : new Date(),
    history: Array.isArray(data.history) ? data.history : [],
  };
}

// Function to add equipment to Firestore
async function addEquipment(equipment) {
  const db = firestore;
  const batch = writeBatch(db);

  // Reference to the "equipments" collection
  const collectionRef = collection(db, 'equipments');

  // Create a new document reference
  const docRef = doc(collectionRef);

  // Validate and sanitize tool data
  const validatedData = validateToolData(equipment);

  // Add the tool data to the batch with 'deleted' attribute set to false
  batch.set(docRef, { ...validatedData, deleted: false });

  // Commit the batch
  await batch.commit();

  console.log('Equipment added to the database');
}

// Function to upload image to Firebase Storage and get the URL
async function uploadImageAndGetUrl(file) {
  const storageRef = ref(storage, `equipments/${file.name}`);
  await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);
  console.log('Image uploaded:', fileUrl);
  return fileUrl;
}

// Function to check if equipment name and unit already exist in Firestore
async function checkEquipmentExists(name, unit, capacity) {
  const db = firestore;
  const collectionRef = collection(db, 'equipments');

  // Create the query based on the unit and capacity
  let q;
  if (unit === 'pcs') {
    q = query(collectionRef, where('name', '==', name.toLowerCase()), where('unit', '==', unit.toLowerCase()));
  } else {
    q = query(collectionRef, where('name', '==', name.toLowerCase()), where('unit', '==', unit.toLowerCase()), where('capacity', '==', capacity));
  }

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Check if 'deleted' is false
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    if (data.deleted === true) {
      // If the document is marked as deleted, return null
      return null;
    }

    // Return the document if it's not marked as deleted
    return { id: doc.id, ...data };
  }

  return null;
}

// Function to update the stock of existing equipment
async function updateStock(id, newStock, newTotal, historyEntry) {
  const db = firestore;
  const docRef = doc(db, 'equipments', id);
  await updateDoc(docRef, { 
    stocks: newStock,
    total: newTotal,
    history: arrayUnion(historyEntry) // Add new history entry to the existing history array
  });
}

// Function to add a history entry to Firestore
async function addHistoryEntry(equipmentId, historyEntry) {
  const db = firestore;
  const docRef = doc(db, 'equipments', equipmentId);
  await updateDoc(docRef, {
    history: arrayUnion(historyEntry)
  });
}

// Function to fetch specific equipment by name, unit, and capacity
async function getEquipment(name, unit, capacity) {
  const db = firestore;
  const collectionRef = collection(db, 'equipments');
  const q = query(collectionRef, where('name', '==', name), where('unit', '==', unit), where('capacity', '==', capacity));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return doc.id; // Return only the ID of the equipment
  }
  return null;
}

// Function to fetch all equipment from Firestore
async function fetchAllEquipments() {
  const db = firestore;
  const collectionRef = collection(db, 'equipments');
  const q = query(collectionRef, where('deleted', '==', false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Function to fetch all equipment from Firestore
async function getAllEquipment(callback, errorCallback) {
  const db = firestore;
  const collectionRef = collection(db, 'equipments');
  const q = query(collectionRef, where('deleted', '==', false));
  return onSnapshot(q, (snapshot) => {
    const equipmentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(equipmentList);
  }, errorCallback);
}

async function uploadInstructor(instructorData) {
  const db = firestore;
  const batch = writeBatch(db);

  // Reference to the "instructors" collection
  const instructorsCollection = collection(db, 'instructor');

  // Create a new document reference
  const newInstructorDoc = doc(instructorsCollection);

  // Add the instructor data to the batch
  batch.set(newInstructorDoc, instructorData);

  // Commit the batch
  await batch.commit();

  // Send email to the instructor
  const emailText = `Your account has been created. Your details are as follows:\n\nEmail: ${instructorData.email}\nPassword: ${instructorData.password}`;
  const toName = `${instructorData.name}`;
  const fromName = 'Your Organization Name'; // Replace with your organization name

  try {
    await sendEmail(instructorData.email, toName, fromName, emailText);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const fetchInstructors = (callback, errorCallback) => {
  const instructorsCollection = collection(firestore, 'instructor');
  return onSnapshot(instructorsCollection, (snapshot) => {
    const data = snapshot.docs.map((doc, index) => ({
      tracking_no: index + 1,
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  }, errorCallback);
};

async function deleteInstructorAcc(accountID) {
  const db = firestore;
  const accDocRef = doc(db, 'instructor', accountID); // Ensure the collection name is correct

  try {
    // Delete the document
    await deleteDoc(accDocRef);
    console.log(`Instructor with ID ${accountID} has been deleted`);
  } catch (error) {
    console.error('Error deleting instructor:', error);
    throw new Error(`Failed to delete instructor with ID ${accountID}: ${error.message}`);
  }
}

// Function to fetch all equipment from Firestore
async function getAllSchedule() {
  const db = firestore;
  const collectionRef = collection(db, 'schedule');
  const querySnapshot = await getDocs(collectionRef);

  const schedList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(schedList);
  return schedList;
}

async function getBorrower(schedID) {
  const db = firestore;
  const collectionRef = collection(db, 'borrowers');
  const q = query(collectionRef, where('schedID', '==', schedID));
  const querySnapshot = await getDocs(q);

  const schedList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return schedList;
}

async function getAllBorrower() {
  const db = firestore;
  const collectionRef = collection(db, 'borrowers');
  const querySnapshot = await getDocs(collectionRef);

  const schedList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return schedList;
}

async function deleteEquipment(id) {
  const db = firestore;
  const docRef = doc(db, 'equipments', id);
  await updateDoc(docRef, { deleted: true });
}

async function editEquipment(id, equipment) {
  const db = firestore;
  const docRef = doc(db, 'equipments', id);
  await updateDoc(docRef, equipment);
}

async function updateLastHistoryEntry(id, updatedEntry) {
  const db = firestore; // Firestore instance
  const docRef = doc(db, 'equipments', id);

  try {
    // Step 1: Retrieve the current document
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Ensure all necessary values are initialized
      const currentStock = Number(data?.stocks) || 0; // Default to 0 if data.stocks is invalid
      const currentHistory = data?.history || [];    // Default to empty array if history is missing
      const lastAddedStock = currentHistory.length > 0 
          ? currentHistory[currentHistory.length - 1].addedStock || 0 
          : 0;
      const updatedStock = Number(currentStock) - Number(lastAddedStock) + Number(updatedEntry?.addedStock || 0);


      // Step 2: Check if the array is not empty
      if (currentHistory.length > 0) {
        const lastIndex = currentHistory.length - 1; // Get the last index
        currentHistory[lastIndex] = { ...updatedEntry, date: new Date() }; // Update the last element with new date
      } else {
        throw new Error("History array is empty");
      }
      const newTotal = currentHistory.map((entry) => Number(entry.addedStock)).reduce((a, b) => a + b, 0);
      // Step 3: Write the updated array back to Firestore
      await updateDoc(docRef, { 
        stocks: Number(updatedStock),
        total: Number(newTotal),
        history: currentHistory 
      });
      console.log("Last history entry updated successfully!");
    } else {
      console.error("Document does not exist!");
    }
  } catch (error) {
    console.error("Error updating last history entry:", error);
  }
}

async function deleteLastHistoryEntry(id) {
  const db = firestore; // Firestore instance
  const docRef = doc(db, 'equipments', id);

  try {
    // Step 1: Retrieve the current document
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Ensure all necessary values are initialized
      const currentStock = Number(data?.stocks) || 0; // Default to 0 if data.stocks is invalid
      const currentHistory = data?.history || [];    // Default to empty array if history is missing
      const lastAddedStock = currentHistory.length > 0 
          ? currentHistory[currentHistory.length - 1].addedStock || 0 
          : 0;

      // Check if the current stock is less than the last added stock
      if (currentStock < lastAddedStock) {
        throw new Error("Current stock is less than the last added stock. Cannot delete the last history entry.");
      }

      const updatedStock = Number(currentStock) - Number(lastAddedStock);

      // Step 2: Check if the array is not empty
      if (currentHistory.length > 0) {
        currentHistory.pop(); // Remove the last element
      } else {
        throw new Error("History array is empty");
      }
      const newTotal = currentHistory.map((entry) => Number(entry.addedStock)).reduce((a, b) => a + b, 0);
      // Step 3: Write the updated array back to Firestore
      await updateDoc(docRef, { 
        stocks: Number(updatedStock),
        total: Number(newTotal),
        history: currentHistory 
      });
      console.log("Last history entry deleted successfully!");
    } else {
      console.error("Document does not exist!");
    }
  } catch (error) {
    console.error("Error deleting last history entry:", error);
  }
}

function get_ID_Name_Sched(callback, errorCallback) {
  const db = firestore;
  const collectionRef = collection(db, 'schedule');

  // Set up a real-time listener
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const currentDate = new Date();
      const schedList = snapshot.docs
        .map(doc => {
          const data = doc.data();
          const docDate = data.start.toDate(); // Assuming dateAdded is a Firestore Timestamp
          if (
            docDate.getFullYear() === currentDate.getFullYear() &&
            docDate.getMonth() === currentDate.getMonth() &&
            docDate.getDate() === currentDate.getDate()
          ) {
            return {
              id: doc.id,
              subject: data.subject,
              borrowers: data.borrowers,
              equipments: data.equipments,
            };
          }
          return null;
        })
        .filter(item => item !== null); // Filter out null values
      callback(schedList); // Call the callback with the updated schedule list
    },
    (error) => {
      if (errorCallback) {
        errorCallback(error); // Handle errors with the provided callback
      } else {
        console.error("Snapshot error:", error); // Fallback error handling
      }
    }
  );

  return unsubscribe; // Return the unsubscribe function for cleanup
}

function get_Sched(callback, errorCallback) {
  const db = firestore;
  const collectionRef = collection(db, 'schedule');

  // Set up a real-time listener
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const schedList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          subject: data.subject,
          borrowers: data.borrowers,
          equipments: data.equipments,
          teacher: data.teacher,
        };
      });
      callback(schedList); // Call the callback with the updated schedule list
    },
    (error) => {
      if (errorCallback) {
        errorCallback(error); // Handle errors with the provided callback
      } else {
        console.error("Snapshot error:", error); // Fallback error handling
      }
    }
  );

  return unsubscribe; // Return the unsubscribe function for cleanup
}

// Removed duplicate function

async function updatedBorrowerStatus(schedID, borrowerID, newStatus) {
  const db = firestore;
  const docRef = doc(db, 'schedule', schedID);

  try {
    // Retrieve the current document
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const borrowers = data.borrowers || [];

      // Update the status of the specific borrower
      const updatedBorrowers = borrowers.map(borrower => 
        borrower.userID === borrowerID ? { ...borrower, status: newStatus } : borrower
      );

      // Update the document with the modified borrowers array
      await updateDoc(docRef, { borrowers: updatedBorrowers });
      console.log("Borrower status updated successfully!");
    } else {
      console.error("Document does not exist!");
    }
  } catch (error) {
    console.error("Error updating borrower status:", error);
  }
}


async function getSchedEquipments(schedID) {
  const db = firestore;
  const docRef = doc(db, 'schedule', schedID);
  
  try {
    const docSnap = await getDoc(docRef); // Await the Promise
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.equipments || []; // Return an empty array if no equipments
    } else {
      console.error('Document does not exist!');
      return []; // Return an empty array to prevent errors
    }
  } catch (error) {
    console.error('Error fetching scheduled equipments:', error);
    throw error; // Rethrow the error for the calling function to handle
  }
}


async function updateStocks(equipmentID, value) {
  const db = firestore;
  const docRef = doc(db, 'equipments', equipmentID);

  // Retrieve the current document
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log('Document data:', data); // Log the retrieved data

    const currentStocks = data.stocks || 0;  // Fallback to 0 if stocks are undefined
    const newStocks = currentStocks + value;

    // Update the document with the new stock values
    await updateDoc(docRef, { stocks: newStocks });
    console.log('Stocks updated successfully!');
  } else {
    console.error('Document does not exist!');
  }
}

async function uploadInvoice(invoiceData) {
  const db = firestore;
  const batch = writeBatch(db);

  // Reference to the "invoices" collection
  const invoicesCollection = collection(db, 'invoice');

  // Create a new document reference
  const newInvoiceDoc = doc(invoicesCollection);

  // Add the invoice data to the batch
  batch.set(newInvoiceDoc, invoiceData);

  // Commit the batch
  await batch.commit();

  console.log('Invoice uploaded successfully!');
}

async function get_Borrowers(schedID, onSuccess, onError) {
  const db = firestore;
  
  // Get the reference to the specific schedule document using schedID
  const scheduleDocRef = doc(db, 'schedule', schedID);  // Reference to the specific document

  try {
    // Fetch the document
    const scheduleDocSnapshot = await getDoc(scheduleDocRef);

    if (scheduleDocSnapshot.exists()) {
      // Extract the borrowers array from the document data
      const borrowers = scheduleDocSnapshot.data().borrowers;

      // Check if borrowers exist and return them, otherwise, return an empty array
      const borrowerList = borrowers || [];

      // Call onSuccess callback with the fetched borrowers
      onSuccess(borrowerList);
    } else {
      console.log('No schedule found with the specified schedID');
      onSuccess([]);  // Return empty array if no schedule is found
    }
  } catch (error) {
    // Call onError callback in case of failure
    onError(error);
  }
}



export { 
  addEquipment,
  uploadImageAndGetUrl,
  checkEquipmentExists,
  updateStock,
  addHistoryEntry,
  getEquipment,
  fetchAllEquipments,
  getAllEquipment,
  uploadInstructor,
  fetchInstructors,
  deleteInstructorAcc,
  getAllSchedule,
  getBorrower,
  getAllBorrower,
  deleteEquipment,
  editEquipment,
  updateLastHistoryEntry,
  deleteLastHistoryEntry,
  get_ID_Name_Sched,
  updatedBorrowerStatus,
  updateStocks,
  getSchedEquipments,
  get_Sched,
  uploadInvoice,
  get_Borrowers,
};