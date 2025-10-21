import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-secondary" fill="currentColor" />
              <h3 className="text-xl font-bold">Adventist Singles Spark</h3>
            </div>
            <p className="text-white/80 mb-4">
              Connecting Adventist hearts and creating happy lasting relationships.
            </p>
            <p className="text-secondary font-semibold italic">
              "Equally Yoked" - 2 Corinthians 6:14
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span>info@adventistspark.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span>+254 XXX XXX XXX</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#about" className="hover:text-secondary transition-colors">
                  About the Event
                </a>
              </li>
              <li>
                <a href="#tickets" className="hover:text-secondary transition-colors">
                  Get Tickets
                </a>
              </li>
              <li>
                <a href="https://www.adventist.org" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  Adventist.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Adventist Singles Spark. All rights reserved.</p>
          <p className="mt-2">An initiative of the Seventh-day Adventist Church community</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
