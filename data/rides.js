import { getFirestore, collection, addDoc, getDocs, doc } from "firebase/firestore";
import { app } from "../my-second-app/firebaseConfig.js";
const db = getFirestore(app);

const addRecord = async (collectionName = "rides", body = []) => {
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

const getAllRecords = async (collectionName = "rides") => {
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

const deleteRecord = async (collectionName = "rides", id) => {
  try {
    const dataCollection = collection(db, collectionName);
    await deleteDoc(doc(db, dataCollection, id));
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

export default {
  addRecord,
  getAllRecords,
  deleteRecord,
  getUserByEmail,
};
