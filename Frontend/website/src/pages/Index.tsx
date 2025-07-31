import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { isAuthenticated } from "@/utils/auth";
import {
  GraduationCap,
  Heart,
  Building,
  Shield,
  Users,
  MapPin,
  Star,
  ArrowRight,
  Mail,
  Globe
} from "lucide-react";
import heroImage from "@/assets/hero-empowered-women.jpg";
import supportImage from "@/assets/women-supporting-each-other.jpg";
import successStoryImage from "@/assets/success-story-woman.jpg";
import { useEffect, useState } from "react";
import { getAllSuccessStories } from "@/services/api";
import toast from "react-hot-toast";

const Index = () => {
  const [impactCounts, setImpactCounts] = useState({
    women: 0,
    villages: 0,
    programs: 0,
    countries: 0
  });

  const finalCounts = {
    women: 10000,
    villages: 120,
    programs: 25,
    countries: 8
  };

  const [successStories, setSuccessStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [errorStories, setErrorStories] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    scrollTo(0,0)
  }, []);

  useEffect(() => {
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;

    const increment = {
      women: finalCounts.women / steps,
      villages: finalCounts.villages / steps,
      programs: finalCounts.programs / steps,
      countries: finalCounts.countries / steps
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setImpactCounts({
        women: Math.min(Math.floor(increment.women * step), finalCounts.women),
        villages: Math.min(Math.floor(increment.villages * step), finalCounts.villages),
        programs: Math.min(Math.floor(increment.programs * step), finalCounts.programs),
        countries: Math.min(Math.floor(increment.countries * step), finalCounts.countries)
      });

      if (step >= steps) {
        clearInterval(timer);
        setImpactCounts(finalCounts);
        
        // Impact numbers finished loading - no toast needed
      }
    }, interval);

    return () => clearInterval(timer);
  }, [toast]);

  useEffect(() => {
    async function fetchStories() {
      try {
        const data = await getAllSuccessStories();
        setSuccessStories(Array.isArray(data) ? data : data.stories || data.successStories || data.data || []);
        
        // Success stories loaded successfully - no toast needed
      } catch (err) {
        setErrorStories("Failed to load success stories");
        
        // Show error toast when stories fail to load
        toast.error("Unable to Load Stories. Failed to load success stories. Please try again later.");
      } finally {
        setLoadingStories(false);
      }
    }
    fetchStories();
  }, [toast]);
