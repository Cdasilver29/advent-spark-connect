import Navigation from "@/components/Navigation";
import EventProgram from "@/components/EventProgram";
import EventDetails from "@/components/EventDetails";
import Footer from "@/components/Footer";

const ProgramPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      <EventDetails />
      <EventProgram />
      <Footer />
    </div>
  );
};

export default ProgramPage;
