import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, GraduationCap, Globe, CheckCircle, Calendar, Award, Target } from "lucide-react";
import heroImage from "@/assets/hero-women-empowerment.jpg";
import womenLearningImage from "@/assets/women-learning-leading.jpg";
import { useEffect, useState } from "react";
import { getAllTeams } from "../services/api";
import { isAuthenticated } from "@/utils/auth";
const About = () => {
  const timelineEvents = [
    {
      year: "2018",
      title: "WomenRise Founded",
      description: "Started with a vision to empower women globally",
      icon: <Target className="w-5 h-5" />
    },
    {
      year: "2020",
      title: "1,000 Women Trained",
      description: "Reached our first major milestone in skills development",
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Extended programs to 15 countries worldwide",
      icon: <Globe className="w-5 h-5" />
    },
    {
      year: "2024",
      title: "5,000+ Lives Changed",
      description: "Celebrating transformative impact across communities",
      icon: <Award className="w-5 h-5" />
    }
  ];

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollTo(0,0)
    async function fetchTeams() {
      try {
        const data = await getAllTeams();
        // Map API fields to UI fields
        const mapped = data.map((member) => ({
          name: member.name,
          role: member.position,
          image: member.pic, // Assuming this is just the filename
          description: member.bio,
        }));
        setTeamMembers(mapped);
      } catch (err) {
        setError("Failed to load team members");
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, []);

  const coreValues = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Compassion",
      description: "We lead with empathy and understanding in all our interactions."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Equality",
      description: "Every woman deserves equal opportunities to thrive and succeed."
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Education",
      description: "Knowledge is the foundation for lasting empowerment and change."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Dignity",
      description: "We honor the inherent worth and potential of every individual."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}

      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose mt-14 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            Who We Are
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering women through education, opportunity, and community.
          </p>
        </div>
      </section>
      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Provide comprehensive education and skills training to women in pakistan
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Create sustainable opportunities for economic independence
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Build supportive communities that foster growth and leadership
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      every woman has the opportunity,
                      resources, and recognition to grow financially
                      and contribute to national development
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Vision
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To empower women across Pakistan through
                  entrepreneurship, skill development, financial
                  literacy, and inclusive business ecosystems—
                  turning homes into hubs of innovation, income,
                  and impact
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src={womenLearningImage}
                alt="Women learning and leading together"
                className="rounded-3xl shadow-xl w-full object-cover aspect-square"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary to-soft-purple rounded-2xl p-6 text-primary-foreground shadow-xl">
                <div className="text-center">
                  <p className="text-3xl font-bold">5,000+</p>
                  <p className="text-sm opacity-90">Lives Changed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>


      {/* Our Story Timeline */}
      <section className="py-20 bg-section-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Story
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From humble beginnings to global impact - discover the journey that shaped our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timelineEvents.map((event, index) => (
              <Card key={index} className="relative bg-background/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                    {event.icon}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{event.year}</div>
                  <h3 className="font-semibold text-foreground mb-3">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

     {/* Meet the Team with Infinite Auto-Scroll */}
<section className="py-20 bg-background">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
        Meet Our Team
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Passionate leaders dedicated to creating meaningful change in women's lives.
      </p>
    </div>

    <div className="overflow-hidden relative p-10">
      {loading ? (
        <div className="text-center py-10">Loading team members...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <div
          className="flex gap-20 w-max animate-scroll-slow px-4"
          style={{ animationDuration: `${teamMembers.length * 4}s` }}
        >
          {/* Render the array twice for seamless looping */}
          {[...teamMembers, ...teamMembers].map((member, index) => (
            <Card 
              key={`${member.id || index}-${index}`} 
              className="min-w-[280px] text-center border-border/50 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-soft-purple mx-auto mb-6 overflow-hidden">
                  <img
                    src={member.image.startsWith('http') ? member.image : `http://localhost:8000/uploads/images/${member.image}`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-m text-muted-foreground whitespace-pre-line line-clamp-4 h-[30px] overflow-hidden">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  </div>
</section>

      {/* Core Values */}
      <section className="py-20 bg-section-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center bg-background/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-soft-purple rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
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
                <Button variant="donate" size="lg" className="text-lg px-8 py-6">
                  <a href="/join-us">Join Us</a>
                </Button>
              }
              <Button variant="empowerment" size="lg" className="text-lg px-8 py-6">
                <a href="/contact">Contact Us</a>
              </Button>

            </div>


          </div>
        </div>
      </section>
      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>

      <Footer />
    </div>
  );
};

export default About;