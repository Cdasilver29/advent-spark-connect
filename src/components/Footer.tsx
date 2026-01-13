import { Heart, Mail, Phone, MapPin, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footer = document.getElementById('footer');
    if (footer) observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  return (
    <footer id="footer" className="bg-primary text-white py-12 overflow-hidden">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center gap-2 mb-4 group">
              <Heart className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
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
          <div 
            className={`transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                <Mail className="w-5 h-5 text-secondary" />
                <span>info@adventistspark.com</span>
              </li>
              <li className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                <Phone className="w-5 h-5 text-secondary" />
                <span>0729435125 / 0729032522</span>
              </li>
              <li className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div 
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link to="/about" className="hover:text-secondary hover:translate-x-2 inline-block transition-all duration-300">
                  About the Event
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-secondary hover:translate-x-2 inline-block transition-all duration-300">
                  Activities
                </Link>
              </li>
              <li>
                <Link to="/tickets" className="hover:text-secondary hover:translate-x-2 inline-block transition-all duration-300">
                  Get Tickets
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-secondary hover:translate-x-2 inline-block transition-all duration-300">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/program" className="hover:text-secondary hover:translate-x-2 inline-block transition-all duration-300">
                  Event Program
                </Link>
              </li>
              <li>
                <a href="https://www.adventist.org" target="_blank" rel="noopener noreferrer" className="hover:text-secondary hover:translate-x-2 inline-block transition-all duration-300">
                  Adventist.org
                </a>
              </li>
              <li>
                <Link to="/auth" className="hover:text-secondary hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300">
                  <Settings className="w-4 h-4" />
                  Manager Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className={`border-t border-white/20 pt-8 text-center text-white/60 text-sm transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p>© {new Date().getFullYear()} Adventist Singles Spark. All rights reserved.</p>
          <p className="mt-2">An initiative of the Seventh-day Adventist Church community</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
