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
import { collection, query, where, writeBatch, doc, getDocs, updateDoc, deleteDoc, onSnapshot, arrayUnion,getDoc, setDoc } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { sendEmail } from './emailService'; // Import the email service
import { getMonth, getYear, getWeekOfMonth, getDate } from 'date-fns';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth';
import { circIn } from 'framer-motion';

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
  deleteLastHistoryEntry
};