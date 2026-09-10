"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { useSearchBooksQuery } from "@/redux/booksApi";

// 300ms debounce, the interval the documentation says FES used. The input
// updates on every keystroke (so typing stays responsive) but `debounced` —
// the value the query actually runs on — only catches up once typing pauses.
function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // every keystroke cancels the pending one
  }, [value, delay]);

  return debounced;
}

export default function Searchbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debounced = useDebounced(search);

  const { data: results, isFetching } = useSearchBooksQuery(debounced, {
    skip: debounced.trim().length === 0,
  });

  const open = debounced.trim().length > 0;

  const goToBook = (id) => {
    setSearch("");
    router.push(`/book/${id}`);
  };

  return (
    <div className="search">
      <div className="search__wrapper">
        <div className="search__content">
          <div className="search__input--wrapper">
            <input
              className="search__input"
              type="search"
              placeholder="Search for books"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="search__icon">
              <AiOutlineSearch />
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="search__books--wrapper">
          {isFetching && <div className="search__book--empty">Searching…</div>}

          {!isFetching && results?.length === 0 && (
            <div className="search__book--empty">No books found.</div>
          )}

          {!isFetching &&
            results?.map((book) => (
              <button
                type="button"
                className="search__book--link"
                key={book.id}
                onClick={() => goToBook(book.id)}
              >
                <figure className="search__book--image-wrapper">
                  <Image
                    src={book.imageLink}
                    alt={book.title}
                    width={80}
                    height={80}
                    className="book__image"
                  />
                </figure>
                <div>
                  <div className="search__book--title">{book.title}</div>
                  <div className="search__book--author">{book.author}</div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
