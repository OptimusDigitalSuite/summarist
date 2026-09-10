"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineStar } from "react-icons/ai";
import { openLogin } from "@/redux/modalSlice";
import { selectUser, selectIsSignedIn, selectAuthLoading } from "@/redux/userSlice";
import { listLibrary, listFinished } from "@/lib/library";

export default function LibraryPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const signedIn = useSelector(selectIsSignedIn);
  const authLoading = useSelector(selectAuthLoading);

  const [saved, setSaved] = useState(null); // null = not loaded yet
  const [finished, setFinished] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    let ignore = false;
    Promise.all([listLibrary(user.uid), listFinished(user.uid)])
      .then(([savedBooks, finishedBooks]) => {
        if (ignore) return;
        setSaved(savedBooks);
        setFinished(finishedBooks);
      })
      .catch(() => {
        if (!ignore) setError("Could not load your library. Try refreshing.");
      });
    return () => {
      ignore = true;
    };
  }, [user?.uid]);

  if (authLoading) return <LibrarySkeleton />;

  if (!signedIn) {
    return (
      <div className="library">
        <div className="library__title">My Library</div>
        <div className="settings__login--wrapper">
          <Image src="/assets/login.png" alt="Log in" width={360} height={280} />
          <div className="settings__login--text">Log in to see your saved books.</div>
          <button type="button" className="btn settings__login--btn" onClick={() => dispatch(openLogin())}>
            Login
          </button>
        </div>
      </div>
    );
  }

  if (error) return <div className="app__error">{error}</div>;
  if (saved === null) return <LibrarySkeleton />;

  return (
    <div className="library">
      <div className="library__title">Saved Books</div>
      <div className="library__sub--title">{saved.length} items</div>
      <Shelf
        books={saved}
        empty="Nothing saved yet. Open a book and hit “Add title to My Library”."
      />

      <div className="library__title">Finished</div>
      <div className="library__sub--title">{finished.length} items</div>
      <Shelf books={finished} empty="Listen to a book all the way through and it lands here." />
    </div>
  );
}

function Shelf({ books, empty }) {
  if (!books.length) return <div className="library__empty">{empty}</div>;

  return (
    <div className="for-you__recommended--books">
      {books.map((book) => (
        <Link className="for-you__recommended--books-link" href={`/book/${book.id}`} key={book.id}>
          {book.subscriptionRequired && <div className="book__pill">Premium</div>}
          <figure className="book__image--wrapper">
            <Image className="book__image" src={book.imageLink} alt={book.title} width={172} height={172} />
          </figure>
          <div className="recommended__book--title">{book.title}</div>
          <div className="recommended__book--author">{book.author}</div>
          <div className="recommended__book--sub-title">{book.subTitle}</div>
          {book.averageRating != null && (
            <div className="recommended__book--details">
              <div className="recommended__book--details-icon">
                <AiOutlineStar />
              </div>
              <div className="recommended__book--details-text">{book.averageRating}</div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}

function LibrarySkeleton() {
  return (
    <div className="library">
      <div className="library__title">My Library</div>
      <div className="for-you__recommended--books">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="for-you__recommended--books-link" key={i}>
            <div className="skeleton" style={{ width: "100%", aspectRatio: 1 }} />
            <div className="skeleton" style={{ width: "100%", height: 16, marginTop: 8 }} />
            <div className="skeleton" style={{ width: "60%", height: 12, marginTop: 8 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
