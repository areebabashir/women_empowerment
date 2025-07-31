import React from "react";
import { Calendar, DollarSign, Download, ArrowRight, Heart } from "lucide-react";
import { User, Donation } from "../../types";
import { useNavigate } from "react-router-dom";
interface DonationsProps {
  user: User;
  donations: Donation[];
  onViewAll?: () => void;
}

const Donations: React.FC<DonationsProps> = ({ donations, onViewAll }) => {

  const navigate = useNavigate()
  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-[#7F264B]/10 to-purple-100 rounded-full p-8 mb-6">
        <Heart className="w-16 h-16 text-[#7F264B]/60" />
      </div>
      <h3 className="text-2xl font-semibold text-[#7F264B] mb-3">No Donations Yet</h3>
      <p className="text-gray-500 text-center max-w-md leading-relaxed">
        You haven't made any donations yet. Your contribution can make a real difference in someone's life!
      </p>
      <p className="text-gray-500 text-center max-w-md leading-relaxed">
        Once Approved your Donations will appear here !
      </p>
      <button onClick={()=>{navigate("/donate")}} className="mt-6 px-6 py-3 bg-gradient-to-r from-[#7F264B] to-purple-600 text-white rounded-lg hover:from-[#6B1F3A] hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
        Make a Donation
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#7F264B]">MY DONATIONS</h1>
        {donations.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 px-4 py-2 rounded-lg border border-green-200">
            <span className="text-green-700 font-semibold">Total: PKR {totalDonated.toLocaleString()}</span>
          </div>
        )}
      </div>

      {donations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <EmptyState />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {donations.map((donation, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg group relative"
              >
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#7F264B] mb-2">{donation.campaign}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                        <span className="font-semibold text-green-600">PKR {donation.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-[#7F264B]" />
                        {new Date(donation.date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {donation.method}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <a
                      href={`${import.meta.env.VITE_API_URL}\\${donation.receiptUrl}`}
                      download
                      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Receipt
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {donations.length > 0 && (
            <div className="flex justify-center pt-6">
              <button
                onClick={()=> {navigate("/donate")}}
                className="group flex items-center px-8 py-3 bg-gradient-to-r from-[#7F264B] to-purple-600 text-white rounded-lg hover:from-[#6B1F3A] hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="mr-2 font-semibold">Donate Now </span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Donations;