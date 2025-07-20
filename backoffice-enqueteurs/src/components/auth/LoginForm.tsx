import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDto } from '@/types/api';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginDto>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError(
        error.response?.data?.message || 
        'Erreur de connexion. Vérifiez vos identifiants.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginDto, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen px-3">
      <Card 
        title="Connexion" 
        className="w-full max-w-md"
        header={
          <div className="text-center p-4">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Back-office Enquêteurs
            </h1>
            <p className="text-600 m-0">
              Gestion des plannings des enquêteurs
            </p>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="p-fluid">
          {error && (
            <Message 
              severity="error" 
              text={error} 
              className="mb-3 w-full" 
            />
          )}
          
          <div className="field mb-4">
            <label htmlFor="username" className="block text-900 font-medium mb-2">
              Nom d'utilisateur
            </label>
            <InputText
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
              className={error ? 'p-invalid' : ''}
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>

          <div className="field mb-4">
            <label htmlFor="password" className="block text-900 font-medium mb-2">
              Mot de passe
            </label>
            <Password
              id="password"
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              className={error ? 'p-invalid' : ''}
              placeholder="Entrez votre mot de passe"
              feedback={false}
              toggleMask
            />
          </div>

          <Button
            type="submit"
            label="Se connecter"
            loading={isLoading}
            className="w-full"
            size="large"
          />
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;