const partnerLogos = [
  {
    name: "Women's Foundation",
    component: (
      <svg viewBox="0 0 100 40" className="h-12 w-auto">
        <rect width="100" height="40" rx="5" fill="#8b5cf6" />
        <text x="50" y="25" fontFamily="Arial" fontSize="14" fill="white" textAnchor="middle">WOMEN'S FOUNDATION</text>
      </svg>
    )
  },
  {
    name: "Global Empowerment",
    component: (
      <svg viewBox="0 0 100 40" className="h-12 w-auto">
        <circle cx="20" cy="20" r="15" fill="#ec4899" />
        <text x="50" y="25" fontFamily="Arial" fontSize="14" fill="#ec4899" textAnchor="middle">GLOBAL EMPOWER</text>
      </svg>
    )
  },
  {
    name: "Equal Rights Initiative",
    component: (
      <svg viewBox="0 0 100 40" className="h-12 w-auto">
        <path d="M0,20 L100,20 M50,0 L50,40" stroke="#3b82f6" strokeWidth="3" />
        <text x="50" y="30" fontFamily="Arial" fontSize="12" fill="#3b82f6" textAnchor="middle">EQUAL RIGHTS</text>
      </svg>
    )
  },
  {
    name: "Education First",
    component: (
      <svg viewBox="0 0 100 40" className="h-12 w-auto">
        <polygon points="50,0 100,40 0,40" fill="#10b981" />
        <text x="50" y="30" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">EDU FIRST</text>
      </svg>
    )
  },
  {
    name: "Health & Wellness",
    component: (
      <svg viewBox="0 0 100 40" className="h-12 w-auto">
        <rect x="30" y="10" width="40" height="20" rx="5" fill="#ef4444" />
        <text x="50" y="30" fontFamily="Arial" fontSize="12" fill="#ef4444" textAnchor="middle">HEALTH+</text>
      </svg>
    )
  },
  {
    name: "Future Leaders",
    component: (
      <svg viewBox="0 0 100 40" className="h-12 w-auto">
        <path d="M20,40 Q50,0 80,40" fill="none" stroke="#f59e0b" strokeWidth="3" />
        <text x="50" y="30" fontFamily="Arial" fontSize="12" fill="#f59e0b" textAnchor="middle">FUTURE LEADERS</text>
      </svg>
    )
  }
];
  const programs = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Education",
      description: "Providing literacy programs and skills training to unlock potential and create opportunities.",
      color: "from-primary to-soft-purple"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Healthcare",
      description: "Ensuring access to essential healthcare services and health education for women and families.",
      color: "from-primary to-soft-purple"
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Entrepreneurship",
      description: "Supporting women-owned businesses through micro-loans, mentorship, and business training.",
      color: "from-primary to-soft-purple"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety",
      description: "Creating safe spaces and providing resources to protect women from violence and discrimination.",
      color: "from-primary to-soft-purple"
    }
  ];

  const impactStats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: impactCounts.women,
      suffix: "+",
      label: "Women Helped",
      color: "text-primary"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      number: impactCounts.villages,
      suffix: "+",
      label: "Villages Impacted",
      color: "text-primary"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      number: impactCounts.programs,
      suffix: "",
      label: "Active Programs",
      color: "text-primary"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: impactCounts.countries,
      suffix: "",
      label: "Countries Reached",
      color: "text-primary"
    }
  ];

  // Toast notification handlers for button interactions
  const handleContactClick = () => {
    toast.success("Contact Us - Redirecting to our contact page. We'd love to hear from you!");
  };

  const handleAboutClick = () => {
    toast.success("Our Mission - Learn more about our mission and how we empower women.");
  };

  const handleLearnMoreClick = () => {
    toast.success("About Us - Discover our story and the impact we're making.");
  };

  const handleJoinUsClick = () => {
    toast.success("Join Us - Become part of our community and make a difference!");
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section
        className="relative pt-40 min-h-screen bg-cover bg-center bg-no-repeat mt-25"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroImage})` ,marginTop:"100px" 
        }}
      >
        <div className="pt-30 flex items-center justify-center min-h-screen">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto text-white">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Empowering Women,{" "}
                <span className="bg-gradient-to-r from-lilac to-gentle-rose bg-clip-text text-transparent">
                  Transforming Lives
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 leading-relaxed opacity-90">
                Join us in making a difference for women across the globe through education,
                healthcare, entrepreneurship, and safety programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="donate" size="lg" className="text-lg px-8 py-6 shadow-xl" onClick={handleContactClick}>
                  <a href="/contact"> Contact Us</a>
                </Button>
                <Button variant="donate" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={handleAboutClick}>
                  <a href="/about"> Our Mission</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* About Us Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that when women are empowered, entire communities thrive.
                Through comprehensive programs in education, healthcare, entrepreneurship,
                and safety, we create lasting change that breaks cycles of poverty and
                builds stronger, more equitable societies.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Since 2018, we've been working alongside women in underserved communities,
                providing them with the tools, resources, and support they need to create
                better futures for themselves and their families.
              </p>
              <Button variant="empowerment" className="inline-flex items-center gap-2" onClick={handleLearnMoreClick}>
                <a href="/about">Learn More About Us</a>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <img
                src={supportImage}
                alt="Women supporting each other"
                className="rounded-3xl shadow-xl w-full object-cover"
              />
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-primary to-soft-purple rounded-2xl p-6 text-primary-foreground shadow-xl">
                <Star className="w-8 h-8 mb-2" />
                <p className="font-semibold">Trusted</p>
                <p className="text-sm opacity-90">Organization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-section-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Goals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive initiatives designed to address the unique challenges women face
              and create pathways to empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-background/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {program.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{program.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{program.description}</p>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-soft-purple/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Together, we're creating measurable change in women's lives around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center bg-background/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br from-primary to-soft-purple rounded-2xl flex items-center justify-center mx-auto mb-6 text-white`}>
                    {stat.icon}
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                    {stat.number.toLocaleString()}{stat.suffix}
                  </div>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story Highlight */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Success Stories
              </h2>
              <p className="text-xl text-muted-foreground">
                Real women, real impact, real change.
              </p>
            </div>
            {loadingStories ? (
              <div className="text-center py-10">Loading success stories...</div>
            ) : errorStories ? (
              <div className="text-center text-red-500 py-10">{errorStories}</div>
            ) : successStories.length > 0 ? (
              <div className="relative flex items-center justify-center">
                <button
                  onClick={() => {
                    setScrollIndex((prev) => Math.max(prev - 1, 0));
                    toast.success("Previous Story - Showing previous success story.");
                  }}
                  disabled={scrollIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary/80 text-white p-2 rounded-full shadow hover:bg-primary disabled:opacity-50"
                  style={{ display: successStories.length > 1 ? 'block' : 'none' }}
                  aria-label="Previous story"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <Card className="bg-gradient-to-br from-background to-section-soft border-border/50 overflow-hidden w-full max-w-2xl mx-auto">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="relative">
                        <img
                          src={`http://localhost:8000/uploads/${successStories[scrollIndex].img}`}
                          alt={successStories[scrollIndex].name}
                          className="w-full h-full object-cover min-h-[300px]"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <div className="mb-4">
                          <div className="flex text-primary mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <blockquote className="text-base text-foreground leading-relaxed mb-4 line-clamp-3">
                            {successStories[scrollIndex].story}
                          </blockquote>

                          <Button
                            variant="outline"
                            className="mt-2 w-fit text-sm text-primary"
                            onClick={() => {
                              setActiveStory(successStories[scrollIndex]);
                              setShowModal(true);
                              toast.success(`Story Details - Opening full story of ${successStories[scrollIndex].name}.`);
                            }}
                          >
                            View Full Story
                          </Button>
  <br />
                          <cite className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{successStories[scrollIndex].name}</span>
                            <br />
                            {successStories[scrollIndex].position}
                          </cite>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <button
                  onClick={() => {
                    setScrollIndex((prev) => Math.min(prev + 1, successStories.length - 1));
                    toast.success("Next Story - Showing next success story.");
                  }}
                  disabled={scrollIndex === successStories.length - 1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary/80 text-white p-2 rounded-full shadow hover:bg-primary disabled:opacity-50"
                  style={{ display: successStories.length > 1 ? 'block' : 'none' }}
                  aria-label="Next story"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center py-10">No success stories available.</div>
            )}
          </div>
        </div>
      </section>


      {/* Join the Movement CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-soft-purple/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Want to be part of something bigger?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of supporters who are making a real difference in women's lives worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!isAuthenticated() &&
              <Button variant="donate" size="lg" className="text-lg px-8 py-6" onClick={handleJoinUsClick}>
                <a href="/join-us">Join Us</a>
              </Button>
              }
              <Button variant="empowerment" size="lg" className="text-lg px-8 py-6" onClick={handleContactClick}>
                <a href="/contact">Contact Us</a>
              </Button>

            </div>


          </div>
        </div>
      </section>
      {showModal && activeStory && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
    <div className="bg-white max-w-3xl w-full rounded-xl overflow-hidden shadow-2xl relative grid md:grid-cols-2">
      
      {/* Left: Image */}
      <div className="h-full max-h-[600px] overflow-hidden">
        <img
          src={`http://localhost:8000/uploads/${activeStory.img}`}
          alt={activeStory.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Story Content */}
      <div className="p-6 relative flex flex-col justify-center">
        <button
          onClick={() => {
            setShowModal(false);
            toast.success("Story Closed - Success story modal closed.");
          }}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold text-primary mb-2">
          {activeStory.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{activeStory.position}</p>
        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
          {activeStory.story}
        </p>
      </div>

    </div>
  </div>
)}

      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>

{/* Our Partners - Infinite Logo Slider */}
<section className="py-16 bg-gray-50 dark:bg-gray-900/50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Our Trusted Partners
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Collaborating with leading organizations to empower women worldwide
      </p>
    </div>

    <div className="relative overflow-hidden py-6">
      <div className="flex w-max animate-scroll-slow items-center">
        {/* Double the array for seamless looping */}
        {[...partnerLogos, ...partnerLogos].map((logo, index) => (
          <div 
            key={`${logo.name}-${index}`} 
            className="px-8 flex items-center justify-center"
            style={{ minWidth: '200px' }}
          >
            <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
              {logo.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
      <Footer />
    </div>
  );
};

export default Index;