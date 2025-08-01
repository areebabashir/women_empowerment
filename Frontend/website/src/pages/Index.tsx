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
  Globe,
  Phone,
  AlertTriangle,
  Scale,
  FileText,
  Gavel,
  PhoneCall
} from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import heroImage from "@/assets/hero-empowered-women.jpg";
import supportImage from "@/assets/women-supporting-each-other.jpg";
import successStoryImage from "@/assets/success-story-woman.jpg";
import { useEffect, useState } from "react";
import { getAllSuccessStories } from "@/services/api";
import { apiCall } from "@/api/apiCall";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/imageUtils";


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Index = () => {
  const [partnerLogos, setPartnerLogos] = useState<string[]>([]);


  useEffect(() => {
    const fetchLogos = async () => {
      const response = await apiCall<string[]>({
        url: `${API_BASE_URL}/partner-logos`,
        method: 'GET',
      });

      if (response.success) {
        console.log(partnerLogos)
        setPartnerLogos(response.data);
      } else {
        console.error('Failed to fetch partner logos:', response.data);
      }
    };

    fetchLogos();
  }, []);


  // const partnerLogos = [
  //   {
  //     name: "Women's Foundation",
  //     component: (
  //       <svg viewBox="0 0 100 40" className="h-12 w-auto">
  //         <rect width="100" height="40" rx="5" fill="#8b5cf6" />
  //         <text x="50" y="25" fontFamily="Arial" fontSize="14" fill="white" textAnchor="middle">WOMEN'S FOUNDATION</text>
  //       </svg>
  //     )
  //   },
  //   {
  //     name: "Global Empowerment",
  //     component: (
  //       <svg viewBox="0 0 100 40" className="h-12 w-auto">
  //         <circle cx="20" cy="20" r="15" fill="#ec4899" />
  //         <text x="50" y="25" fontFamily="Arial" fontSize="14" fill="#ec4899" textAnchor="middle">GLOBAL EMPOWER</text>
  //       </svg>
  //     )
  //   },
  //   {
  //     name: "Equal Rights Initiative",
  //     component: (
  //       <svg viewBox="0 0 100 40" className="h-12 w-auto">
  //         <path d="M0,20 L100,20 M50,0 L50,40" stroke="#3b82f6" strokeWidth="3" />
  //         <text x="50" y="30" fontFamily="Arial" fontSize="12" fill="#3b82f6" textAnchor="middle">EQUAL RIGHTS</text>
  //       </svg>
  //     )
  //   },
  //   {
  //     name: "Education First",
  //     component: (
  //       <svg viewBox="0 0 100 40" className="h-12 w-auto">
  //         <polygon points="50,0 100,40 0,40" fill="#10b981" />
  //         <text x="50" y="30" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">EDU FIRST</text>
  //       </svg>
  //     )
  //   },
  //   {
  //     name: "Health & Wellness",
  //     component: (
  //       <svg viewBox="0 0 100 40" className="h-12 w-auto">
  //         <rect x="30" y="10" width="40" height="20" rx="5" fill="#ef4444" />
  //         <text x="50" y="30" fontFamily="Arial" fontSize="12" fill="#ef4444" textAnchor="middle">HEALTH+</text>
  //       </svg>
  //     )
  //   },
  //   {
  //     name: "Future Leaders",
  //     component: (
  //       <svg viewBox="0 0 100 40" className="h-12 w-auto">
  //         <path d="M20,40 Q50,0 80,40" fill="none" stroke="#f59e0b" strokeWidth="3" />
  //         <text x="50" y="30" fontFamily="Arial" fontSize="12" fill="#f59e0b" textAnchor="middle">FUTURE LEADERS</text>
  //       </svg>
  //     )
  //   }
  // ];
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
  // Keen Slider configuration for Success Stories
  const [storySliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 24,
    },
    defaultAnimation: {
      duration: 1000,
    },
    slideChanged: (slider) => {
      setScrollIndex(slider.track.details.rel);
    },
  });

  // Keen Slider configuration for Awareness
  const [awarenessSliderRef] = useKeenSlider({
    loop: true,
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 24,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 24,
        },
      },
    },
    slides: {
      perView: 1,
      spacing: 24,
    },
    defaultAnimation: {
      duration: 800,
    },
  });
  const [successStories, setSuccessStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [errorStories, setErrorStories] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [activeLegalInfo, setActiveLegalInfo] = useState(null);

  // Legal Awareness Data
  const legalAwarenessCards = [
    {
      id: 1,
      title: "Domestic Violence Helpline",
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      emergency: "911",
      description: "24/7 confidential support for victims of domestic violence. Trained advocates provide crisis intervention, safety planning, and referrals to local resources.",
      image: "/api/placeholder/300/200",
      services: [
        "Crisis intervention and emotional support",
        "Safety planning assistance", 
        "Local shelter and resource referrals",
        "Legal advocacy information"
      ],
      icon: <Heart className="w-8 h-8" />,
      color: "from-red-500 to-pink-600"
    },
    {
      id: 2,
      title: "Sexual Assault Support",
      name: "RAINN National Sexual Assault Hotline",
      phone: "1-800-656-4673",
      emergency: "911",
      description: "Free, confidential support for survivors of sexual assault. Connects you with trained staff from local sexual assault service providers.",
      image: "/api/placeholder/300/200",
      services: [
        "24/7 crisis counseling",
        "Medical and legal advocacy",
        "Support group referrals",
        "Online chat support available"
      ],
      icon: <Shield className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: 3,
      title: "Legal Aid Services",
      name: "Women's Law Center",
      phone: "1-800-HELP-LAW",
      emergency: "For emergencies call 911",
      description: "Free legal assistance for women facing discrimination, family law issues, and workplace harassment. Know your rights and get help.",
      image: "/api/placeholder/300/200",
      services: [
        "Family law and divorce assistance",
        "Employment discrimination cases",
        "Housing rights advocacy",
        "Immigration law support"
      ],
      icon: <Scale className="w-8 h-8" />,
      color: "from-blue-500 to-teal-600"
    },
    {
      id: 4,
      title: "Mental Health Crisis",
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      emergency: "988 - Suicide Prevention",
      description: "Free, 24/7 mental health support via text message. Trained crisis counselors provide immediate emotional support.",
      image: "/api/placeholder/300/200",
      services: [
        "Text-based crisis counseling",
        "Suicide prevention support",
        "Mental health resource referrals",
        "Anonymous and confidential"
      ],
      icon: <Heart className="w-8 h-8" />,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 5,
      title: "Workplace Rights",
      name: "Equal Employment Opportunity Commission",
      phone: "1-800-669-4000",
      emergency: "Document incidents immediately",
      description: "Report workplace discrimination, harassment, and violations of your employment rights. Free consultation and investigation services.",
      image: "/api/placeholder/300/200",
      services: [
        "Sexual harassment reporting",
        "Wage discrimination claims",
        "Pregnancy discrimination support",
        "Workplace accommodation requests"
      ],
      icon: <Building className="w-8 h-8" />,
      color: "from-orange-500 to-red-600"
    },
    {
      id: 6,
      title: "Housing Assistance",
      name: "National Housing Law Project",
      phone: "1-800-HOUSING",
      emergency: "Contact local police for illegal evictions",
      description: "Legal assistance for housing discrimination, tenant rights, and preventing homelessness. Protecting your right to safe housing.",
      image: "/api/placeholder/300/200",
      services: [
        "Tenant rights education",
        "Housing discrimination cases",
        "Eviction prevention assistance",
        "Accessible housing advocacy"
      ],
      icon: <MapPin className="w-8 h-8" />,
      color: "from-indigo-500 to-purple-600"
    }
  ];

  useEffect(() => {
    scrollTo(0, 0)
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
      }
    }, interval);

    return () => clearInterval(timer);
  }, [toast]);

  useEffect(() => {
    async function fetchStories() {
      try {
        const data = await getAllSuccessStories();
        setSuccessStories(Array.isArray(data) ? data : data.stories || data.successStories || data.data || []);
      } catch (err) {
        setErrorStories("Failed to load success stories");
        toast.error("Unable to Load Stories. Failed to load success stories. Please try again later.");
      } finally {
        setLoadingStories(false);
      }
    }
    fetchStories();
  }, [toast]);


  useEffect(() => {
    async function fetchAwareness() {
      try {
        const data = await getAllAwareness();
        const awarenessItems = Array.isArray(data) ? data : data.awareness || data.data || [];
        setAwarenessData(awarenessItems);
      } catch (err) {
        setErrorAwareness("Failed to load awareness data");
        toast.error("Unable to load awareness data. Please try again later.");
      } finally {
        setLoadingAwareness(false);
      }
    }
    fetchAwareness();
  }, [toast]);

  // Helper function to convert API data to frontend format
  const convertAwarenessToFrontendFormat = (awarenessItem) => {
    const iconMap = {
      'Heart': <Heart className="w-8 h-8" />,
      'Shield': <Shield className="w-8 h-8" />,
      'Scale': <Scale className="w-8 h-8" />,
      'Building': <Building className="w-8 h-8" />,
      'MapPin': <MapPin className="w-8 h-8" />,
      'Globe': <Globe className="w-8 h-8" />,
      'Users': <Users className="w-8 h-8" />,
      'GraduationCap': <GraduationCap className="w-8 h-8" />,
      'FileText': <FileText className="w-8 h-8" />
    };

    return {
      id: awarenessItem._id,
      title: awarenessItem.title || awarenessItem.name,
      name: awarenessItem.name,
      phone: awarenessItem.phoneNumber,
      emergency: awarenessItem.emergencyNumber,
      description: awarenessItem.description,
      image: awarenessItem.image,
      services: awarenessItem.services || [],
      icon: iconMap[awarenessItem.icon] || <Shield className="w-8 h-8" />,
      color: awarenessItem.color || "from-blue-500 to-teal-600"
    };
  };

  // Convert API data to frontend format
  const awarenessCards = awarenessData.map(convertAwarenessToFrontendFormat);

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

  const handleEmergencyCall = (phone: string, title: string) => {
    toast.error(`Emergency Contact - ${title}: ${phone}`);
    // In a real app, this could open the phone dialer
    window.open(`tel:${phone}`);
  };

  const handleLegalInfoClick = (info: any) => {
    setActiveLegalInfo(info);
    setShowLegalModal(true);
    toast.success(`Legal Resource - Opening ${info.title} information.`);
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section
        className="relative pt-40 min-h-screen bg-cover bg-center bg-no-repeat mt-25"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroImage})`, marginTop: "100px"
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

 {/* Success Stories - Infinite Moving Carousel */}
<section className="py-20 bg-background">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
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
      <div className="relative overflow-hidden py-10">
        {/* Double the array to create seamless looping */}
        <div className="flex w-max animate-scroll-slow">
          {[...successStories, ...successStories].map((story, index) => (
            <div key={`${story.id}-${index}`} className="px-4 w-[350px]">
              <Card 
                className="border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full"
                onClick={() => {
                  setActiveStory(story);
                  setShowModal(true);
                }}
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="w-full h-48 rounded-xl bg-gradient-to-br from-primary/10 to-soft-purple/10 mb-6 overflow-hidden">
                    <img
                      src={`http://localhost:8000/${story.img}`}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex text-primary mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-base text-foreground leading-relaxed mb-4 line-clamp-3">
                    {story.story}
                  </blockquote>
                  <div className="mt-auto">
                    <cite className="text-muted-foreground not-italic">
                      <span className="font-semibold text-foreground block">{story.name}</span>
                      <span className="text-sm">{story.position}</span>
                    </cite>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
     ) : (
       <div className="text-center py-10">No awareness resources available.</div>
     )}
  </div>
