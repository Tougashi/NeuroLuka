import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sosmed from "@/components/Sosmed";
import About from "@/components/About";

import 'remixicon/fonts/remixicon.css';
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Sosmed />
      <About />
      <Footer />
      <div className="container mx-auto px-4">
        {/* <h1>Yogi</h1> */}
      </div>
    </>
  );
}
