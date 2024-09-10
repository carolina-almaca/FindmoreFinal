// ToastNotification.js
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastNotification = ({ show, handleClose, toast }) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} onClose={handleClose} bg={toast.variant} delay={3000} autohide>
        <Toast.Header style={{ fontSize: '18px' }}>
          <strong className="me-auto">{toast.variant === 'success' ? 'Sucesso' : 'Erro'}</strong>
        </Toast.Header>
        <Toast.Body style={{
            fontSize: '24px',
        }}>{toast.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