</section>

{/* Legal Awareness - Infinite Moving Carousel */}
<section className="py-20 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-6 shadow-2xl">
        <AlertTriangle className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
        Legal Awareness & Emergency Support
      </h2>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Know your rights, get help when you need it.
      </p>
      <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-800 dark:text-red-200 font-semibold flex items-center justify-center gap-2">
          <PhoneCall className="w-5 h-5" />
          In case of immediate danger, always call 911 first
        </p>
      </div>
    </div>

    <div className="relative overflow-hidden py-10">
      {/* Double the array for seamless looping */}
      <div className="flex w-max animate-scroll-slow">
        {[...legalAwarenessCards, ...legalAwarenessCards].map((card, index) => (
          <div key={`${card.id}-${index}`} className="px-4 w-[320px]">
            <Card 
              className="group hover:shadow-2xl transition-all duration-300 bg-background/90 backdrop-blur-sm border-border/50 cursor-pointer h-full hover:scale-[1.02]"
              onClick={() => handleLegalInfoClick(card)}
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
                <p className="text-lg font-semibold text-primary mb-2">{card.name}</p>
                
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Phone className="w-4 h-4" />
                    <span className="font-mono font-bold">{card.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-mono font-bold">{card.emergency}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-grow">
                  {card.description}
                </p>

                <div className="flex gap-2 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 text-green-700 border-green-300 hover:bg-green-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmergencyCall(card.phone, card.title);
                    }}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLegalInfoClick(card);
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary/10 to-soft-purple/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-foreground mb-4">Remember: You Are Not Alone</h3>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                These resources are confidential, free, and available 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                  key={index}
                  className="px-8 flex items-center justify-center"
                  style={{ minWidth: '200px' }}
                >
                  <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
                        <img key={index} src={`${API_BASE_URL}${logo}`} alt={`Partner ${index}`} className="w-32 h-auto" />

                  </div>
                </div>
              ))}
            </div>
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

      {/* Success Story Modal */}
      {showModal && activeStory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-3xl w-full rounded-xl overflow-hidden shadow-2xl relative grid md:grid-cols-2">

            {/* Left: Image */}
            <div className="h-full max-h-[600px] overflow-hidden">
              <img
                src={`http://localhost:8000/uploads/images/${activeStory.img}`}
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

              {/* Awareness Modal */}
      {showLegalModal && activeLegalInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className={`bg-gradient-to-r ${activeLegalInfo.color} p-6 text-white relative`}>
              <button
                onClick={() => {
                  setShowLegalModal(false);
                  toast.success("Legal Resource Closed - Modal closed.");
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  {activeLegalInfo.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">{activeLegalInfo.title}</h3>
                  <p className="text-xl opacity-90">{activeLegalInfo.name}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Emergency Contact Section */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Emergency Contacts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-700">Main Hotline</p>
                      <p className="font-mono text-lg text-green-700">{activeLegalInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-gray-700">Emergency</p>
                      <p className="font-mono text-lg text-red-700">{activeLegalInfo.emergency}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleEmergencyCall(activeLegalInfo.phone, activeLegalInfo.title)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Hotline Now
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => handleEmergencyCall('911', 'Emergency Services')}
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Call 911
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-4">About This Service</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {activeLegalInfo.description}
                </p>
              </div>

              {/* Services */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-6">Services Available</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeLegalInfo.services.map((service, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">{service}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Important Information
                </h4>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    All services are completely confidential and free of charge
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Available 24/7 - you can call anytime, day or night
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Trained professionals will listen without judgment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    You don't have to give your real name or any identifying information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    They can help connect you with local resources in your area
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>


      <Footer />
    </div>
  );
};

export default Index;