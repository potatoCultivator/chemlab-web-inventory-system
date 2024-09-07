import { firestore } from '../firebase'; // Adjust the path as necessary
import { writeBatch, collection, doc } from 'firebase/firestore';

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

export default uploadTE;