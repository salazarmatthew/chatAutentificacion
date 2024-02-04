const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = 'https://ayiwlygqjpnralzspnhi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aXdseWdxanBucmFsenNwbmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1MzIzMDYsImV4cCI6MjAyMjEwODMwNn0.uPmeqPDIVojDe5r6pEUo1OYNd4zjTJMxZ01jS0kAchk';
const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verificar las credenciales en tu tabla de Supabase
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, username')
    .eq('username', username)
    .eq('password', password);

  if (error) {
    return res.status(500).json({ error: 'Error al verificar las credenciales' });
  }

  if (data.length === 0) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  // Las credenciales son válidas, genera un token JWT
  const user = { id: data[0].id, username: data[0].username };
  const token = jwt.sign({ user }, 'secret_key');
 // Asegúrate de que esto esté impreso en la consola
  res.json({ token });

});


app.post('/verifyToken', verificarToken, (req, res) => {
  // El token ha sido verificado correctamente
  res.json({ isAuthenticated: true });
});

app.get('/protegida', verificarToken, (req, res) => {
  // Realizar acciones protegidas
  res.json({ mensaje: 'Acceso autorizado' });
});

function verificarToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ mensaje: 'Acceso no autorizado' });

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.status(401).json({ mensaje: 'Token inválido' });
    req.user = decoded.user;
    next();
  });
}

app.listen(3001, () => {
  console.log('Servidor backend en ejecución en http://localhost:3001');
});
