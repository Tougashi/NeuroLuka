import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Why from "@/components/Why";

import 'remixicon/fonts/remixicon.css';
import Footer from "@/components/Footer";
import AboutUs from "@/components/AboutUs";


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Why />
      <AboutUs />
      <Footer />
      <div className="container mx-auto px-4">
        {/* <h1>Yogi</h1> */}
      </div>
    </>
  );
}
