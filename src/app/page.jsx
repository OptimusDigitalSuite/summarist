import "./home.css";
import Nav from "@/components/home/Nav";
import Landing from "@/components/home/Landing";
import Features from "@/components/home/Features";
import Reviews from "@/components/home/Reviews";
import Numbers from "@/components/home/Numbers";
import Footer from "@/components/home/Footer";

// The home page markup and styles are the ones Frontend Simplified supplies
// (github.com/hannamitri/summarist-home-page), ported to components with the
// img tags filled in and react-icons dropped into the icon slots. home.css is
// their stylesheet, imported here so it only loads on this route.
export default function HomePage() {
  return (
    <>
      <Nav />
      <Landing />
      <Features />
      <Reviews />
      <Numbers />
      <Footer />
    </>
  );
}
