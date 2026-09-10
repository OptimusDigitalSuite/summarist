"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useGetBookByIdQuery } from "@/redux/booksApi";
import { openLogin } from "@/redux/modalSlice";
import {
  selectIsSignedIn,
  selectIsSubscribed,
  selectAuthLoading,
  selectUser,
} from "@/redux/userSlice";
import { markFinished } from "@/lib/library";
import AudioPlayer from "@/components/app/AudioPlayer";

export default function PlayerPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: book, isLoading, isError } = useGetBookByIdQuery(id);
  const signedIn = useSelector(selectIsSignedIn);
  const subscribed = useSelector(selectIsSubscribed);
  const authLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);

  const locked = Boolean(book?.subscriptionRequired) && !subscribed;

  // The book page gates before it sends anyone here, but the URL is guessable —
  // so the same rules are enforced again on arrival. Waits for auth to resolve
  // first, otherwise a refresh would bounce a signed-in user.
  useEffect(() => {
    if (authLoading || isLoading || !book) return;
    if (!signedIn) {
      dispatch(openLogin());
      return;
    }
    if (locked) router.replace("/choose-plan");
  }, [authLoading, isLoading, book, signedIn, locked, dispatch, router]);

  if (isLoading || authLoading) return <PlayerSkeleton />;
  if (isError || !book) {
    return <div className="app__error">Could not load this book. Try refreshing.</div>;
  }
  if (!signedIn) {
    return <div className="app__error">Log in to read or listen to this book.</div>;
  }
  if (locked) return <PlayerSkeleton />;

  return (
    <div className="player">
      <div className="player__title">{book.title}</div>
      <div className="player__summary">{book.summary}</div>

      <AudioPlayer
        book={book}
        onFinished={() => {
          if (user?.uid) markFinished(user.uid, book).catch(() => {});
        }}
      />
    </div>
  );
}

function PlayerSkeleton() {
  return (
    <div className="player">
      <div className="skeleton" style={{ width: "60%", height: 28 }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width: i % 3 === 2 ? "70%" : "100%", height: 14, marginTop: 14 }}
        />
      ))}
    </div>
  );
}
