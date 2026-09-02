import ContactSection from "../../components/public/ContactSection";
import HaircutsCarousel from "../../components/public/HaircutsCarousel";
import Hero from "../../components/public/Hero";
import HowToBookSection from "../../components/public/HowToBookSection";
import ServicesSection from "../../components/public/ServicesSection";

const Home = () => {
  return (
    <>
      <Hero />

      <ServicesSection />

      <HaircutsCarousel />

      <HowToBookSection />

      <ContactSection />
    </>
  );
};

export default Home;