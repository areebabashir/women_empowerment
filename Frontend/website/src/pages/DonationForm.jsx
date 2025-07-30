import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input"; // reuse your styled Input component
import { Button } from "@/components/ui/button"; // reuse your styled Button component
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiCall } from "../api/apiCall";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const DonationForm = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState(""); // e.g., "Credit Card", "PayPal", etc.
  const [campaign, setCampaign] = useState("");


  const [receiptFile, setReceiptFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Input validation function
  const validateInput = () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid donation amount");
      toast.error("Please enter a valid donation amount");
      return false;
    }
    if (!date) {
      setError("Please select a date");
      toast.error("Please select a date");
      return false;
    }
    if (!method.trim()) {
      setError("Please specify a payment method");
      toast.error("Please specify a payment method");
      return false;
    }
    if (!campaign.trim()) {
      setError("Please specify a campaign");
      toast.error("Please specify a campaign");
      return false;
    }
    if (!receiptFile) {
      setError("Please upload a receipt file");
      toast.error("Please upload a receipt file");
      return false;
    }
    return true;
  };
const handleSubmit = async (e) => {
  e.preventDefault(); // <-- Prevent the default form submission behavior
  setError(null);
  setSuccess(null);

  if (!validateInput()) return;

  setIsLoading(true);

  try {
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("date", date);
    formData.append("method", method);
    formData.append("campaign", campaign);
    formData.append("receipt", receiptFile);

    console.log("Submitting form data...");

    const response = await apiCall({
      url: `${API_BASE_URL}/donations/add`,
      method: "POST",
      data: formData,
      requiresAuth: true,
    });

    if (response.success) {
      setSuccess("Donation created successfully!");
      toast.success("Donation created successfully!");
      setAmount("");
      setDate("");
      setMethod("");
      setCampaign("");
      setReceiptFile(null);
    } else {
      const errMsg = response.data?.msg || "Failed to create donation";
      setError(errMsg);
      toast.error(`Error: ${errMsg}`);
    }
  } catch (err) {
    setError("Network or server error");
    toast.error("Network or server error");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-section-soft">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-primary mb-6">Make a Donation</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <Input
              type="number"
              step="0.01"
              placeholder="Amount (e.g. 50.00)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Payment Method (e.g. Credit Card)"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Campaign"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setReceiptFile(e.target.files ? e.target.files[0] : null)}
              required
              disabled={isLoading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-primary file:text-white
                         hover:file:bg-primary-dark"
            />

            <Button
              type="submit"
              className="w-full bg-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Donation"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Want to view your donations?{" "}
            <button
              className="text-primary hover:underline"
              onClick={() => navigate("/UserDashboard")}
              disabled={isLoading}
            >
              Dashboard
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonationForm;
