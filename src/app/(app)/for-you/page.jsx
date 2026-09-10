"use client";

import {
  useGetSelectedBookQuery,
  useGetRecommendedBooksQuery,
  useGetSuggestedBooksQuery,
} from "@/redux/booksApi";
import SelectedBook, { SelectedBookSkeleton } from "@/components/app/SelectedBook";
import BookCard, { BookCardSkeleton } from "@/components/app/BookCard";

export default function ForYouPage() {
  const selected = useGetSelectedBookQuery();
  const recommended = useGetRecommendedBooksQuery();
  const suggested = useGetSuggestedBooksQuery();

  return (
    <div className="for-you">
      <div className="for-you__title">Selected just for you</div>
      {selected.isLoading ? <SelectedBookSkeleton /> : null}
      {selected.data ? <SelectedBook book={selected.data} /> : null}
      {selected.isError ? <Failed what="the selected book" /> : null}

      <Row
        title="Recommended For You"
        subtitle="We think you’ll like these"
        query={recommended}
      />
      <Row
        title="Suggested Books"
        subtitle="Browse those books"
        query={suggested}
      />
    </div>
  );
}

function Row({ title, subtitle, query }) {
  return (
    <>
      <div className="for-you__title">{title}</div>
      <div className="for-you__sub--title">{subtitle}</div>
      <div className="for-you__recommended--books">
        {query.isLoading &&
          Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />)}
        {query.data?.map((book) => (
          <BookCard book={book} key={book.id} />
        ))}
      </div>
      {query.isError && <Failed what={title.toLowerCase()} />}
    </>
  );
}

function Failed({ what }) {
  return (
    <div className="app__error">
      Could not load {what}. Check your connection and refresh.
    </div>
  );
}
