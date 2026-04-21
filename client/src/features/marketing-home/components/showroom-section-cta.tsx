import { Link } from 'react-router-dom';

export default function ShowroomSectionCta() {
  return (
    <div className="noise-overlay relative mt-14 overflow-hidden rounded-[32px] border border-white/8 bg-[var(--bg-surface)] p-8 text-center">
      <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[var(--signal)]/15 blur-3xl" />
      <p className="relative text-2xl font-black text-white sm:text-3xl">
        ¿Tenés un proyecto en mente?
      </p>
      <p className="relative mx-auto mb-6 mt-4 max-w-2xl text-gray-300">
        Contanos qué necesita tu negocio y te decimos si podemos construirlo, y cómo.
      </p>

      <div className="relative transition-transform duration-200 hover:scale-[1.05]">
        <Link
          to="/consulta"
          className="glow-violet inline-block rounded-full bg-[image:var(--gradient-brand)] px-8 py-4 font-medium text-white"
        >
          Quiero una solución similar →
        </Link>
      </div>
    </div>
  );
}
