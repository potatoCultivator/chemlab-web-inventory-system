import { firestore, storage, auth } from '../firebase'; // Adjust the path as necessary
import { collection, query, where, writeBatch, doc, getDocs, updateDoc, deleteDoc, onSnapshot, getDoc, setDoc } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { sendEmail } from './emailService'; // Import the email service
import { getMonth, getYear, getWeekOfMonth, getDate } from 'date-fns';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth';

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

// /**
//  * Uploads a new instructor to Firestore and sends a welcome email with a password.
//  * @param {Object} instructorData - Object containing instructor's information.
//  * @param {string} instructorData.name 
//  * @param {string} instructorData.email - Instructor's email.
//  * @param {string} instructorData.subject - Subject taught by the instructor.
//  * @param {string} instructorData.position - Position held by the instructor.
//  * @param {string} instructorData.department - Department the instructor belongs to.
//  * @param {string} instructorData.password - Instructor's temporary password (not stored in Firestore).
//  * @returns {Promise<Object>} - Resolves with a success message if the upload is successful.
//  */
// async function uploadInstructor({ email, password, name, subject, position, department }) {
//   const db = firestore;

//   try {
//     // Begin a batch write
//     const batch = writeBatch(db);
//     const instructorsCollection = collection(db, 'instructor');
//     const newInstructorDoc = doc(instructorsCollection);

//     // Add instructor data to batch (excluding password)
//     batch.set(newInstructorDoc, { email, name, subject, position, department });

//     // Commit the batch to Firestore
//     await batch.commit();

//     // Prepare email content with password (not saved in Firestore)
//     const emailText = `Your account has been created. Your login details:\n\nEmail: ${email}\nPassword: ${password}`;
//     const toName = name;
//     const fromName = 'Your Organization Name'; // Replace with your organization’s name

//     // Send a welcome email with the password
//     await sendEmail(email, toName, fromName, emailText);
//     console.log('Email sent successfully');

//     return { success: true, message: 'Instructor uploaded and email sent successfully' };
//   } catch (error) {
//     console.error("Error uploading instructor:", error);
//     throw new Error('Failed to upload instructor and send email.');
//   }
// }


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

async function fetchBorrowers(callback) {
  const borrowerCollection = collection(firestore, 'borrower');

  // Filter only borrowers with isApproved set to 'returned', 'admin approved', or 'pending return'
  const returnedBorrowersQuery = query(
    borrowerCollection,
    where('isApproved', 'in', ['returned', 'admin approved', 'pending return']) // Fixed closing parenthesis
  );

  // Set up a real-time listener with the filtered query
  const unsubscribe = onSnapshot(returnedBorrowersQuery, (querySnapshot) => {
    const rows = querySnapshot.docs.map((doc) => ({
      ...doc.data(), // Spread the document data
      id: doc.id // Include the document ID
    }));

    // Execute the callback with the filtered data
    callback(rows);
  });

  return unsubscribe;
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

async function chartData(data) {
  try {
    const db = firestore;
    const batch = writeBatch(db);

    const chartdataCollection = collection(db, 'chartdata');

    // Format the date to get day, month, weekOfMonth, and year
    const day = getDate(data.date); // Use getDate to get the day as a number
    const month = getMonth(data.date) + 1; // getMonth returns 0-based month
    const weekOfMonth = getWeekOfMonth(data.date);
    const year = getYear(data.date);

    // Query to check if a document with the same day, month, weekOfMonth, year, and status exists
    const q = query(
      chartdataCollection,
      where('day', '==', day),
      where('month', '==', month),
      where('weekOfMonth', '==', weekOfMonth),
      where('year', '==', year),
      where('status', '==', data.status) // Filter by status (borrowed or returned)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Document exists with the same status, update the count
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
  } catch (error) {
    console.error('Error updating chart data:', error);
  }
}


async function fetchChartData(callback, status) {
  try {
    const db = firestore;
    const chartdataCollection = collection(db, 'chartdata');
    const statQuery = query(chartdataCollection, where('status', '==', status));

    const unsubscribe = onSnapshot(statQuery, (querySnapshot) => {
      const rows = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`Fetched data for status '${status}':`, rows); // Log fetched data
      callback(rows); // Pass data to the callback
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
}


/**
 * Registers a new user with Firebase Authentication and saves user data in Firestore.
 * @param {Object} userInfo - Object containing user's information.
 * @param {string} userInfo.email - User's email.
 * @param {string} userInfo.password - User's password.
 * @param {string} userInfo.firstname - User's first name.
 * @param {string} userInfo.lastname - User's last name.
 * @returns {Promise} - Resolves if the user is registered successfully.
 */
async function registerUser({ email, password, firstname, lastname }) {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional data in Firestore
    await setDoc(doc(firestore, 'admin_users', user.uid), {
      firstname,
      lastname,
      email
    });

    return { success: true };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(error.message);
  }
}

async function loginUser({ email, password }) {
  try {
    // Log in the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    console.log("User logged in:", userCredential.user);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error(error.message);
  }
}

const fetchUserProfile = async (uid) => {
  const db = firestore;

  if (!uid) {
    const user = auth.currentUser; // Get the current user if uid is not provided
    if (!user) {
      throw new Error('No user is signed in.');
    }
    uid = user.uid;
  }

  try {
    const userDocRef = doc(db, 'admin_users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data(); // Return the user data
    } else {
      throw new Error('User profile not found.');
    }
  } catch (error) {
    throw new Error(`Error fetching user profile: ${error.message}`);
  }
};

const updateUserProfile = async (uid, updatedData) => {
  const db = firestore;
  const docRef = doc(db, 'admin_users', uid); // Reference to the user document in Firestore
  try {
    await updateDoc(docRef, updatedData); // Update the document with new data
    console.log('Profile updated successfully.');
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};


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
  fetchChartData,
  registerUser,
  loginUser,
  fetchUserProfile,
  updateUserProfile,
  fetchBorrowers
}; // Export the functions for use in other modules