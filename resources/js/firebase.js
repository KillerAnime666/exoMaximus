// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs,
    onSnapshot,
    deleteDoc,
    doc,
    getDoc,
    updateDoc
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'  

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMAEpynxBRzIvjc7qema3bIWJ7WVyr5jU",
  authDomain: "inventario-b90e4.firebaseapp.com",
  databaseURL: "https://inventario-b90e4-default-rtdb.firebaseio.com",
  projectId: "inventario-b90e4",
  storageBucket: "inventario-b90e4.appspot.com",
  messagingSenderId: "820394038166",
  appId: "1:820394038166:web:c12ad28f53d7bd0fcac3b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export const saveTask = (producto, cantidad, precio_unitario, fecha_compra) => {
  addDoc(collection(db, 'productos'), {producto, cantidad, precio_unitario, fecha_compra});
}

export const getTasks = () => getDocs(collection(db, 'productos'));

export const onGetTask = (callback) => onSnapshot(collection(db, 'productos'), callback);

export const deleteTask = id => deleteDoc(doc(db, 'productos', id));

export const getTask = id => getDoc(doc(db, 'productos', id));

export const updateTask = (id, newFields) => updateDoc(doc(db, 'productos', id), newFields);

