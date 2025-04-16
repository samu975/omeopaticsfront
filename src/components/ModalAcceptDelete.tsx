import React from 'react';

interface ModalAcceptDeleteProps {
  isOpen: boolean;
  title: string;
  message: string;
  onAccept: () => void;
  onClose: () => void;
  acceptButtonText?: string;
  cancelButtonText?: string;
}

const ModalAcceptDelete: React.FC<ModalAcceptDeleteProps> = ({ 
  isOpen, 
  title, 
  message, 
  onAccept, 
  onClose,
  acceptButtonText = 'Eliminar',
  cancelButtonText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  return (
    <dialog id="delete_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn btn-error" onClick={onAccept}>{acceptButtonText}</button>
          <button className="btn btn-secondary" onClick={onClose}>{cancelButtonText}</button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalAcceptDelete;
