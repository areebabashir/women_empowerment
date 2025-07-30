import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Events", href: "/events" },
    { label: "Podcasts", href: "/podcasts" },
    { label: "Gallery", href: "/gallery" },
  ];

  return (
    <footer className="bg-section-soft border-t border-border/50 text-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            <img
              src="/lovable-uploads/622c5733-7332-4b87-b1a0-b0808c1ab94c.png"
              alt="Growing Women Logo"
              className="h-12 w-auto mb-4"
            />
            <p className="text-muted-foreground mb-6 leading-relaxed text-center sm:text-left text-sm">
              Empowering women through education, opportunity, and community.
              <br />
              Together, we create lasting change.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-foreground mb-4 text-base">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-foreground mb-4 text-base">Programs</h3>
            <ul className="space-y-3">
              {[
                "Leadership Training",
                "Skills Development",
                "Mentorship",
                "Financial Literacy",
                "Health & Wellness",
              ].map((program) => (
                <li key={program}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {program}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-foreground mb-4 text-base">Stay Connected</h3>
            <div className="space-y-3">
              <div className="flex justify-center sm:justify-start items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4" />
                <span>info@growingwomenpk.org</span>
              </div>
              <div className="flex justify-center sm:justify-start items-center gap-2 text-muted-foreground text-sm">
                <Globe className="w-4 h-4" />
                <span>www.growingwomenpk.org</span>
              </div>
              <div className="flex justify-center sm:justify-start items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4" />
                <span>03221774376</span>
              </div>
              <div className="flex justify-center sm:justify-start items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-1" />
                <span>
                  Main Broadway Commercial,
                  <br />
                  Phase 8, DHA, Lahore
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © 2025 Powered by{" "}
            <a
              href="https://glaxit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Glaxit
            </a>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6">
            <a
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;