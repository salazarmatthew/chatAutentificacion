import { useState } from 'react';
import PropTypes from 'prop-types';

const MessageForm = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      console.log('Message to send:', message); // Registrar el mensaje antes de enviarlo
      onSendMessage(message);
      setMessage('');
    } else {
      console.error('Error: Message cannot be empty');
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={message} onChange={handleChange} />
      <button type="submit">Enviar</button>
    </form>
  );
};

MessageForm.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
};

export default MessageForm;