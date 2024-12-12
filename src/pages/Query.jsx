// Firebase Firestore imports
import { firestore } from '../firebase'; // Adjust the path as necessary
import { collection, writeBatch, doc, query, where, getDocs, updateDoc } from "firebase/firestore"; 

// Firebase Storage imports
import { storage } from '../firebase'; // Adjust the path as necessary
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Function to validate tool data
function validateToolData(data) {
  return {
    name: typeof data.name === 'string' ? data.name : '',
    capacity: !isNaN(Number(data.capacity)) ? Number(data.capacity) : 0,
    unit: typeof data.unit === 'string' ? data.unit : 'kg',
    stocks: !isNaN(Number(data.stocks)) ? Number(data.stocks) : 0,
    category: typeof data.category === 'string' ? data.category : 'unknown',
    image: typeof data.image === 'string' ? data.image : '',
    dateAdded: data.dateAdded instanceof Date ? data.dateAdded : new Date(),
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

  // Add the tool data to the batch
  batch.set(docRef, validatedData);

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
async function checkEquipmentExists(name, unit) {
  const db = firestore;
  const collectionRef = collection(db, 'equipments');
  const q = query(collectionRef, where('name', '==', name), where('unit', '==', unit));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  return null;
}

// Function to update the stock of existing equipment
async function updateStock(id, newStock) {
  const db = firestore;
  const docRef = doc(db, 'equipments', id);
  await updateDoc(docRef, { stocks: newStock });
}

export { 
  addEquipment,
  uploadImageAndGetUrl,
  checkEquipmentExists,
  updateStock
};