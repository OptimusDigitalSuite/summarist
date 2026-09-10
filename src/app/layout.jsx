import "./globals.css";
import Providers from "./providers";
import AuthModal from "@/components/AuthModal";

export const metadata = {
  title: "Summarist — Gain more knowledge in less time",
  description:
    "Read and listen to key insights from thousands of bestselling nonfiction books in 15 minutes.",
};

// Root layout: everything below it re-renders on navigation, this does not —
// which is why the Redux store, the auth listener and the modal live here.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <AuthModal />
        </Providers>
      </body>
    </html>
  );
}
