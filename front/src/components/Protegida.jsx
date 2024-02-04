import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

import MessageList from './MessageList';
import MessageForm from './MessageForm';

const supabaseUrl = 'https://ayiwlygqjpnralzspnhi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aXdseWdxanBucmFsenNwbmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1MzIzMDYsImV4cCI6MjAyMjEwODMwNn0.uPmeqPDIVojDe5r6pEUo1OYNd4zjTJMxZ01jS0kAchk';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();

    const intervalId = setInterval(fetchMessages, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...'); 
      const { data: messagesData, error } = await supabase.from('messages').select('*');
      if (error) {
        throw error;
      }
      const formattedMessages = messagesData.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp).toLocaleString(),
        content: `📌 ${message.content}`
      }));
      setMessages(formattedMessages);
      console.log('Messages loaded:', formattedMessages); 
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const handleSendMessage = async (message) => {
    try {
      if (!message) {
        console.error('Error sending message: message is empty');
        return;
      }

      // Obtener la dirección IP del cliente
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const clientIP = data.ip;

      console.log('Sending message:', message, 'from IP:', clientIP); // Registrar el mensaje y la IP del cliente

      // Agregar la dirección IP al mensaje
      const messageWithIP = `${message} - Sent from: ${clientIP}`;

      // Enviar el mensaje a Supabase
      const { data: newMessageData, error } = await supabase.from('messages').insert([{ content: messageWithIP }]);
      if (error) {
        throw error;
      }
      if (newMessageData !== null && newMessageData.length > 0) {
        const formattedMessage = {
          ...newMessageData[0],
          timestamp: new Date(newMessageData[0].timestamp).toLocaleString(),
          content: `📌 ${newMessageData[0].content}`
        };
        setMessages(prevMessages => [...prevMessages, formattedMessage]);
        console.log('Message sent:', formattedMessage); // Registrar el mensaje enviado
      } else {
        console.error('Error sending message: newMessageData is null or empty');
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };


  return (
    <div>
      <h1>Aplicación de Mensajería Segura</h1>
      <MessageList messages={messages} />
      <MessageForm onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;