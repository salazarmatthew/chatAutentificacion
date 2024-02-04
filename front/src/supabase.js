// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayiwlygqjpnralzspnhi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aXdseWdxanBucmFsenNwbmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1MzIzMDYsImV4cCI6MjAyMjEwODMwNn0.uPmeqPDIVojDe5r6pEUo1OYNd4zjTJMxZ01jS0kAchk';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Función para verificar credenciales
export const verifyCredentials = async (username, password) => {
    try {
      // Realiza una consulta a la tabla personalizada para verificar las credenciales
      const { data, error } = await supabase
        .from('usuarios')
        .select()
        .eq('username', username)
        .eq('password', password)
        .single();
  
   
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      return { error: 'Error al verificar credenciales' };
    }
  };