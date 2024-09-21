import { firestore, storage } from '../firebase'; // Adjust the path as necessary
import { collection, addDoc, writeBatch, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { sendEmail } from './emailService'; // Import the email service

function validateToolData(data) {
  return {
    name: typeof data.name === 'string' ? data.name : '',
    capacity: !isNaN(Number(data.capacity)) ? Number(data.capacity) : 0, // Convert to number if possible
    unit: typeof data.unit === 'string' ? data.unit : 'kg',
    quantity: !isNaN(Number(data.quantity)) ? Number(data.quantity) : 0, // Convert to number if possible
    current_quantity: !isNaN(Number(data.current_quantity)) ? Number(data.current_quantity) : 0, // Convert to number if possible
    category: typeof data.category === 'string' ? data.category : 'unknown',
    condition: typeof data.condition === 'string' ? data.condition : 'unknown',
    image: typeof data.image === 'string' ? data.image : '',
      date: data.dateAdded instanceof Date ? data.dateAdded : new Date()
  };
}

async function uploadTE(toolData) {
    const db = firestore;
    const batch = writeBatch(db);

    // Reference to the "tools" collection
    const toolsCollection = collection(db, 'tools');

    // Create a new document reference
    const newToolDoc = doc(toolsCollection);

    // Validate and sanitize tool data
    const validatedData = validateToolData(toolData);

    // Add the tool data to the batch
    batch.set(newToolDoc, validatedData);

    // Commit the batch
    await batch.commit();

    console.log('Tool added to the database');
}

async function fetchAllTools() {
    const db = firestore;
    const querySnapshot = await getDocs(collection(db, 'tools'));
    
    const rows = querySnapshot.docs.map(doc => ({
      id: doc.id, // Include the document ID
      ...doc.data() // Spread the document data
    }));
  
    // console.log(rows);
  
    return rows;
  }

  async function countRows() {
    const db = firestore;
    const querySnapshot = await getDocs(collection(db, "tools"));
    return querySnapshot.docs.length; // Returns the count of documents in the collection
  }

  async function updateTool(toolId, updatedData) {
    const db = firestore;
    const toolDocRef = doc(db, 'tools', toolId);

    // Update the document with the new data
    await updateDoc(toolDocRef, updatedData);

    console.log(`Tool with ID ${toolId} has been updated`);
}

async function deleteTool(toolId) {
  const db = firestore;
  const toolDocRef = doc(db, 'tools', toolId);

  // Delete the document
  await deleteDoc(toolDocRef);

  console.log(`Tool with ID ${toolId} has been deleted`);
}

// Function to upload image and get its URL
 async function uploadImageAndGetUrl(file) {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);
  return fileUrl;
}

async function fetchAllBorrowers() {
  const db = firestore;
  const querySnapshot = await getDocs(collection(db, 'borrower'));
  
  const rows = querySnapshot.docs.map(doc => ({
    ...doc.data() // Spread the document data
  }));

  return rows;
}

// async function uploadInstructor(instructorData) {
//   console.log('Uploading instructor:', instructorData); // Log the data being uploaded
//   const db = firestore;
//   const batch = writeBatch(db);

//   // Reference to the "instructors" collection
//   const instructorsCollection = collection(db, 'instructors');

//   // Create a new document reference
//   const newInstructorDoc = doc(instructorsCollection);

//   // Add the instructor data to the batch
//   batch.set(newInstructorDoc, instructorData);

//   // Commit the batch
//   await batch.commit();

//   console.log('Instructor added to the database');
// }

async function uploadInstructor(instructorData) {
  console.log('Uploading instructor:', instructorData); // Log the data being uploaded
  const db = firestore;
  const batch = writeBatch(db);

  // Reference to the "instructors" collection
  const instructorsCollection = collection(db, 'instructors');

  // Create a new document reference
  const newInstructorDoc = doc(instructorsCollection);

  // Add the instructor data to the batch
  batch.set(newInstructorDoc, instructorData);

  // Commit the batch
  await batch.commit();

  console.log('Instructor added to the database');

  // Send email to the instructor
  const emailSubject = 'Your Account Information';
  const emailText = `Your account has been created. Your details are as follows:\n\nEmail: ${instructorData.email}\nPassword: ${instructorData.password}`;
  const toName = `${instructorData.firstname} ${instructorData.lastname}`;
  const fromName = 'Your Organization Name'; // Replace with your organization name

  try {
    await sendEmail(instructorData.email, toName, fromName, emailText);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function fetchInstructors() {
  console.log('Fetching instructors...');
  const db = firestore;

  // Reference to the "instructors" collection
  const instructorsCollection = collection(db, 'instructors');

  // Get all documents from the collection
  const querySnapshot = await getDocs(instructorsCollection);

  // Extract data from the documents
  const instructors = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  console.log('Instructors fetched:', instructors);
  return instructors;
}

export default uploadTE;

export { 
  fetchAllTools, 
  countRows, 
  updateTool, 
  deleteTool, 
  uploadImageAndGetUrl, 
  fetchAllBorrowers, 
  uploadInstructor,
  fetchInstructors }; // Export the functions for use in other modules