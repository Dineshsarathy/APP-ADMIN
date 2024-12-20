import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css'; // For the CSS
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    
  
    try {
      const response = await axios.post('http://localhost:8000/auth/employee/login', {
        Email_id: email,
        Password: password,
      });
  
      // Save the token
      localStorage.setItem('token', response.data.token);
  
      // Show success toast
      toast.success(response.data.message || 'Login successful!');
  
      // Navigate to dashboard or another page
      navigate('/dashboard');
    } catch (error) {
      // Show error toast
      toast.error(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };
  

  return (
    <div className='bg-img'>
    <div className="login-container">
      <h2>Employee Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
    </div>
  );
};

export default Login;
