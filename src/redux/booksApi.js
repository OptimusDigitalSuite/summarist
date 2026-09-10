import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// The four documented endpoints, all off the same Firebase Functions base.
// RTK Query gives us the loading flags the skeleton states key off, plus
// caching — revisiting /for-you does not refetch the same three lists.
export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://us-central1-summaristt.cloudfunctions.net/",
  }),
  endpoints: (builder) => ({
    // getBooks?status=selected returns a SINGLE book object, not an array —
    // the docs are explicit about that, and it is the one endpoint whose shape
    // differs. Unwrapped here so callers never have to care.
    getSelectedBook: builder.query({
      query: () => "getBooks?status=selected",
      transformResponse: (response) =>
        Array.isArray(response) ? response[0] : response,
    }),
    getRecommendedBooks: builder.query({
      query: () => "getBooks?status=recommended",
    }),
    getSuggestedBooks: builder.query({
      query: () => "getBooks?status=suggested",
    }),
    getBookById: builder.query({
      query: (id) => `getBook?id=${id}`,
    }),
    searchBooks: builder.query({
      query: (search) => `getBooksByAuthorOrTitle?search=${encodeURIComponent(search)}`,
    }),
  }),
});

export const {
  useGetSelectedBookQuery,
  useGetRecommendedBooksQuery,
  useGetSuggestedBooksQuery,
  useGetBookByIdQuery,
  useSearchBooksQuery,
} = booksApi;
