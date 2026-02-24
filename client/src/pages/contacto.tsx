import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';

const Contacto: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', title: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlert(null);

    try {
      const data = await backendApi.submitContact(form);
      setAlert({ type: 'success', message: data.message || 'Mensaje enviado. Te responderemos pronto.' });
      setForm({ name: '', email: '', title: '', message: '' });
    } catch (err) {
      setAlert({
        type: 'error',
        message: getUiErrorMessage(err, 'No se pudo enviar el mensaje. Intenta de nuevo.'),
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0f] to-[#18181b] p-4">
      <div className="bg-[#18181b] rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#00ccff] mb-2 font-rajdhani">Contacto de Soporte</h1>
        <p className="text-gray-400 mb-6 text-center">Tenes dudas, problemas o necesitas ayuda? Completa el formulario y nuestro equipo de soporte te respondera a la brevedad.</p>
        {alert && (
          <div className={`w-full mb-4 px-4 py-3 rounded text-center font-semibold ${alert.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{alert.message}</div>
        )}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-white font-medium mb-1">Nombre completo</label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required className="bg-[#1A1A23] border-gray-700 text-white" placeholder="Tu nombre" />
          </div>
          <div>
            <label htmlFor="email" className="block text-white font-medium mb-1">Correo electronico</label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="bg-[#1A1A23] border-gray-700 text-white" placeholder="tu@email.com" />
          </div>
          <div>
            <label htmlFor="title" className="block text-white font-medium mb-1">Asunto</label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} required className="bg-[#1A1A23] border-gray-700 text-white" placeholder="Motivo del contacto" />
          </div>
          <div>
            <label htmlFor="message" className="block text-white font-medium mb-1">Mensaje</label>
            <Textarea id="message" name="message" value={form.message} onChange={handleChange} required className="bg-[#1A1A23] border-gray-700 text-white" placeholder="Contanos en que podemos ayudarte" rows={5} />
          </div>
          <Button type="submit" className="w-full py-3 text-lg bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-semibold" disabled={isSubmitting}>
            {isSubmitting ? <span className="animate-pulse">Enviando...</span> : 'Enviar'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contacto;
