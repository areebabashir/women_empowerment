import { useState,useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, Globe, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/services/api";



const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    scrollTo(0,0)
  }, []);

  const handleInputChange = (e) => {
   const { name, value } = e.target;

  // Allow only alphabets for firstName and lastName
  const alphaOnlyRegex = /^[A-Za-z]*$/;

  if ((name === "firstName" || name === "lastName") && !alphaOnlyRegex.test(value)) {
    return; // ignore invalid input
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
        throw new Error("Please fill in all fields");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await submitContactForm(formData);
      console.log('Contact form submitted successfully:', response);
      
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
      console.error('Error submitting contact form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose mt-14 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with us to learn more about our mission or to get involved
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Send us a Message</h2>
              <Card>
                <CardContent className="p-6">
                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800">Message sent successfully! We'll get back to you soon.</p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name *</label>
                        <Input 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Your first name" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name *</label>
                        <Input 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Your last name" 
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      <Input 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help you?" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Get in Touch</h2>
              <div className="space-y-6">

                {/* Contact Cards */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-2">Email</h3>
                        <p className="text-muted-foreground"> info@growingwomenpk.org</p>
                        
                      </div>
                       <div className="flex items-start space-x-4">
                         <div className="bg-primary/10 p-3 rounded-full">
    <Globe className="text-primary mt-1" size={20} /></div>
    <div>
      <h3 className="font-semibold text-primary mb-1">Website</h3>
      <p className="text-muted-foreground"> www.growingwomenpk.org</p>
    </div>
  </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-2">Phone</h3>
                        <p className="text-muted-foreground"> +923221774376</p>

                      </div>
            

 
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-2">Address</h3>
                        <p className="text-muted-foreground"> Main Broadway Commercial,
                          </p>          <p className="text-muted-foreground">  Phase 8
                           </p>          <p className="text-muted-foreground">  DHA,
                              Lahore</p>

                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-2">Office Hours</h3>
                        <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                        <p className="text-muted-foreground">Sunday: Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>
      {/* Map Section */}
        <section className="py-16 bg-section-soft">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">Find Us</h2>

        <Card className="overflow-hidden relative aspect-video">
          {/* Google Map Iframe */}
          <iframe
            title="Growing Women Location"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            className="w-full h-full border-0"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27226.84902112488!2d74.40666983606606!3d31.45320423068162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190687a02e8375%3A0x8c6bb1ffdd735539!2sMain%20Broadway%2C%20D.H.A%20Phase%208%20-%20Ex%20Park%20View%20Phase%208%2C%20Lahore%2C%20Punjab%2054600%2C%20Pakistan!5e0!3m2!1sen!2s!4v1721985784815!5m2!1sen!2s"
          ></iframe>

          {/* Pink Location Pin Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <MapPin className="h-16 w-16 text-primary drop-shadow-md" />
          </div>
        </Card>
      </div>
    </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How can I volunteer with your organization?",
                answer: "We welcome volunteers! Please visit our 'Join Us' page or contact us directly to learn about current volunteer opportunities."
              },
              {
                question: "Do you offer internship programs?",
                answer: "Yes, we offer internship programs for students and recent graduates. Contact us for more information about available positions."
              },
              {
                question: "How can I donate to support your programs?",
                answer: "You can donate through our website's donation page or contact us for other donation methods including bank transfers and check payments."
              },
              {
                question: "Are your programs available globally?",
                answer: "While we're based in New York, we work with partner organizations globally to extend our reach and impact."
              }
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>
      <Footer />
    </div>
  );
};

export default Contact;