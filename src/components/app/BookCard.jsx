"use client";

import Image from "next/image";
import Link from "next/link";
import { AiOutlineStar, AiOutlineClockCircle } from "react-icons/ai";
import { useAudioDuration, formatDuration } from "@/lib/useAudioDuration";

// The pill is driven by subscriptionRequired: nothing when false, "Premium"
// when true. Duration comes from the audio file's metadata, not the API.
export default function BookCard({ book }) {
  const duration = useAudioDuration(book.audioLink);

  return (
    <Link className="for-you__recommended--books-link" href={`/book/${book.id}`}>
      {book.subscriptionRequired && <div className="book__pill">Premium</div>}

      <figure className="book__image--wrapper">
        <Image
          className="book__image"
          src={book.imageLink}
          alt={book.title}
          width={172}
          height={172}
        />
      </figure>

      <div className="recommended__book--title">{book.title}</div>
      <div className="recommended__book--author">{book.author}</div>
      <div className="recommended__book--sub-title">{book.subTitle}</div>

      <div className="recommended__book--details-wrapper">
        <div className="recommended__book--details">
          <div className="recommended__book--details-icon">
            <AiOutlineClockCircle />
          </div>
          <div className="recommended__book--details-text">{formatDuration(duration)}</div>
        </div>
        <div className="recommended__book--details">
          <div className="recommended__book--details-icon">
            <AiOutlineStar />
          </div>
          <div className="recommended__book--details-text">{book.averageRating}</div>
        </div>
      </div>
    </Link>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="for-you__recommended--books-link">
      <div className="skeleton" style={{ width: 172, height: 172 }} />
      <div className="skeleton" style={{ width: "100%", height: 16, marginTop: 8 }} />
      <div className="skeleton" style={{ width: "60%", height: 12, marginTop: 8 }} />
      <div className="skeleton" style={{ width: "80%", height: 12, marginTop: 8 }} />
    </div>
  );
}
