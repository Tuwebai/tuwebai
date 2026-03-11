/*
DEPRECATED CONFIG

Este archivo no es la fuente oficial de PostCSS.
La configuración vigente vive en ../postcss.config.js en la raíz del repositorio.
Se conserva solo por compatibilidad y trazabilidad histórica.
*/
export default {
  plugins: {
    tailwindcss: {
      config: './tailwind.config.ts',
    },
    autoprefixer: {},
  },
};
