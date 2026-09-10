import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getDb } from "./firebase";

// Saved books live under the user, one document per book:
//   users/{uid}/library/{bookId}
// That shape means "is this book saved?" is a single getDoc rather than a
// filter over a shared collection, and it keeps one user's library private to
// them by default.
const libraryDoc = (uid, bookId) => doc(getDb(), "users", uid, "library", bookId);

export async function isInLibrary(uid, bookId) {
  const snapshot = await getDoc(libraryDoc(uid, bookId));
  return snapshot.exists();
}

export async function addToLibrary(uid, book) {
  // Store just enough to render a library card without refetching every book.
  await setDoc(libraryDoc(uid, book.id), {
    id: book.id,
    title: book.title,
    author: book.author,
    subTitle: book.subTitle ?? "",
    imageLink: book.imageLink,
    averageRating: book.averageRating ?? null,
    subscriptionRequired: Boolean(book.subscriptionRequired),
    savedAt: Date.now(),
  });
}

export async function removeFromLibrary(uid, bookId) {
  await deleteDoc(libraryDoc(uid, bookId));
}

// A book counts as finished once the audio reaches the end — that is the rule
// the documentation gives for the Library page's "Finished" section.
const finishedDoc = (uid, bookId) => doc(getDb(), "users", uid, "finished", bookId);

export async function markFinished(uid, book) {
  await setDoc(finishedDoc(uid, book.id), {
    id: book.id,
    title: book.title,
    author: book.author,
    subTitle: book.subTitle ?? "",
    imageLink: book.imageLink,
    averageRating: book.averageRating ?? null,
    subscriptionRequired: Boolean(book.subscriptionRequired),
    finishedAt: Date.now(),
  });
}

// Reads for the Library page. Newest first, so a book you just saved is at the
// front rather than buried.
async function listCollection(uid, name, orderField) {
  const snapshot = await getDocs(
    query(collection(getDb(), "users", uid, name), orderBy(orderField, "desc"))
  );
  return snapshot.docs.map((d) => d.data());
}

export const listLibrary = (uid) => listCollection(uid, "library", "savedAt");
export const listFinished = (uid) => listCollection(uid, "finished", "finishedAt");
