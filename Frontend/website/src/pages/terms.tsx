import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, Users, AlertTriangle, Bookmark, RefreshCw, Mail, Calendar } from "lucide-react";

const TermsConditions = () => {
  const termsSections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using WomenRise services, you agree to be bound by these Terms and Conditions",
        "These terms apply to all users of our website, programs, and services",
        "If you do not agree with any part of these terms, you may not use our services",
        "We reserve the right to modify these terms at any time with notice",
        "Continued use of our services constitutes acceptance of updated terms"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Responsibilities",
      content: [
        "Provide accurate and complete information when registering for programs",
        "Maintain the confidentiality of your account credentials",
        "Use our services in a lawful and respectful manner",
        "Respect the privacy and rights of other program participants",
        "Notify us immediately of any unauthorized use of your account",
        "Comply with all program requirements and guidelines"
      ]
    },
    {
      icon: <Bookmark className="w-6 h-6" />,
      title: "Program Participation",
      content: [
        "Participation in WomenRise programs is subject to eligibility requirements",
        "Program availability may be limited and subject to capacity constraints",
        "Participants are expected to actively engage and complete program requirements",
        "WomenRise reserves the right to remove participants who violate program guidelines",
        "Program schedules and content may be modified to improve effectiveness",
        "Certificates and credentials are issued based on successful completion"
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Intellectual Property",
      content: [
        "All content, materials, and resources provided by WomenRise are our intellectual property",
        "Users may not reproduce, distribute, or commercialize our materials without permission",
        "Program participants may use materials for personal learning and development",
        "User-generated content shared in programs may be used for promotional purposes with consent",
        "Respect for third-party intellectual property rights is required",
        "Any infringement claims should be reported to us immediately"
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Limitations and Disclaimers",
      content: [
        "WomenRise services are provided 'as is' without warranties of any kind",
        "We do not guarantee specific outcomes or results from program participation",
        "Our liability is limited to the maximum extent permitted by law",
        "We are not responsible for technical issues or service interruptions",
        "External links and third-party content are provided for convenience only",
        "Users participate in programs at their own risk and discretion"
      ]
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Modification and Termination",
      content: [
        "WomenRise may modify or discontinue services at any time with notice",
        "We reserve the right to suspend or terminate user accounts for violations",
        "Users may cancel their participation in programs according to our cancellation policy",
        "Refunds, if applicable, will be processed according to our refund policy",
        "Data retention and deletion will follow our privacy policy guidelines",
        "Termination does not affect rights and obligations that survive termination"
      ]
    }
  ];

  const importantNotices = [
    {
      title: "Age Requirement",
      description: "Users must be at least 18 years old or have parental consent to participate in our programs."
    },
    {
      title: "Geographic Limitations",
      description: "Some programs may be limited to specific geographical regions due to local regulations."
    },
    {
      title: "Technical Requirements",
      description: "Certain programs may require specific technical equipment or internet connectivity."
    },
    {
      title: "Language",
      description: "Programs are primarily conducted in English and Urdu. Translation services may be limited."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
 
      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose  mt-14">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-soft-purple rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-foreground">
            <Scale className="w-10 h-10" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before using our services and participating in our programs.
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
                <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to WomenRise</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms and Conditions ("Terms") govern your use of WomenRise's website, programs, services, 
                  and any related content or materials. These Terms constitute a legally binding agreement between 
                  you and WomenRise.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing our services, participating in our programs, or using our website, you acknowledge 
                  that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>

      {/* Terms Sections */}
      <section className="py-20 bg-section-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {termsSections.map((section, index) => (
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

      {/* Important Notices */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Important Notices</h2>
              <p className="text-muted-foreground">Please take note of these important considerations before participating.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {importantNotices.map((notice, index) => (
                <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{notice.title}</h4>
                        <p className="text-sm text-muted-foreground">{notice.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>

      {/* Governing Law */}
      <section className="py-16 bg-section-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-soft-purple rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                    <Scale className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
                </div>
                
                <div className="space-y-4 text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms and Conditions are governed by and construed in accordance with the laws of Pakistan. 
                    Any disputes arising from these terms or your use of our services shall be subject to the exclusive 
                    jurisdiction of the courts of Pakistan.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions 
                    shall remain in full force and effect.
                  </p>
                </div>
              </CardContent>
            </Card>
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
                <h2 className="text-2xl font-bold text-foreground mb-4">Questions About These Terms?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  If you have any questions about these Terms and Conditions or need clarification about any 
                  of our policies, please don't hesitate to reach out to our legal team.
                </p>
                <div className="bg-section-soft rounded-xl p-6">
                  <p className="text-sm text-muted-foreground mb-2">Contact our Legal Team:</p>
                  <p className="font-semibold text-foreground">legal@womenrise.org</p>
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

export default TermsConditions;