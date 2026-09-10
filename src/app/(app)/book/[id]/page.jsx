"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineStar,
  AiOutlineClockCircle,
  AiOutlineAudio,
  AiOutlineBook,
} from "react-icons/ai";
import { HiOutlineBookmark, HiBookmark } from "react-icons/hi";
import { useGetBookByIdQuery } from "@/redux/booksApi";
import { openLogin } from "@/redux/modalSlice";
import {
  selectIsSignedIn,
  selectUser,
  selectIsSubscribed,
  selectAuthLoading,
} from "@/redux/userSlice";
import { addToLibrary, removeFromLibrary, isInLibrary } from "@/lib/library";
import BookPageSkeleton from "@/components/app/BookPageSkeleton";
import { useAudioDuration, formatDuration } from "@/lib/useAudioDuration";

export default function BookPage({ params }) {
  // Next 16 hands params in as a promise; `use` unwraps it.
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: book, isLoading, isError } = useGetBookByIdQuery(id);
  const signedIn = useSelector(selectIsSignedIn);
  const subscribed = useSelector(selectIsSubscribed);
  const user = useSelector(selectUser);
  const authLoading = useSelector(selectAuthLoading);
  const duration = useAudioDuration(book?.audioLink);

  const [saved, setSaved] = useState(false);
  const [savingError, setSavingError] = useState(null);

  // Reflect whether this book is already in the library. Re-runs when the user
  // signs in, so the bookmark is right straight after the modal closes.
  // Nothing is set synchronously here — the signed-out case is handled by
  // gating on `signedIn` at render time instead, which keeps this effect from
  // triggering an extra render pass on every mount.
  useEffect(() => {
    if (!user?.uid || !book?.id) return;
    let ignore = false;
    isInLibrary(user.uid, book.id)
      .then((result) => {
        if (!ignore) setSaved(result);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [user?.uid, book?.id]);

  if (isLoading) return <BookPageSkeleton />;
  if (isError || !book) {
    return <div className="app__error">Could not load this book. Try refreshing.</div>;
  }

  const premiumLocked = book.subscriptionRequired && !subscribed;
  const showSaved = signedIn && saved;

  // The gate the documentation spells out, in order: signed out opens the
  // modal, premium-and-unsubscribed goes to the sales page, everything else
  // opens the player.
  const onReadOrListen = () => {
    // Firebase restores the session asynchronously after a page load. Until it
    // answers, "signed out" is not yet true — acting on it here would throw the
    // login modal at someone who is already logged in.
    if (authLoading) return;
    if (!signedIn) {
      dispatch(openLogin());
      return;
    }
    router.push(premiumLocked ? "/choose-plan" : `/player/${book.id}`);
  };

  const onToggleLibrary = async () => {
    if (authLoading) return;
    if (!signedIn) {
      dispatch(openLogin());
      return;
    }
    setSavingError(null);
    try {
      if (showSaved) {
        await removeFromLibrary(user.uid, book.id);
        setSaved(false);
      } else {
        await addToLibrary(user.uid, book);
        setSaved(true);
      }
    } catch {
      setSavingError(
        "Could not save this book. Create the Firestore database in the Firebase console."
      );
    }
  };

  return (
    <div className="book">
      <div className="book__content--wrapper">
        <div className="book__content">
          <div className="book__title">
            {book.title}
            {book.subscriptionRequired ? " (Premium)" : ""}
          </div>
          <div className="book__author">{book.author}</div>
          <div className="book__sub--title">{book.subTitle}</div>

          <div className="book__description--wrapper">
            <div className="book__stats--wrapper">
              <Stat icon={<AiOutlineStar />} text={`${book.averageRating} (${book.totalRating} ratings)`} />
              <Stat icon={<AiOutlineClockCircle />} text={formatDuration(duration)} />
              <Stat icon={<AiOutlineAudio />} text={book.type} />
              <Stat icon={<AiOutlineBook />} text={`${book.keyIdeas} key ideas`} />
            </div>
          </div>

          <div className="book__read--btn-wrapper">
            <button
              type="button"
              className="book__read--btn"
              onClick={onReadOrListen}
              disabled={authLoading}
            >
              <AiOutlineBook /> Read
            </button>
            <button
              type="button"
              className="book__read--btn"
              onClick={onReadOrListen}
              disabled={authLoading}
            >
              <AiOutlineAudio /> Listen
            </button>
          </div>

          <button
            type="button"
            className="book__bookmark"
            onClick={onToggleLibrary}
            disabled={authLoading}
          >
            {showSaved ? <HiBookmark /> : <HiOutlineBookmark />}
            {showSaved ? "Saved in My Library" : "Add title to My Library"}
          </button>
          {savingError && <div className="app__error">{savingError}</div>}

          <div className="book__secondary--title">What&rsquo;s it about?</div>
          <div className="book__tags--wrapper">
            {book.tags?.map((tag) => (
              <div className="book__tag" key={tag}>
                {tag}
              </div>
            ))}
          </div>
          <div className="book__book--description">{book.bookDescription}</div>

          <h2 className="book__secondary--title">About the author</h2>
          <div className="book__author--description">{book.authorDescription}</div>
        </div>

        <figure className="book__img--wrapper">
          <Image src={book.imageLink} alt={book.title} width={300} height={300} />
        </figure>
      </div>
    </div>
  );
}

function Stat({ icon, text }) {
  return (
    <div className="book__stats">
      <div className="book__stats--icon">{icon}</div>
      <div className="book__stats--text">{text}</div>
    </div>
  );
}
