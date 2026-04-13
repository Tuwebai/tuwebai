import { useFormContext } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { type FormValues, COUNTRIES } from './proposal-request-form.config';
import { FieldError, FieldLabel, inputClassName } from './proposal-request-form-primitives';

export const Step1Identidad = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Identidad</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Dejanos tus datos para responderte con una propuesta clara y a medida.
        </p>
      </div>

      <div>
        <FieldLabel>Nombre</FieldLabel>
        <Input {...register('nombre')} className={inputClassName} placeholder="Tu nombre o el de tu equipo" />
        <FieldError message={errors.nombre?.message} />
      </div>

      <div>
        <FieldLabel>Email</FieldLabel>
        <Input {...register('email')} className={inputClassName} placeholder="tu@empresa.com" type="email" />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <FieldLabel>País</FieldLabel>
        <select {...register('pais')} className={`${inputClassName} w-full px-3`} defaultValue="">
          <option value="" disabled>
            Seleccioná tu país
          </option>
          {COUNTRIES.map((country) => (
            <option key={country.id} value={country.id}>
              {country.label}
            </option>
          ))}
        </select>
        <FieldError message={errors.pais?.message} />
      </div>
    </div>
  );
};
