import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import EventDetails from "@/components/EventDetails";
import EventFlyers from "@/components/EventFlyers";
import Testimonials from "@/components/Testimonials";
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
      <Navigation />
      <Hero />
      <EventDetails />
      <EventFlyers />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
