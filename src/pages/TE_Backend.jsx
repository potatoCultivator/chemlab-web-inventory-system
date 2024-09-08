import { firestore } from '../firebase'; // Adjust the path as necessary
import { collection, addDoc, writeBatch, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"; 

async function uploadTE(toolData) {
    const db = firestore;
    const batch = writeBatch(db);

    // Reference to the "tools" collection
    const toolsCollection = collection(db, 'tools_and_equipments');

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
    const querySnapshot = await getDocs(collection(db, 'tools_and_equipments'));
    
    const rows = querySnapshot.docs.map(doc => ({
      id: doc.id, // Include the document ID
      ...doc.data() // Spread the document data
    }));
  
    // console.log(rows);
  
    return rows;
  }

  async function countRows() {
    const db = firestore;
    const querySnapshot = await getDocs(collection(db, "tools_and_equipments"));
    return querySnapshot.docs.length; // Returns the count of documents in the collection
  }

  async function updateTool(toolId, updatedData) {
    const db = firestore;
    const toolDocRef = doc(db, 'tools_and_equipments', toolId);

    // Update the document with the new data
    await updateDoc(toolDocRef, updatedData);

    console.log(`Tool with ID ${toolId} has been updated`);
}

async function deleteTool(toolId) {
  const db = firestore;
  const toolDocRef = doc(db, 'tools_and_equipments', toolId);

  // Delete the document
  await deleteDoc(toolDocRef);

  console.log(`Tool with ID ${toolId} has been deleted`);
}

export default uploadTE;
export { fetchAllTools, countRows, updateTool, deleteTool };