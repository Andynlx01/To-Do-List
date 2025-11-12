import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login, register, clearError } from '../store/slices/authSlice';
import '../styles/Login.scss';

const Login: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (isLoginMode) {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      dispatch(register(formData));
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    dispatch(clearError());
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">📝 To-Do List</h1>
        <h2 className="login-subtitle">
          {isLoginMode ? 'Bem-vindo de volta!' : 'Crie sua conta'}
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLoginMode}
                placeholder="Seu nome completo"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Aguarde...' : isLoginMode ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="toggle-mode">
          {isLoginMode ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
          <button onClick={toggleMode} className="btn-link">
            {isLoginMode ? 'Cadastre-se' : 'Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;