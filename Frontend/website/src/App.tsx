import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Podcasts from "./pages/Podcasts";
import JoinUs from "./pages/JoinUs";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import LoginPage from "./pages/LoginPage";
import UserDasboard from "./pages/UserDashboard"
import ProtectedRoute from "./components/ProtectedRoute";
import DonationForm from "./pages/DonationForm"
import TermsConditions from "./pages/terms";
import PrivacyPolicy from "./pages/privacy";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 5000,
          style: {
            background: 'linear-gradient(135deg, hsl(320 60% 35%), hsl(320 40% 75%))',
            color: 'white',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontWeight: '600',
          },
          success: {
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, hsl(320 60% 35%), hsl(320 40% 75%))',
              color: 'white',
              borderRadius: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              fontWeight: '600',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, hsl(320 60% 35%), hsl(0 84.2% 60.2%))',
              color: 'white',
              borderRadius: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              fontWeight: '600',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Protected Route - Only accessible when logged in */}
          <Route
            path="/UserDashboard"
            element={
              <ProtectedRoute>
                <UserDasboard />
              </ProtectedRoute>
            }
          />
          <Route path="/Donate" element={<DonationForm />} />
          
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<JoinUs />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
