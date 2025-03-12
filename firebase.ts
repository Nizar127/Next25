import firebase from "@react-native-firebase/app"
import "@react-native-firebase/auth"
import "@react-native-firebase/firestore"
import "@react-native-firebase/storage"

const firebaseConfig = {
  // Your firebase config here
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase

