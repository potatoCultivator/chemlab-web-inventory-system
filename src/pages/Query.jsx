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
  if (unit.toLowerCase() === 'pcs') {
    q = query(
      collectionRef,
      where('name', '==', name.toLowerCase().trim()),  // Trim and lowercase for consistent comparison
      where('unit', '==', unit),  // Trim and lowercase for unit
      where('deleted', '==', false)
    );
  } else {
    q = query(
      collectionRef,
      where('name', '==', name.toLowerCase().trim()),
      where('unit', '==', unit),
      where('capacity', '==', Number(capacity)),  // Ensure capacity is a number
      where('deleted', '==', false)
    );
  }

  const querySnapshot = await getDocs(q);
  console.log(querySnapshot.empty, querySnapshot.docs);  // Debugging log

  if (!querySnapshot.empty) {
    // Return the document if it's not marked as deleted
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
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

  const schedList = querySnapshot.docs
    .filter(doc => !doc.data().deleted) // Filter out documents where deleted is true
    .map(doc => ({ id: doc.id, ...doc.data() }));
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
            !data.deleted && // Check if doc.deleted is false
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
      const schedList = snapshot.docs
        .filter(doc => !doc.data().deleted) // Filter out documents where deleted is true
        .map(doc => {
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

      let updatedBorrowers = borrowers;

      if (newStatus === 'returned') {
        updatedBorrowers = borrowers.map(borrower => 
          borrower.userID === borrowerID ? { ...borrower, status: newStatus, date_returned: new Date() } : borrower
        );
      } else if (newStatus === 'approved') {
         updatedBorrowers = borrowers.map(borrower => 
          borrower.userID === borrowerID ? { ...borrower, status: newStatus } : borrower
        );
      }

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

function getInvoices(callback, errorCallback) {
  const db = firestore;
  const invoicesCollection = collection(db, 'invoice');

  // Set up a real-time listener
  return onSnapshot(invoicesCollection, (snapshot) => {
    const invoicesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(invoicesList);
  }, errorCallback);
}

function getEquipmentsCounts(callback, errorCallback) {
  const db = firestore;
  const collectionRef = collection(db, 'equipments');
  const q = query(collectionRef, where('deleted', '==', false));

  return onSnapshot(q, (snapshot) => {
    const equipments = snapshot.docs.map(doc => doc.data());
    const totalEquipments = equipments.length;
    const totalStocks = equipments.reduce((total, equipment) => total + equipment.stocks, 0);

    callback({ totalEquipments, totalStocks });
  }, errorCallback);
}

async function get_SchedSub(schedID, callback, errorCallback) {
  const db = firestore;
  const docRef = doc(db, 'schedule', schedID);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const subject = data.subject; // Extract only the subject
      const teacher = data.teacher;
      callback({ subject, teacher }); // Call the callback with the subject and teacher
    } else {
      console.error("Document does not exist!");
      callback(null); // Call the callback with null if the document does not exist
    }
  } catch (error) {
    if (errorCallback) {
      errorCallback(error); // Handle errors with the provided callback
    } else {
      console.error("Error fetching schedule:", error); // Fallback error handling
    }
  }
}

async function updateInvoice(id) {
  const db = firestore;
  const docRef = doc(db, 'invoice', id);
  await updateDoc(docRef, { replaced: true });
}

async function fetchBorrowedEquipments() {
  const db = firestore;
  const scheduleCollectionRef = collection(db, "schedule");
  const borrowedEquipments = [];

  try {
    const querySnapshot = await getDocs(scheduleCollectionRef);

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Skip the schedule if it is marked as deleted
      if (data.deleted) return;

      // Check if the document contains `equipments` and `borrowers` arrays
      if (data.equipments) {
          const borrowed = data.equipments;
          
        if (borrowed.length > 0) {
          borrowedEquipments.push(...borrowed);
        }
      }
    });

    console.log("Borrowed Equipments:", borrowedEquipments);
    return borrowedEquipments;
  } catch (error) {
    console.error("Error fetching borrowed equipments:", error);
    return [];
  }
}

function fetchDeletedAndNotDeletedEquipments(callback, errorCallback) {
  const db = firestore;
  const collectionRef = collection(db, 'equipments');

  return onSnapshot(collectionRef, (snapshot) => {
    const equipments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort equipments by dateAdded in descending order (latest first)
    equipments.sort((a, b) => b.dateAdded - a.dateAdded);

    callback(equipments);
  }, errorCallback);
}

function getMonthlyEquipmentStocksCount(callback, errorCallback) {
  const db = firestore;
  const collectionRef = collection(db, 'equipments');
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return onSnapshot(collectionRef, (snapshot) => {
    const monthlyEquipments = snapshot.docs.filter(doc => {
      const data = doc.data();
      const dateAdded = data.dateAdded.toDate(); // Assuming dateAdded is a Firestore Timestamp
      return dateAdded.getMonth() === currentMonth && dateAdded.getFullYear() === currentYear;
    });

    const totalStocks = monthlyEquipments.reduce((total, equipment) => total + parseInt(equipment.stocks, 10), 0);
    callback(totalStocks);
  }, errorCallback);
}

// function getDamagedEquipments(callback, errorCallback) {
//   const db = firestore;
//   const collectionRef = collection(db, 'invoice');

