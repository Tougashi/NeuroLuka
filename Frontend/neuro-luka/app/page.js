import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FAQ from "@/components/FAQ";
import Why from "@/components/Why";
import HowWorks from "@/components/HowWorks";
import 'remixicon/fonts/remixicon.css';
import Footer from "@/components/Footer";
import AboutUs from "@/components/AboutUs";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowWorks />
      <AboutUs />
      <FAQ />
      <Why />
      <Footer />
    </>
  );
}
