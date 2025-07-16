import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { API_URL } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const Contacto: React.FC = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al enviar el mensaje');
      setSent(true);
      toast({ title: 'Mensaje enviado', description: '¡Gracias por contactarnos! Te responderemos pronto.' });
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' });
    } catch (err) {
      toast({ title: 'Error', description: 'No se pudo enviar el mensaje. Intenta de nuevo.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0f] to-[#18181b] p-4">
      <div className="bg-[#18181b] rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#00ccff] mb-2 font-rajdhani">Contacto de Soporte</h1>
        <p className="text-gray-400 mb-6 text-center">¿Tenés dudas, problemas o necesitás ayuda? Completá el formulario y nuestro equipo de soporte te responderá a la brevedad.</p>
        {sent ? (
          <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg shadow-md mt-8">
            <img src="/logo-tuwebai.png" alt="Logo TuWeb.ai" className="w-20 h-20 mb-2" />
            <h2 className="text-2xl font-bold text-primary">¡Mensaje enviado!</h2>
            <p className="text-gray-600">Gracias por contactarnos. Te responderemos pronto.</p>
            <Button onClick={() => navigate('/')} className="mt-4">Volver al inicio</Button>
          </div>
        ) : (
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nombre" className="block text-white font-medium mb-1">Nombre completo</label>
              <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required className="bg-[#1A1A23] border-gray-700 text-white" placeholder="Tu nombre" />
            </div>
            <div>
              <label htmlFor="email" className="block text-white font-medium mb-1">Correo electrónico</label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="bg-[#1A1A23] border-gray-700 text-white" placeholder="tu@email.com" />
            </div>
            <div>
              <label htmlFor="asunto" className="block text-white font-medium mb-1">Asunto</label>
              <Input id="asunto" name="asunto" value={form.asunto} onChange={handleChange} required className="bg-[#1A1A23] border-gray-700 text-white" placeholder="Motivo del contacto" />
            </div>
            <div>
              <label htmlFor="mensaje" className="block text-white font-medium mb-1">Mensaje</label>
              <Textarea id="mensaje" name="mensaje" value={form.mensaje} onChange={handleChange} required className="bg-[#1A1A23] border-gray-700 text-white" placeholder="Contanos en qué podemos ayudarte" rows={5} />
            </div>
            <Button type="submit" className="w-full py-3 text-lg bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-semibold" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contacto; 