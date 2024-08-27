import PropTypes from 'prop-types';
import './styles/Modal.css';

const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  showSubmitButton = true,
  showCancelButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="custom-modal-header">
          <h2>{title}</h2>
          <button className="custom-modal-close" onClick={onClose}>
            &times;
          </button>
        </header>
        <div className="custom-modal-body">
          {children}
        </div>
        <footer className="custom-modal-footer">
          {showCancelButton && <button className="custom-modal-btn cancel" onClick={onClose}>{cancelText}</button>}
          {showSubmitButton && <button className="custom-modal-btn submit" onClick={onSubmit}>{submitText}</button>}
        </footer>
      </div>
    </div>
  );
};

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  showSubmitButton: PropTypes.bool,
  showCancelButton: PropTypes.bool,
};

export default CustomModal;
