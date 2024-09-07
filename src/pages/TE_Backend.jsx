import { firestore } from '../firebase'; // Adjust the path as necessary
import { collection, addDoc, writeBatch, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"; 

async function uploadTE(toolData) {
    const db = firestore;
    const batch = writeBatch(db);

    // Reference to the "tools" collection
    const toolsCollection = collection(db, 'tools');

    // Create a new document reference
    const newToolDoc = doc(toolsCollection);

    // Add the tool data to the batch
    batch.set(newToolDoc, toolData);

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

export default uploadTE;

export { fetchAllTools, countRows };