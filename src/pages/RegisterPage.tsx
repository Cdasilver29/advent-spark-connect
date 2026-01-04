import Navigation from "@/components/Navigation";
import RegistrationForm from "@/components/RegistrationForm";
import Footer from "@/components/Footer";

const RegisterPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      <RegistrationForm />
      <Footer />
    </div>
  );
};

export default RegisterPage;
