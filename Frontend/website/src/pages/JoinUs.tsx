import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import SignUpPage from "./SignupPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Heart, BookOpen, Briefcase, Calendar, Send, CheckCircle } from "lucide-react";

const JoinUs = () => {
  useEffect(() => {
    scrollTo(0,0)
  }, []);
  const opportunities = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Community Volunteer",
      description: "Help organize events, assist with workshops, and support our local community programs.",
      commitment: "4-6 hours per month",
      skills: "Communication, Organization, Empathy"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Mentor",
      description: "Guide and support women in their personal and professional development journeys.",
      commitment: "2-3 hours per week",
      skills: "Leadership Experience, Patience, Active Listening"
    },
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: "Skills Trainer",
      description: "Teach technical, business, or life skills to help women advance their careers.",
      commitment: "6-8 hours per month",
      skills: "Subject Matter Expertise, Teaching Ability"
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Event Coordinator",
      description: "Plan and execute workshops, seminars, and community events that empower women.",
      commitment: "8-10 hours per month",
      skills: "Project Management, Detail-Oriented, Communication"
    }
  ];

  const benefits = [
    "Make a meaningful impact in women's lives",
    "Develop new skills and gain experience",
    "Connect with like-minded individuals",
    "Receive training and support",
    "Flexible scheduling options",
    "Certificate of volunteer service"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose  mt-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Be part of a movement that empowers women and transforms communities
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6">
              Why Volunteer With Us?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join a community of passionate individuals working together to create lasting change in women's lives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                  <p className="text-foreground">{benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
       {/* Application Form
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6">
                Ready to Get Involved?
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll be in touch about opportunities that match your interests and skills.
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <Input placeholder="Your first name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <Input placeholder="Your last name" required />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input type="email" placeholder="your.email@example.com" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input type="tel" placeholder="+92312345679" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Areas of Interest *</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {opportunities.map((opp, index) => (
                        <label key={index} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm">{opp.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Available Hours per Month</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                      <option>Select your availability</option>
                      <option>1-5 hours</option>
                      <option>6-10 hours</option>
                      <option>11-20 hours</option>
                      <option>20+ hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Previous Experience (Optional)</label>
                    <Textarea 
                      placeholder="Tell us about any relevant volunteer experience or skills you'd like to share..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Why do you want to volunteer with us? *</label>
                    <Textarea 
                      placeholder="Share what motivates you to join our mission..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      <SignUpPage/>

  
     

      {/* Volunteer Opportunities */}
      <section className="py-16 bg-section-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6">
              Volunteer Opportunities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose how you'd like to make a difference. We have roles that match various skills and schedules.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {opportunities.map((opportunity, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      {opportunity.icon}
                    </div>
                    <CardTitle className="text-primary">{opportunity.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {opportunity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-primary">Time Commitment: </span>
                      <span className="text-muted-foreground">{opportunity.commitment}</span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Skills Needed: </span>
                      <span className="text-muted-foreground">{opportunity.skills}</span>
                    </div>
                  </div>
                
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

     

      <Footer />
    </div>
  );
};

export default JoinUs;