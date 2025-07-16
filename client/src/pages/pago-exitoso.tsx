import React from 'react';
import { Link } from 'react-router-dom';

const PagoExitoso: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
      <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4m5 2a9 9 0 1 1 -18 0a9 9 0 0 1 18 0z" /></svg>
      <h1 className="text-2xl font-bold text-green-700 mb-2">¡Pago realizado con éxito!</h1>
      <p className="text-gray-700 mb-6 text-center">Tu pago fue procesado correctamente. Pronto recibirás acceso a tu plan y un email de confirmación.</p>
      <Link to="/academia" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition-colors">Volver a la Academia</Link>
    </div>
  </div>
);

export default PagoExitoso; 