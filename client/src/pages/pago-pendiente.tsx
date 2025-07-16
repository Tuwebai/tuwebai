import React from 'react';
import { Link } from 'react-router-dom';

const PagoPendiente: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
      <svg className="w-16 h-16 text-yellow-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 1a9 9 0 1 1 -18 0a9 9 0 0 1 18 0z" /></svg>
      <h1 className="text-2xl font-bold text-yellow-700 mb-2">Pago pendiente</h1>
      <p className="text-gray-700 mb-6 text-center">Tu pago está siendo procesado. Te avisaremos por email cuando se acredite.</p>
      <Link to="/academia" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded transition-colors">Volver a la Academia</Link>
    </div>
  </div>
);

export default PagoPendiente; 