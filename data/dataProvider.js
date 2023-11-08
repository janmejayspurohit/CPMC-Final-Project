import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
const db = getFirestore(app);

const addRecords = async (collectionName, body) => {
  if (!collectionName || !body) throw new Error("Missing data for this operation!");
  try {
    const dataCollection = collection(db, collectionName);
    for (const item of body) {
      addDoc(dataCollection, item)
        .then((docRef) => {
          console.log(`Added data with ID: ${docRef.id}`);
        })
        .catch((error) => {
          console.error(`Error adding data: ${error}`);
        });
    }
  } catch (error) {
    console.error("Error adding data to firestore:", error);
  }
};

const getAllRecords = async (collectionName) => {
  if (!collectionName) throw new Error("Missing data for this operation!");
  try {
    const dataCollection = collection(db, collectionName);
    const data = await getDocs(dataCollection);
    const dataArray = data.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return dataArray;
  } catch (error) {
    console.error("Error getting data from firestore:", error);
  }
};

const getRecordById = async (collectionName, id) => {
  if (!collectionName || !id) throw new Error("Missing data for this operation!");
  try {
    const dataCollection = collection(db, collectionName);
    const data = await getDocs(dataCollection);
    const dataArray = data.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    const record = dataArray.find((record) => record.id === id);
    return record;
  } catch (error) {
    console.error("Error getting data from firestore:", error);
  }
};

const updateRecord = async (collectionName, id, body) => {
  if (!collectionName || !id || !body) throw new Error("Missing data for this operation!");
  try {
    const dataCollection = collection(db, collectionName);
    await updateDoc(doc(dataCollection, id), body);
  } catch (error) {
    console.error("Error updating data in firestore:", error);
  }
};

const deleteRecord = async (collectionName, id) => {
  if (!collectionName || !id) throw new Error("Missing data for this operation!");
  try {
    const dataCollection = doc(db, collectionName, id);
    await deleteDoc(dataCollection);
  } catch (error) {
    console.error("Error deleting data from firestore:", error);
  }
};

const getUserByEmail = async (email) => {
  try {
    const dataCollection = collection(db, "users");
    const data = await getDocs(dataCollection);
    const dataArray = data.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    const user = dataArray.find((user) => user.email === email);
    return user;
  } catch (error) {
    console.error("Error getting data from firestore:", error);
  }
};

export {
  addRecords, // C
  getAllRecords, // R
  getRecordById, // R
  updateRecord, // U
  deleteRecord, // D
  getUserByEmail,
};
