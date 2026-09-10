"use client";

import Image from "next/image";
import Link from "next/link";
import { BsPlayCircle } from "react-icons/bs";
import { useAudioDuration, formatDuration } from "@/lib/useAudioDuration";

export default function SelectedBook({ book }) {
  const duration = useAudioDuration(book.audioLink);

  return (
    <Link className="selected__book" href={`/book/${book.id}`}>
      <div className="selected__book--sub-title">{book.subTitle}</div>
      <div className="selected__book--line" />
      <div className="selected__book--content">
        <figure className="book__image--wrapper selected__book--image-wrapper">
          <Image
            className="book__image"
            src={book.imageLink}
            alt={book.title}
            width={140}
            height={140}
          />
        </figure>
        <div className="selected__book--text">
          <div className="selected__book--title">{book.title}</div>
          <div className="selected__book--author">{book.author}</div>
          <div className="selected__book--duration-wrapper">
            <div className="selected__book--icon">
              <BsPlayCircle />
            </div>
            <div className="selected__book--duration">{formatDuration(duration)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function SelectedBookSkeleton() {
  return (
    <div className="selected__book">
      <div className="skeleton" style={{ width: "70%", height: 16 }} />
      <div className="selected__book--line" />
      <div className="selected__book--content">
        <div className="skeleton" style={{ width: 140, height: 140 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: "80%", height: 16 }} />
          <div className="skeleton" style={{ width: "40%", height: 12, marginTop: 12 }} />
          <div className="skeleton" style={{ width: "50%", height: 12, marginTop: 12 }} />
        </div>
      </div>
    </div>
  );
}
