import { useEffect } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Activities from "@/components/Activities";
import EventDetails from "@/components/EventDetails";
import EventFlyers from "@/components/EventFlyers";
import Tickets from "@/components/Tickets";
import RegistrationForm from "@/components/RegistrationForm";
import EventProgram from "@/components/EventProgram";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "Adventist Singles Spark - Equally Yoked";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Join Adventist Singles Spark - a faith-based matchmaking event for Adventist singles. Speed dating, team building, and meaningful connections. Equally Yoked."
      );
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Activities />
      <EventDetails />
      <EventFlyers />
      <Tickets />
      <RegistrationForm />
      <EventProgram />
      <Footer />
    </div>
  );
};

export default Index;
