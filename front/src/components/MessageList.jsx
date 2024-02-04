import PropTypes from 'prop-types';

const MessageList = ({ messages }) => {
  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          message && (
            <li key={index} className="border-b border-gray-200 p-2">
              {message.id && <p>ID: {message.id}</p>}
              {message.content && <p>Mensaje: {message.content}</p>}
              {message.timestamp && <p>Enviado: {message.timestamp}</p>}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
};

export default MessageList;