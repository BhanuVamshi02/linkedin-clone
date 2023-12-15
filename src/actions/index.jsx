import { signInWithPopup } from "firebase/auth"; // Import signInWithPopup from the auth module
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "./actionType";
import db from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, provider, storage } from "../firebase"; // Ensure you have correctly initialized auth and provider

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});
// Import the previously initialized auth and provider objects

export function signInAPI() {
  return (dispatch) => {
    signInWithPopup(auth, provider) // Use signInWithPopup from the auth module
      .then((payload) => {
        console.log(payload.user);
        dispatch(setUser(payload.user));
      })
      .catch((error) => alert(error.message));
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function postArticleAPI(payload) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    if (payload.image) {
      const storageRef = ref(storage, `images/${payload.image.name}`);
      const uploadTask = uploadBytes(storageRef, payload.image);

      const snapshot = await uploadTask;

      // Get the download URL after the upload is complete.
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Add the data to the Firestore collection.
      await addDoc(collection(db, "articles"), {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        shareImg: downloadURL,
        comments: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    } else if (payload.video) {
      // Add the data to the Firestore collection.
      await addDoc(collection(db, "articles"), {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        shareImg: "",
        comments: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    }
  };
}

export function getArticlesAPI() {
  return (dispatch) => {
    let payload;

    // Create a query to order the articles by date in descending order
    const q = query(collection(db, "articles"), orderBy("actor.date", "desc"));

    // Use the `onSnapshot` function to listen for changes in the query results
    onSnapshot(q, (snapshot) => {
      payload = snapshot.docs.map((doc) => doc.data());
      console.log(payload);
      dispatch(getArticles(payload));
    });
  };
}
