import Navigation from "@/components/Navigation";
import Tickets from "@/components/Tickets";
import EventFlyers from "@/components/EventFlyers";
import Footer from "@/components/Footer";

const TicketsPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      <Tickets />
      <EventFlyers />
      <Footer />
    </div>
  );
};

export default TicketsPage;
