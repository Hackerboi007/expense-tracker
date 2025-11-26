import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalContext } from '../../context/globalContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useGlobalContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterStyled>
      <div className="container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-control">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-control">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-control">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-control">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="submit-btn">
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </RegisterStyled>
  );
};

const RegisterStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: rgba(252, 246, 249, 0.78);
  backdrop-filter: blur(4.5px);

  .container {
    background: white;
    padding: 2rem;
    border-radius: 32px;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    width: 100%;
    max-width: 400px;

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: rgba(34, 34, 96, 1);
    }

    form {
      .input-control {
        margin-bottom: 1rem;

        input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #ddd;
          border-radius: 10px;
          font-size: 1rem;
          transition: border-color 0.3s;

          &:focus {
            border-color: rgba(34, 34, 96, 1);
            outline: none;
          }
        }
      }

      .error {
        color: red;
        text-align: center;
        margin-bottom: 1rem;
      }

      .submit-btn {
        button {
          width: 100%;
          padding: 1rem;
          background: rgba(34, 34, 96, 1);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(34, 34, 96, 0.8);
          }

          &:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
        }
      }
    }

    .login-link {
      text-align: center;
      margin-top: 1rem;

      a {
        color: rgba(34, 34, 96, 1);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export default Register;
