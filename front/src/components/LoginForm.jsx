import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './LoginForm.css';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Realiza una consulta a la tabla de usuarios para verificar las credenciales
            const { data, error } = await supabase
                .from('usuarios')
                .select()
                .eq('username', credentials.username)
                .eq('password', credentials.password)
                .single();

            if (error) {
                console.error('Error al verificar credenciales:', error.message);
                setError('Error al verificar credenciales');
            } else if (!data) {
                console.log('Credenciales incorrectas');
                setError('Credenciales incorrectas');
            } else {
                // Las credenciales son válidas, genera un token JWT
                const response = await axios.post('http://localhost:3001/login', {
                    username: credentials.username,
                    password: credentials.password,
                });

                console.log('Respuesta del servidor:', response);

                if (response.data && response.data.token) {
                    // Almacena el token en el almacenamiento local
                    localStorage.setItem('token', response.data.token);
                    navigate('/protegida');
                } else {
                    console.log('Error al obtener el token.');
                    setError('Error al obtener el token');
                }
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            setError('Error al realizar la solicitud');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="logo-container">
                    <i class="bi bi-person-bounding-box"></i>
                    </div>
                    <form onSubmit={handleSubmit} className="tu-formulario-estilo">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username:</label>
                            <input type="text" className="form-control" id="username" name="username" onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input type="password" className="form-control" id="password" name="password" onChange={handleInputChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
