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
import { collection, query, where, writeBatch, doc, getDocs, updateDoc, deleteDoc, onSnapshot, getDoc, setDoc } from "firebase/firestore"; 
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
  const q = query(collectionRef, where('name', '==', name), where('unit', '==', unit), where('capacity', '==', capacity));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
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
function getAllEquipment(callback, errorCallback) {
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

export { 
  addEquipment,
  uploadImageAndGetUrl,
  checkEquipmentExists,
  updateStock,
  addHistoryEntry,
  getEquipment,
  getAllEquipment,
  uploadInstructor,
  fetchInstructors,
  deleteInstructorAcc,
  getAllSchedule,
  getBorrower,
  getAllBorrower,
  deleteEquipment,
};