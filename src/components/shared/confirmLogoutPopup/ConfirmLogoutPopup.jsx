
import React from 'react';
import ReactDOM from 'react-dom';
import '../confirmDeletePopup/ConfirmDeletePopup.css';

const ConfirmLogoutPopup = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  // Using portal to render the modal at the root level
  return ReactDOM.createPortal(
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-container">
        <h3 className="confirm-modal-header">Confirm Logout</h3>
        <p className="confirm-modal-message">Are you sure you want to logout?</p>
        <div className="confirm-modal-buttons">
          <button className="button btn-cancel" onClick={onClose}>Cancel</button>
          <button className="button btn-confirm" onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>,
    document.body // Mount directly to the body element
  );
};

export default ConfirmLogoutPopup;