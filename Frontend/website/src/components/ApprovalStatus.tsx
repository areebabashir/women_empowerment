import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface ApprovalStatusProps {
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  role: string;
}

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({ status, rejectionReason, role }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-8 h-8 text-yellow-500" />,
          title: 'Pending Approval',
          description: `Your ${role} account is currently under review. Please wait for admin approval.`,
          color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'Approved',
          description: `Your ${role} account has been approved! You can now access your dashboard.`,
          color: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          title: 'Rejected',
          description: `Your ${role} account has been rejected.`,
          color: 'bg-red-50 border-red-200 text-red-800'
        };
      default:
        return {
          icon: <Clock className="w-8 h-8 text-gray-500" />,
          title: 'Unknown Status',
          description: 'Unable to determine approval status.',
          color: 'bg-gray-50 border-gray-200 text-gray-800'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className={`p-6 rounded-lg border ${config.color}`}>
          <div className="flex items-center justify-center mb-4">
            {config.icon}
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-2">
            {config.title}
          </h2>
          
          <p className="text-center mb-4">
            {config.description}
          </p>

          {status === 'rejected' && rejectionReason && (
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
              <p className="text-sm text-red-700">{rejectionReason}</p>
            </div>
          )}

          {status === 'pending' && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                We typically review applications within 24-48 hours. You will receive an email notification once your account is reviewed.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalStatus; 