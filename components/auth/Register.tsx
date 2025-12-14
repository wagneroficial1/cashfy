import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from '../../components/layouts/AuthLayout';

import { Mail, Lock, User, Building2, AlertCircle } from 'lucide-react';

type AuthStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

type RegisterProps = {
  onBackToLogin: () => void;
};

export default function Register({ onBackToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [status, setStatus] = useState<AuthStatus>('IDLE');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      const copy = { ...errors };
      delete copy[name];
      setErrors(copy);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome completo é obrigatório';
    if (!formData.company.trim()) newErrors.company = 'Empresa é obrigatória';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Senha mínima de 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('LOADING');

    try {
      // TODO: integrar Supabase signup
      await new Promise(r => setTimeout(r, 1200));
      setStatus('SUCCESS');
      onBackToLogin();
    } catch {
      setStatus('ERROR');
      setErrors({ form: 'Erro ao criar conta' });
    } finally {
      setStatus('IDLE');
    }
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Gerencie o financeiro da sua empresa em minutos"
    >
      <form className="space-y-4" onSubmit={handleRegister}>
        {errors.form && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
            <AlertCircle size={16} />
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nome completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={<User size={18} />}
            error={errors.name}
          />
          <Input
            label="Empresa"
            name="company"
            value={formData.company}
            onChange={handleChange}
            icon={<Building2 size={18} />}
            error={errors.company}
          />
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          icon={<Mail size={18} />}
          error={errors.email}
        />

        <Input
          label="Senha"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock size={18} />}
          error={errors.password}
        />

        <Input
          label="Confirmar senha"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<Lock size={18} />}
          error={errors.confirmPassword}
        />

        <Button type="submit" fullWidth isLoading={status === 'LOADING'}>
          Criar conta
        </Button>

        <p className="text-center text-sm text-slate-600">
          Já tem conta?{' '}
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-medium text-primary-600 hover:underline"
          >
            Fazer login
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
