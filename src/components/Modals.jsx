import React from 'react';
import '../css/Modals.css'
import { X } from 'lucide-react';

const Modals = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modals-overlay">
      <div className="modals-content">
        <button className="modals-close-button" onClick={onClose}>
          <X className='h-6 w-6 hover:bg-gray-300 hover:rounded-2xl'/>
        </button>
        <div className="modals-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modals;