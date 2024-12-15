import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateMatchForm from './forms/CreateMatchForm';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    playersPerTeam: '',
    genderPreference: '',
    skillLevel: '',
    date: '',
    time: '',
    duration: '',
    venueId: '',
    description: ''
  });

  const handleNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleCreateMatch = async (match: any) => {
    onClose();
    navigate(`/soccer/match/${match.id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
      >
        <div className="sticky top-0 bg-gray-900 z-10 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Match</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <CreateMatchForm
            formData={formData}
            onNext={handleNext}
            onClose={onClose}
            onCreateMatch={handleCreateMatch}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CreateMatchModal;