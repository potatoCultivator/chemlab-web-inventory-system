import { firestore, storage } from '../firebase'; // Adjust the path as necessary
import { collection, query, where, addDoc, writeBatch, doc, getDocs, updateDoc, deleteDoc, onSnapshot, getDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { sendEmail } from './emailService'; // Import the email service
import { format, getMonth, getYear, getWeek, getWeekOfMonth } from 'date-fns';

function validateToolData(data) {
  return {
    name: typeof data.name === 'string' ? data.name : '',
    capacity: !isNaN(Number(data.capacity)) ? Number(data.capacity) : 0, 
    unit: typeof data.unit === 'string' ? data.unit : 'kg',
    quantity: !isNaN(Number(data.quantity)) ? Number(data.quantity) : 0, 
    good_quantity: !isNaN(Number(data.good_quantity)) ? Number(data.good_quantity) : 0, 
    damage_quantity: !isNaN(Number(data.damage_quantity)) ? Number(data.damage_quantity) : 0, 
    current_quantity: !isNaN(Number(data.current_quantity)) ? Number(data.current_quantity) : 0, 
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

  return rows;
}

async function countRows(setCount) {
  const db = firestore;
  const toolsCollection = collection(db, "tools");

  // Initial fetch to get the count
  const querySnapshot = await getDocs(toolsCollection);
  setCount(querySnapshot.docs.length); // Set the initial count

  // Set up a listener for real-time updates
  onSnapshot(toolsCollection, (snapshot) => {
    setCount(snapshot.docs.length); // Update the count when the collection changes
  });
}

async function updateTool(toolId, updatedData) {
  const db = firestore;
  const toolDocRef = doc(db, 'tools', toolId);

  validateToolData(updatedData);

  // Update the document with the new data
  await updateDoc(toolDocRef, updatedData);

  console.log(`Tool with ID ${toolId} has been updated`);
}

async function fetchToolQuantities(toolId) {
  const db = firestore;
  const toolDocRef = doc(db, 'tools', toolId);

  try {
    const toolDoc = await getDoc(toolDocRef);
    if (toolDoc.exists()) {
      const toolData = toolDoc.data();
      const quantities = {
        current_quantity: toolData.current_quantity,
        good_quantity: toolData.good_quantity,
        damage_quantity: toolData.damage_quantity
      };
      console.log(`Tool Quantities: ${JSON.stringify(quantities)}`);
      return quantities;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching tool quantities:', error);
    throw error;
  }
}

async function updateToolQuantity(toolId, newQuantity, goodQuantity, damageQuantity) {
  const db = firestore;
  const toolDocRef = doc(db, 'tools', toolId);

  try {
    // Update the document with the new quantities
    await updateDoc(toolDocRef, {
      current_quantity: newQuantity,
      good_quantity: goodQuantity,
      damage_quantity: damageQuantity
    });

    console.log(`Tool with ID ${toolId} has been updated with new quantities: current_quantity=${newQuantity}, good_quantity=${goodQuantity}, damage_quantity=${damageQuantity}`);
  } catch (error) {
    console.error('Error updating tool quantity:', error);
    throw error;
  }
}

async function deleteTool(toolId) {
  const db = firestore;
  const toolDocRef = doc(db, 'tools', toolId);

  // Delete the document
  await deleteDoc(toolDocRef);
}

async function uploadImageAndGetUrl(file) {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);
  return fileUrl;
}

function fetchAllBorrowers(callback) {
  const db = firestore;
  const borrowerCollection = collection(db, 'borrower');

  // Set up a real-time listener
  const unsubscribe = onSnapshot(borrowerCollection, (querySnapshot) => {
    const rows = querySnapshot.docs.map(doc => ({
      ...doc.data(), // Spread the document data
      id: doc.id // Include the document ID
    }));

    // Execute the callback with the updated data
    callback(rows);
  });

  return unsubscribe;
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

async function fetchAdminApprovedBorrowersCount() {
  const db = firestore;
  const borrowerCollection = collection(db, 'borrower');

  // Create a query to filter borrowers with admin approved status
  const adminApprovedQuery = query(borrowerCollection, where('isApproved', '==', 'admin approved'));

  try {
    // Fetch the documents using the query
    const querySnapshot = await getDocs(adminApprovedQuery);

    // Count the number of documents
    const count = querySnapshot.size;

    console.log(`Number of admin approved borrowers: ${count}`);
    return count;
  } catch (error) {
    console.error('Error fetching admin approved borrowers count:', error);
    throw error;
  }
}

async function fetchBorrowerEquipmentDetails() {
  try {
    const borrowerCollection = collection(firestore, 'borrower');
    const adminApprovedQuery = query(borrowerCollection, where('isApproved', '==', 'admin approved'));
    const querySnapshot = await getDocs(adminApprovedQuery);

    const equipmentDetailsList = querySnapshot.docs.map(doc => doc.data().equipmentDetails || []);
    return equipmentDetailsList.flat(); // Flatten the array of arrays
  } catch (error) {
    console.error('Error fetching equipment details for admin approved borrowers:', error);
    throw error;
  }
}

async function fetchBorrowerEquipmentDetails_Returned() {
  try {
    const borrowerCollection = collection(firestore, 'borrower');
    const adminApprovedQuery = query(borrowerCollection, where('isApproved', '==', 'returned'));
    const querySnapshot = await getDocs(adminApprovedQuery);

    const equipmentDetailsList = querySnapshot.docs.map(doc => doc.data().equipmentDetails || []);
    return equipmentDetailsList.flat(); // Flatten the array of arrays
  } catch (error) {
    console.error('Error fetching equipment details for admin approved borrowers:', error);
    throw error;
  }
}

function addAdminApprovedBorrowersListener(callback) {
  const db = firestore;
  const borrowerCollection = collection(db, 'borrower');

  // Create a query to filter borrowers with admin approved status
  const adminApprovedQuery = query(borrowerCollection, where('isApproved', '==', 'admin approved'));

  // Listen for real-time updates
  const unsubscribe = onSnapshot(adminApprovedQuery, (snapshot) => {
    const count = snapshot.size;
    callback(count);
  }, (error) => {
    console.error('Error listening to admin approved borrowers:', error);
  });

  return unsubscribe;
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

async function updateBorrower(borrowerId, updatedData) {
  const db = firestore;
  const borrowerDocRef = doc(db, 'borrower', borrowerId);

  // Add date of update to the updatedData object
  updatedData.dateUpdated = new Date();

  // Update the document with the new data
  await updateDoc(borrowerDocRef, updatedData);

  console.log(`Borrower with ID ${borrowerId} has been updated`);
}

// async function chartData(data) {
//   const db = firestore;
//   const batch = writeBatch(db);

//   const chartdata = collection(db, 'chartdata');
//   batch.set(doc(chartdata), data);
//   await batch.commit();
// }


// import { format, getMonth, getYear, getWeek, getWeekOfMonth } from 'date-fns';

async function chartData(data) {
  const db = firestore;
  const batch = writeBatch(db);

  const chartdataCollection = collection(db, 'chartdata');

  // Format the date to get day, month, week, weekOfMonth, and year
  const day = format(data.date, 'dd');
  const month = getMonth(data.date) + 1; // getMonth returns 0-based month
  const weekOfMonth = getWeekOfMonth(data.date);
  const year = getYear(data.date);

  // Query to check if a document with the same day, month, week, weekOfMonth, and year exists
  const q = query(
    chartdataCollection,
    where('day', '==', day),
    where('month', '==', month),
    where('weekOfMonth', '==', weekOfMonth),
    where('year', '==', year)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Document exists, update the count
    querySnapshot.forEach((docSnapshot) => {
      const docRef = doc(chartdataCollection, docSnapshot.id);
      batch.update(docRef, {
        count: docSnapshot.data().count + data.count,
      });
    });
  } else {
    // Document does not exist, create a new one
    const newDocRef = doc(chartdataCollection);
    batch.set(newDocRef, {
      ...data,
      day: day,
      month: month,
      weekOfMonth: weekOfMonth,
      year: year,
    });
  }

  await batch.commit();
}

async function fetchChartData_borrowed(callback) {
  const db = firestore;
  const chartdataCollection = collection(db, 'chartdata');

  const statBorrowed = query(chartdataCollection, where('status', '==', 'borrowed'));
  // Set up a real-time listener
  const unsubscribe = onSnapshot(statBorrowed, (querySnapshot) => {
    const rows = querySnapshot.docs.map(doc => ({
      id: doc.id, // Include the document ID
      ...doc.data() // Spread the document data
    }));

    console.log('Borrowed chart data:', rows);
    // Execute the callback with the updated data
    callback(rows);
  });

  return unsubscribe;
}

// async function fetchChartData_borrowed() {
//   cost 
// }


export default uploadTE;

export { 
  fetchAllTools, 
  countRows, 
  updateTool,
  fetchToolQuantities,
  updateToolQuantity,
  deleteTool, 
  uploadImageAndGetUrl, 
  fetchAllBorrowers, 
  uploadInstructor,
  fetchInstructors,
  deleteInstructorAcc,
  updateBorrower,
  fetchAdminApprovedBorrowersCount,
  addAdminApprovedBorrowersListener,
  fetchBorrowerEquipmentDetails,
  fetchBorrowerEquipmentDetails_Returned,
  chartData,
  fetchChartData_borrowed
}; // Export the functions for use in other modules