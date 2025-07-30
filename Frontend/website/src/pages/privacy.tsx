import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, Mail, Database, AlertCircle, Calendar } from "lucide-react";

const PrivacyPolicy = () => {
  const privacySections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Personal information such as name, email address, phone number, and location when you register for our programs or contact us",
        "Demographic information to better understand our community and improve our services",
        "Program participation data to track progress and measure impact",
        "Website usage information through cookies and analytics tools",
        "Communication preferences and feedback you provide to us"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our educational programs and services",
        "To communicate with you about programs, events, and opportunities",
        "To measure and analyze the impact of our programs",
        "To comply with legal obligations and reporting requirements",
        "To send newsletters and updates (with your consent)",
        "To personalize your experience with our organization"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share aggregated, non-personally identifiable information for research and reporting",
        "We may share information with trusted partners who help us operate our programs",
        "We may disclose information when required by law or to protect our rights",
        "Program success stories may be shared with your explicit consent"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      content: [
        "We implement appropriate security measures to protect your personal information",
        "All sensitive data is encrypted during transmission and storage",
        "Access to personal information is restricted to authorized personnel only",
        "We regularly review and update our security practices",
        "We use secure servers and industry-standard protocols"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Your Rights",
      content: [
        "Right to access the personal information we hold about you",
        "Right to request correction of inaccurate or incomplete information",
        "Right to request deletion of your personal information",
        "Right to withdraw consent for marketing communications",
        "Right to data portability where technically feasible",
        "Right to lodge a complaint with relevant data protection authorities"
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Cookies and Tracking",
      content: [
        "We use cookies to enhance your browsing experience",
        "Analytics cookies help us understand how visitors use our website",
        "You can control cookie settings through your browser preferences",
        "Some features may not work properly if cookies are disabled",
        "We use Google Analytics to track website performance and user behavior"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
 
      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose mt-14">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-soft-purple rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-foreground">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect your personal information.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: January 2025</span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-soft-purple/5 border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Commitment to Your Privacy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At WomenRise, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
                  website, participate in our programs, or interact with our services.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using our services, you consent to the collection and use of information in accordance with this policy. 
                  If you have any questions or concerns, please don't hesitate to contact us.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>

      {/* Privacy Sections */}
      <section className="py-20 bg-section-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {privacySections.map((section, index) => (
                <Card key={index} className="bg-background/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-soft-purple rounded-xl flex items-center justify-center text-primary-foreground flex-shrink-0">
                        {section.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-soft-purple rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-foreground">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Questions About Your Privacy?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  If you have any questions about this Privacy Policy or how we handle your personal information, 
                  we're here to help. Your privacy is important to us, and we want you to feel confident about 
                  how your information is being used.
                </p>
                <div className="bg-section-soft rounded-xl p-6">
                  <p className="text-sm text-muted-foreground mb-2">Contact our Privacy Team:</p>
                  <p className="font-semibold text-foreground">privacy@womenrise.org</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;