// Firebase Firestore imports
import { firestore } from '../firebase'; // Adjust the path as necessary
import { collection, writeBatch, doc } from "firebase/firestore"; 

// Firebase Storage imports
import { storage } from '../firebase'; // Adjust the path as necessary
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Function to validate tool data
function validateToolData(data) {
  return {
    name: typeof data.name === 'string' ? data.name : '',
    capacity: !isNaN(Number(data.capacity)) ? Number(data.capacity) : 0,
    unit: typeof data.unit === 'string' ? data.unit : 'kg',
    quantity: !isNaN(Number(data.quantity)) ? Number(data.quantity) : 0,
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

export { 
  addEquipment,
  uploadImageAndGetUrl
};