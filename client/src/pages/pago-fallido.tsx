import React from 'react';
import { Link } from 'react-router-dom';

const PagoFallido: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
      <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.995-1.85l.007-.15V6c0-1.054-.816-1.918-1.85-1.995L19.856 4H4.144C3.09 4 2.226 4.816 2.149 5.85L2.142 6v12c0 1.054.816 1.918 1.85 1.995l.15.005z" /></svg>
      <h1 className="text-2xl font-bold text-red-700 mb-2">Pago fallido</h1>
      <p className="text-gray-700 mb-6 text-center">No pudimos procesar tu pago. Por favor, revisá tus datos o intentá nuevamente.</p>
      <Link to="/academia" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-colors">Reintentar</Link>
    </div>
  </div>
);

export default PagoFallido; 