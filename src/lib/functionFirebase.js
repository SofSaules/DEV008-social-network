import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  query,
  arrayUnion,
  arrayRemove,

} from 'firebase/firestore';

import { auth, db } from './configFirebase.js';

export const ingresarGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export function signIn(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// añadir documento a la coleccion y guardarlo
export const savePost = (userName, publish, photoURL, dateNow, userEmail) => addDoc(collection(db, 'post'), {
  user: userName,
  post: publish,
  photo: photoURL,
  date: dateNow,
  email: userEmail,
  likes: [],
});
// console.log("Document written with ID: ", docRef.id);

// obtener posts
// export const getPosts = () => getDocs(collection(db, 'post'));
export const getPosts = () => {
  const postReference = collection(db, 'post');
  const postOrdered = query(postReference, orderBy('date', 'desc'));
  return getDocs(postOrdered);
};

// eliminar post
export const deletePost = (id) => deleteDoc(doc(db, 'post', id));

// obtener un post
export const getPost = (id) => getDoc(doc(db, 'post', id));

// actualizar un post
export const updatePost = (id, newFields) => updateDoc(doc(db, 'post', id), newFields);

// Dar like
export const addLike = (id) => {
  const postRef = doc(db, 'post', id);
  const userEmail = auth.currentUser.email;

  // Atomically add a new region to the "regions" array field.
  updateDoc(postRef, {
    likes: arrayUnion(userEmail),
  });
};


// Dar dislike
export const disLike = (id) => {
  const postRef = doc(db, 'post', id);
  const userEmail = auth.currentUser.email;

  // Atomically remove a region from the "regions" array field.
  updateDoc(postRef, {
    likes: arrayRemove(userEmail),
  });
 
};

// Dar like
// export const addLike = (id) => updateDoc (doc(db, 'post', id), {
//   likes: arrayUnion(auth.currentUser.email)
// });

// Dar dislike
// export const disLike = (id) => updateDoc (doc(db, 'post', id), {
//   likes: arrayRemove(auth.currentUser.email),
// })