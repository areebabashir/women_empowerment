import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { isAuthenticated } from "@/utils/auth";
import NavbarProfileAvatar from "@/components/NavbarProfileAvatar";


type NavItem = {
  name: string;
  href?: string;
  dropdown?: boolean;
  items?: { name: string; href: string }[];
};
type HeaderProps = {
  showNavItems?: boolean; // Make it optional
};

const Header = ({ showNavItems = true }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        window.innerWidth >= 1024 &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDesktopDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    {
      name: "Opportunities",
      dropdown: true,
      items: [
        
        { name: "Programs", href: "/programs" },
        { name: "Events", href: "/events" },
        { name: "Jobs", href: "/Jobs" },
      ],
    },
    { name: "Gallery", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "Podcasts", href: "/podcasts" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-background/95"
      }`}
    >
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between h-15 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/622c5733-7332-4b87-b1a0-b0808c1ab94c.png"
              alt="Growing Women Logo"
              className="h-[110px] w-auto"
            />
          </Link>

          {/* Desktop Navigation */}

        {showNavItems && (
          <nav className="hidden lg:flex items-center space-x-5">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  <button
                    className="text-base lg:text-[17px] font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
                    onClick={() => setShowDesktopDropdown((prev) => !prev)}
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showDesktopDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg py-2 w-40 z-50">
                      {item.items?.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className="block px-4 py-2 text-[15px] lg:text-[16px] text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href!}
                  className="text-base lg:text-[17px] font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )
            )}
            </nav>
             )}

            {/* CTA Buttons */}
            {!isAuthenticated() ?
            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="donate" size="lg">
                <a href="/join-us">Join Us</a>
              </Button>
              
            </div> : <NavbarProfileAvatar/>
            }
            

            

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-accent transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <nav className="py-6 space-y-4">
              {showNavItems && navItems.map((item) =>
                item.dropdown ? (
                  <div key={item.name} className="px-4 space-y-1">
                    <button
                      onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                      className="flex items-center justify-between w-full text-base font-medium text-foreground/80 hover:text-foreground"
                    >
                      {item.name}
                      {isMobileDropdownOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {isMobileDropdownOpen && (
                      <div className="pl-4 space-y-1 pt-1">
                        {item.items?.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            className="block text-base text-foreground/80 hover:text-foreground hover:bg-accent px-2 py-1 rounded transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href!}
                    className="block px-4 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
              {!isAuthenticated() ?
              <div className="px-4 pt-4 space-y-2">
                <Button variant="donate" size="lg" className="w-full">
                  <a href="/join-us">Join Us</a>
                </Button>
                <Button variant="donate" size="lg" className="w-full">
                  <a href="/login">Log In</a>
                </Button>
              </div>  : <NavbarProfileAvatar/>
              }
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