//   return onSnapshot(collectionRef, (snapshot) => {
//     const equipments = snapshot.docs
//       .map(doc => doc.data().equipments.map(equipment => ({ ...equipment, id: doc.id })))
//       .flat();

//     callback(equipments);
//   }, errorCallback);
// }

import _ from 'lodash';

function getDamagedEquipments(callback, errorCallback) {
  const db = firestore;
  const collectionRef = collection(db, 'invoice');

  return onSnapshot(collectionRef, (snapshot) => {
    const equipments = snapshot.docs
      .map(doc => doc.data().equipments.map(equipment => ({ ...equipment, id: doc.id })))
      .flat();

    const groupedEquipments = _.groupBy(equipments, equipment => `${equipment.name}-${equipment.unit}-${equipment.capacity}`);
    const uniqueEquipments = Object.values(groupedEquipments).map(group => ({
      ...group[0],
      id_list: group.map(equipment => ({ id: equipment.id, qty: equipment.qty })),
      total_qty: group.reduce((total, equipment) => total + equipment.qty, 0)
    }));

    callback(uniqueEquipments);
  }, errorCallback);
}

function getReplacedEquipments(callback, errorCallback) {
  const db = firestore;
  const collectionRef = collection(db, 'invoice');

  return onSnapshot(collectionRef, (snapshot) => {
    const equipments = snapshot.docs
      .filter(doc => doc.data().replaced === true) // Ensure each doc.replaced is true
      .map(doc => doc.data().equipments.map(equipment => ({ ...equipment, id: doc.id })))
      .flat();

    const groupedEquipments = _.groupBy(equipments, equipment => `${equipment.name}-${equipment.unit}-${equipment.capacity}`);
    const uniqueEquipments = Object.values(groupedEquipments).map(group => ({
      ...group[0],
      id_list: group.map(equipment => ({ id: equipment.id, qty: equipment.qty })),
      total_qty: group.reduce((total, equipment) => total + equipment.qty, 0)
    }));

    callback(uniqueEquipments);
  }, errorCallback);
}

function getLiableBorrowers(callback, errorCallback) {
  const db = firestore;
  const collectionRef = collection(db, 'invoice');

  return onSnapshot(collectionRef, (snapshot) => {
    const borrowers = snapshot.docs.map(doc => ({
      id: doc.id,
      studentID: doc.data().studentID,
      borrower: doc.data().borrower,
      date: doc.data().date_issued
    }));

    callback(borrowers);
  }, errorCallback);
}

async function getCountPending(successCallback, errorCallback) {
    try {
        const collectionRef = collection(firestore, 'invoice');
        const querySnapshot = await getDocs(collectionRef);

        let pendingCount = 0;

        querySnapshot.forEach(doc => {
            if (!doc.data().replaced) {
                pendingCount++;
            }
        });

        successCallback({ totalPending: pendingCount });
    } catch (error) {
        errorCallback(error);
    }
}

async function getCountSettled(successCallback, errorCallback) {
  try {
      const collectionRef = collection(firestore, 'invoice');
      const querySnapshot = await getDocs(collectionRef);

      let pendingCount = 0;

      querySnapshot.forEach(doc => {
          if (doc.data().replaced) {
              pendingCount++;
          }
      });

      successCallback({ totalPending: pendingCount });
  } catch (error) {
      errorCallback(error);
  }
}

async function getCountLiable(successCallback, errorCallback) {
  try {
    const collectionRef = collection(firestore, 'invoice');
    const querySnapshot = await getDocs(collectionRef);

    let totalCount = 0;

    querySnapshot.forEach(doc => {
      totalCount++;
    });

    successCallback({ totalCount: totalCount });
  } catch (error) {
    errorCallback(error);
  }
}

async function replaceStock(name, capacity, unit, addedStock) {
  const db = firestore;
  const collectionRef = collection(db, 'equipments');

  // Create the query based on the name, unit, and capacity (if unit is not 'pcs')
  let q;
  if (unit.toLowerCase() === 'pcs') {
    q = query(
      collectionRef,
      where('name', '==', name),
      where('unit', '==', unit),
      where('deleted', '==', false)
    );
  } else {
    q = query(
      collectionRef,
      where('name', '==', name),
      where('capacity', '==', Number(capacity)),
      where('unit', '==', unit),
      where('deleted', '==', false)
    );
  }

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    const data = querySnapshot.docs[0].data();
    const currentStock = Number(data.stocks) || 0;  // Ensure currentStock is a number
    const newStock = currentStock + Number(addedStock);  // Ensure addedStock is a number

    // Update the document with the new stock values
    await updateDoc(docRef, { stocks: newStock });
    console.log('Stock replaced successfully!');
  } else {
    console.error('Document does not exist!');
  }
}

export { 
  addEquipment,
  uploadImageAndGetUrl,
  checkEquipmentExists,
  updateStock, // will use for onAdd
  addHistoryEntry, //will use for onAdd
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
  getInvoices,
  getEquipmentsCounts,
  get_SchedSub,
  updateInvoice,
  fetchBorrowedEquipments,
  fetchDeletedAndNotDeletedEquipments,
  getMonthlyEquipmentStocksCount,
  getDamagedEquipments,
  getLiableBorrowers,
  getReplacedEquipments,
  getCountPending,
  getCountSettled,
  getCountLiable,
  replaceStock,
};