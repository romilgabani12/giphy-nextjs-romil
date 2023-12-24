import Header from "./header"

import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";
import Trending from "./components/Trending";

export default function Home() {
  return (
    <>
      <Header />

      <div>
        <Trending />
      </div>
    </>

  )
}
