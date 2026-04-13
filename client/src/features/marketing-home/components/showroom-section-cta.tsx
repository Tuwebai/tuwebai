import { Link } from 'react-router-dom';

export default function ShowroomSectionCta() {
  return (
    <div className="editorial-surface-panel mt-14 text-center p-8">
      <p className="font-rajdhani text-2xl font-bold text-white sm:text-3xl">
        ¿Tenés un proyecto en mente?
      </p>
      <p className="mx-auto mb-6 mt-4 max-w-2xl text-gray-300">
        Contanos qué necesita tu negocio y te decimos si podemos construirlo, y cómo.
      </p>

      <div className="transition-transform duration-200 hover:scale-[1.05]">
        <Link
          to="/consulta"
          className="inline-block rounded-full bg-[image:var(--gradient-brand)] px-8 py-4 font-medium text-white shadow-[var(--glow-signal)]"
        >
          Quiero una solución similar →
        </Link>
      </div>
    </div>
  );
}
