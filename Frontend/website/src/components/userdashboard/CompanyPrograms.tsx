import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Edit, Trash2, Users, Calendar, Search, Eye } from "lucide-react";
import { Program } from "../../types";
import { apiCall } from "../../api/apiCall";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateProgramModal from "./CreateProgramModal";
import UpdateProgramModal from "./UpdateProgramModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface CompanyProgramsProps {
  user: any;
}

interface Participant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const CompanyPrograms: React.FC<CompanyProgramsProps> = ({ user }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [programToUpdate, setProgramToUpdate] = useState<Program | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanyPrograms();
  }, []);

  const fetchCompanyPrograms = async () => {
    try {
      console.log('🔍 Fetching company programs...');
      console.log('Current user:', user);
      
      const response = await apiCall({
        url: `${API_BASE_URL}/programs/company/programs`,
        method: 'GET',
        requiresAuth: true
      });

      console.log('📡 API Response:', response);

      if (response.success) {
        const programsData = response.data.programs || response.data || [];
        console.log('📊 Programs received:', programsData);
        console.log('📊 Number of programs:', programsData.length);
        setPrograms(programsData);
      } else {
        console.error('❌ API call failed:', response);
        toast.error('Failed to fetch programs');
      }
    } catch (error) {
      console.error('❌ Error fetching programs:', error);
      toast.error('Error loading programs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const response = await apiCall({
        url: `${API_BASE_URL}/programs/delete/${programId}`,
        method: 'DELETE',
        requiresAuth: true
      });

      if (response.success) {
        toast.success('Program deleted successfully!');
        fetchCompanyPrograms();
      } else {
        toast.error('Failed to delete program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Error deleting program');
    }
  };

  const handleUpdateProgram = (program: Program) => {
    setProgramToUpdate(program);
    setShowUpdateModal(true);
  };

  const handleViewParticipants = async (programId: string) => {
    setShowParticipantsModal(true);
    setParticipantsLoading(true);
    setSelectedProgram(programId);
    
    try {
      const response = await apiCall({
        url: `${API_BASE_URL}/programs/${programId}/participants`,
        method: 'GET',
        requiresAuth: true
      });

      if (response.success) {
        setParticipants(response.data.participants || []);
      } else {
        setParticipants([]);
        toast.error('Failed to fetch participants');
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipants([]);
      toast.error('Error loading participants');
    } finally {
      setParticipantsLoading(false);
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    if (!selectedProgram) return;
    
    setDeletingId(participantId);
    try {
      const response = await apiCall({
        url: `${API_BASE_URL}/programs/${selectedProgram}/deleteparticipants`,
        method: 'DELETE',
        data: { participantId },
        requiresAuth: true
      });

      if (response.success) {
        setParticipants(prev => prev.filter(p => p._id !== participantId));
        toast.success('Participant removed successfully');
      } else {
        toast.error('Failed to remove participant');
      }
    } catch (error) {
      console.error('Error removing participant:', error);
      toast.error('Error removing participant');
    } finally {
      setDeletingId(null);
    }
  };

  const downloadCSV = () => {
    if (!participants || participants.length === 0) return;
    
    const keys = Object.keys(participants[0]);
    const csvRows = [
      keys.join(','),
      ...participants.map(row => 
        keys.map(k => `"${(row[k] ? String(row[k]).replace(/"/g, '""') : '')}"`).join(',')
      )
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'program_participants.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#7F264B]">My Programs</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F264B]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#7F264B]">My Programs</h1>
        <Button 
          className="bg-[#7F264B] hover:bg-[#6a1f3f]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Program
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <div key={program._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {program.image && (
              <img
                src={`${API_BASE_URL.replace('/api', '')}/uploads/${program.image}`}
                alt={program.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{program.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{program.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(program.startingDate).toLocaleDateString()} - {new Date(program.endingDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {program.day} {program.time}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  {program.participants?.length || 0} participants
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewParticipants(program._id)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Participants
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleUpdateProgram(program)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteProgram(program._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first program.'}
          </p>
        </div>
      )}

      {/* Create Program Modal */}
      <CreateProgramModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchCompanyPrograms}
      />

      {/* Update Program Modal */}
      <UpdateProgramModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setProgramToUpdate(null);
        }}
        onSuccess={fetchCompanyPrograms}
        program={programToUpdate}
      />

      {/* Participants Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b">
              <h2 className="text-xl font-bold">Program Participants</h2>
              <div className="flex gap-2">
                <button
                  onClick={downloadCSV}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                  disabled={!participants || participants.length === 0}
                  title="Download as CSV"
                >
                  Download CSV
                </button>
                <button 
                  onClick={() => setShowParticipantsModal(false)} 
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Content with Scroll */}
            <div className="flex-1 overflow-hidden">
              {participantsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F264B]"></div>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No participants enrolled in this program yet.
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Phone</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Role</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {participants.map((p, idx) => (
                          <tr key={p._id || idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.email || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.phone || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.role || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => handleDeleteParticipant(p._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                                disabled={deletingId === p._id}
                              >
                                {deletingId === p._id ? 'Removing...' : 'Remove'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with participant count */}
            {participants.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  Total Participants: <span className="font-semibold">{participants.length}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPrograms; 