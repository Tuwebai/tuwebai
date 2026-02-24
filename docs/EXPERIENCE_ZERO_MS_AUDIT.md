# Auditoría Experiencia 0ms — Tuwebai

**Fecha:** 2026-02-24  
**Alcance:** Zero perceived latency, validación backend silenciosa y eliminación de esperas visibles innecesarias.

## 1. Resumen ejecutivo
- Principio aplicado: feedback instantáneo en UI, validación de servidor en background y rollback solo cuando hay error real.
- Inventario resumido (inspección estática, sin benchmark runtime): 17 flujos con red/escritura revisados. 14 bloqueantes y 3 parcialmente optimistas.
- Estado actual: predomina el patrón `await` + `isSubmitting/isPending` + botones deshabilitados + textos de espera (`Enviando...`, `Procesando...`, `Cargando...`).
- Hallazgo central: la UI suele esperar la confirmación del backend antes de confirmar visualmente al usuario.

Top 10 puntos con mayor espera percibida:
1. `contacto.tsx` + `contact-section.tsx`: submit bloqueante hasta `/contact`.
2. `consulta.tsx`: `isSubmitting` y bloqueo en paso final.
3. `newsletter-form.tsx`: estado `Procesando...` + disabled total.
4. `testimonial-form.tsx`: `mutateAsync` + `isPending` sin optimistic cache.
5. `vacantes.tsx`: modal bloqueado durante submit.
6. `LoginModal.tsx`: submit bloqueante + doble toast de éxito.
7. `AuthContext.tsx`: `isLoading` global acoplado a mutaciones.
8. `panel-usuario.tsx`: guardados bloqueantes con `isSaving` global.
9. `route-wrapper.tsx`: fallback full-screen `Cargando...`.
10. `pricing-section.tsx`: transición de pago bloqueante antes de redirección.

Plan en 3 fases:
- Quick wins (1-3 días): quitar spinners de submit no críticos, feedback inmediato y toast solo en error.
- Refactors (1-2 semanas): optimistic updates (`onMutate`/rollback), separación de estados globales/locales y prefetch de rutas.
- Validación continua: E2E de “sin espera visible” por flujo y presupuesto UX (feedback visual percibido < 100 ms).

## 2. Inventario por flujo (acción -> estado -> recomendación)

| Flujo | Estado actual | Recomendación 0ms | Archivo(s) |
|---|---|---|---|
| Contacto soporte | Bloqueante (`isSubmitting`) | Confirmación optimista + envío en background | `client/src/pages/contacto.tsx` |
| Contacto landing | Bloqueante | Mismo patrón optimista | `client/src/components/sections/contact-section.tsx` |
| Consulta/propuesta | Bloqueante en submit final | Marcar recibido en UI y reconciliar async | `client/src/pages/consulta.tsx` |
| Newsletter | Bloqueante | Suscripción optimista + rollback en error | `client/src/components/ui/newsletter-form.tsx` |
| Testimonios | Parcial bloqueante | `onMutate` + item local “pendiente” + rollback | `client/src/components/ui/testimonial-form.tsx`, `client/src/hooks/use-testimonials.ts` |
| Vacantes | Bloqueante | Cerrar modal y confirmar recepción de inmediato | `client/src/pages/vacantes.tsx`, `client/src/hooks/use-vacancies.ts` |
| Login/registro/reset | Bloqueante | Transición inmediata y error tardío reversible | `client/src/components/auth/LoginModal.tsx` |
| Verify/reset auth | Bloqueante | Skeleton no intrusivo + feedback progresivo | `client/src/pages/auth-verify.tsx` |
| Panel usuario | Bloqueante | Persistencia optimista por campo | `client/src/pages/panel-usuario.tsx` |
| Preferencias | Parcial | Mantener toggle instantáneo y quitar bloqueo global | `client/src/pages/panel-usuario.tsx`, `client/src/contexts/AuthContext.tsx` |
| Crear preferencia de pago | Bloqueante | Precalentar/prefetch + timeout claro + reintento | `client/src/components/sections/pricing-section.tsx` |
| Retorno de pago | Parcial | Estado base inmediato + validación no intrusiva | `client/src/components/payment/payment-return-view.tsx` |
| Navegación lazy | Bloqueante | Skeleton contextual + mantener contenido previo | `client/src/components/route-wrapper.tsx` |
| Home lazy sections | Parcial | Placeholders estructurales por sección | `client/src/pages/home.tsx` |
| Admin guard | Bloqueante | Usar último estado auth cacheado | `client/src/components/auth/AdminRoute.tsx` |
| Dashboard guard | Parcial | Placeholder estable en lugar de `null` | `client/src/components/auth/DashboardRoute.tsx` |
| Mutaciones auth centralizadas | Bloqueante | Desacoplar estado global de operaciones locales | `client/src/contexts/AuthContext.tsx`, `client/src/hooks/use-auth-mutations.ts` |

## 3. Formularios y submits
- Contacto (`contacto.tsx`, `contact-section.tsx`): usa `setIsSubmitting(true)`, deshabilita botón y muestra `Enviando...`.
  Recomendación: confirmación instantánea (“Recibido”), reset inmediato y rollback si falla backend.
- Consulta (`consulta.tsx`): espera `await backendApi.submitProposal(...)` antes de `submitted`.
  Recomendación: invertir orden (optimistic first) y reconciliación posterior.
- Newsletter (`newsletter-form.tsx`): bloquea input y botón durante request.
  Recomendación: mantener interacción y confirmar instantáneamente.
- Testimonial (`testimonial-form.tsx`): `mutateAsync` + pending bloqueante.
  Recomendación: insertar testimonio local “pendiente” en cache.
- Vacantes (`vacantes.tsx`): submit bloqueante del modal.
  Recomendación: cierre inmediato + acuse optimista.
- Auth (`LoginModal.tsx`, `auth-verify.tsx`): loading visible y feedback redundante.
  Recomendación: éxito silencioso en UI, toast solo onError.

## 4. Mutaciones (React Query) y estados de carga
- Uso bloqueante detectado:
  - `mutateAsync` esperado desde UI (`vacantes.tsx`, `testimonial-form.tsx`, `AuthContext.tsx`).
  - `isPending/isSubmitting` usados como bloqueo visual.
- Optimistic update faltante:
  - `useCreateTestimonial` invalida y refetchea, pero no usa `onMutate`.
  - `useApplyVacancy` no actualiza cache ni estado optimista.
  - Auth/perfil/preferencias esperan red antes de consolidar UI en varios caminos.
- Riesgo de invalidación/refetch:
  - `invalidateQueries(['testimonials'])` puede introducir espera visible.
- Recomendación técnica:
  - `onMutate` + `setQueryData` + rollback en `onError` + reconciliación en `onSettled`.

## 5. Navegación y rutas
- `LazyRoute` usa fallback full-screen con spinner y `Cargando...`.
- No se observa prefetch de rutas por hover/focus para las rutas de mayor probabilidad.
- Recomendación:
  - prefetch de `/consulta`, `/panel`, `/vacantes`.
  - fallback de layout/skeleton en vez de spinner global.

## 6. Datos iniciales y listados
- Config actual:
  - `client/src/lib/queryClient.ts`: `staleTime=5m`, `refetchOnWindowFocus=false`, `retry=1`.
  - `client/src/hooks/use-auth-queries.ts`: `enabled: !!uid`, `staleTime=5m`.
- Testimonios:
  - `testimonials-section.tsx` usa spinner en `loading`.
  - `services/testimonials.ts` retorna `[]` en error, lo que puede ocultar estado real.
- Recomendación:
  - cache-first visible, revalidación en background y skeleton estructural en primera carga.

## 7. Backend: validación silenciosa y respuestas
- Contacto/propuesta/newsletter/aplicaciones/testimonios:
  - persisten y luego intentan SMTP; fallback `202` si SMTP falla.
  - punto fuerte: no se cae el flujo frente a fallo SMTP.
  - brecha: cuando SMTP está disponible, se espera su resultado en el request principal.
- Webhook MP:
  - ACK inmediato y procesamiento en background (correcto para 0ms server side).
- Recomendación backend:
  - responder `202` tras validar + persistir, y mover SMTP a cola/outbox.
  - instrumentar timeout/métricas por endpoint.

## 8. Toasts y mensajes al usuario
- Hay exceso de toasts de éxito en auth/perfil/preferencias.
- Existe duplicación de feedback de éxito en auth (hook + componente).
- Recomendación:
  - éxito: reflejo directo en UI.
  - error: toast o inline con opción de reintento.

## 9. Auth y sesión
- `AuthContext.tsx` combina `isLoadingAuth` + mutaciones pendientes en `isLoading` global.
- Impacto: acciones puntuales pueden “congelar” pantallas protegidas.
- Recomendación:
  - separar bootstrap (`isBootLoading`) de estados transaccionales (`isMutatingX`).
  - conservar estado auth previo para evitar parpadeo/blank.

## 10. Checklist de acciones recomendadas
1. ✅ `client/src/components/route-wrapper.tsx`: reemplazar spinner full-screen por skeleton de layout.  
   Estado original: spinner full-screen `Cargando...` en fallback global de rutas lazy.  
   Estado actual: fallback skeleton estructural implementado.  
   Prioridad: Alta.
2. ✅ `client/src/App.tsx` (vía navbar): prefetch de rutas críticas (`/consulta`, `/vacantes`, `/panel`).  
   Estado original: sin prefetch por intención, descarga al click.  
   Estado actual: prefetch deduplicado en `hover/focus/touchstart` desde navegación global.  
   Prioridad: Alta.
3. ✅ `client/src/pages/contacto.tsx`: eliminar bloqueo `Enviando...` y aplicar submit optimista.  
   Estado original: `isSubmitting` bloqueante hasta respuesta de red.  
   Estado actual: feedback inmediato (`Enviado`), envío en background y rollback con restauración de formulario en error.  
   Prioridad: Alta.
4. ✅ `client/src/components/sections/contact-section.tsx`: mismo patrón optimista.  
   Estado original: submit bloqueante + spinner + disabled.  
   Estado actual: confirmación instantánea (`Enviado`), request en background y rollback en error con restauración de snapshot.  
   Prioridad: Alta.
5. ✅ `client/src/pages/consulta.tsx`: mostrar `submitted` de inmediato y sincronizar en background.  
   Estado original: confirmación diferida a éxito backend.  
   Estado actual: feedback inmediato, envío en background y rollback restaurando datos/step en error.  
   Prioridad: Alta.
6. ✅ `client/src/components/ui/newsletter-form.tsx`: eliminar bloqueo principal `Procesando...`.  
   Estado original: input/botón bloqueados durante request.  
   Estado actual: confirmación instantánea (`Enviado`), request en background y rollback restaurando email en error.  
   Prioridad: Alta.
7. ✅ `client/src/hooks/use-testimonials.ts`, `client/src/components/ui/testimonial-form.tsx`: implementar `onMutate` + rollback y submit optimista.  
   Estado original: invalidación + refetch sin optimistic cache, `mutateAsync` bloqueante con `Enviando...`.  
   Estado actual: alta optimista inmediata en cache, rollback en error, submit sin espera visible en modal.  
   Prioridad: Alta.
8. ✅ `client/src/pages/vacantes.tsx`, `client/src/hooks/use-vacancies.ts`: acuse optimista y cierre inmediato de modal.  
   Estado original: modal bloqueado hasta respuesta backend y botón con `Enviando...`.  
   Estado actual: cierre inmediato + feedback optimista en UI, request en background y rollback (reapertura con snapshot) en error.  
   Prioridad: Alta.
9. ✅ `client/src/contexts/AuthContext.tsx`: granularizar estados de loading.  
   Estado original: `isLoading` global acoplado a mutaciones puntuales.  
   Estado actual: `isLoading` limitado a boot auth y nuevo `isMutatingAuth` para operaciones transaccionales.  
   Prioridad: Alta.
10. ✅ `client/src/components/auth/LoginModal.tsx`, `client/src/hooks/use-auth-mutations.ts`: eliminar duplicación de toast éxito/error en UI de auth.  
    Estado original: feedback de éxito/error duplicado (hook + UI).  
    Estado actual: `LoginModal` delega feedback a hooks centralizados y evita duplicación local.  
    Prioridad: Media-Alta.
11. ✅ `client/src/pages/panel-usuario.tsx`: pasar de `isSaving` global a guardado por campo/sección.  
    Estado original: bloqueo transversal de guardado con estado compartido.  
    Estado actual: estados separados (`isSavingProfile`, `isSavingPassword`, `isSavingPreferences`) y controles de preferencias aislados.  
    Prioridad: Media-Alta.
12. ✅ `server/src/controllers/contact.controller.ts`, `server/src/controllers/public.controller.ts`, `server/src/services/email.service.ts`: responder rápido y enviar SMTP en background.  
    Estado original: intento SMTP en request principal (con fallback 202 si falla).  
    Estado actual: respuesta inmediata (202/201 según flujo) y envío `fire-and-forget` con logging centralizado.  
    Prioridad: Alta.
13. ✅ `server/src/services/email.service.ts`: timeout/retry controlado para no arrastrar latencia del request principal.  
    Estado original: latencia SMTP impactaba el request principal.  
    Estado actual: timeout acotado + retry limitado en envío SMTP, ejecutado en background.  
    Prioridad: Media.
14. ✅ `server/src/middlewares/rate-limit.middleware.ts`: revisar `strictApiLimiter` por riesgo de falso positivo en usuarios legítimos.  
    Estado original: límite severo fijo `10/h`.  
    Estado actual: umbral ajustado a `60/h` para endpoints estrictos, manteniendo protección sin bloquear uso legítimo frecuente.  
    Prioridad: Media.
15. ✅ `client/src/components/sections/pricing-section.tsx`: mejorar transición a pago con estrategia de reintento y timeout UX claro.  
    Estado original: espera visible en creación de preferencia sin timeout/retry explícito.  
    Estado actual: timeout controlado + retry acotado antes de fallar con feedback de error.  
    Prioridad: Media.
16. ✅ `client/src/components/payment/payment-return-view.tsx`: mostrar estado base inmediato y validación no bloqueante.  
    Estado original: validación visible con estado de carga principal.  
    Estado actual: estado base inmediato + actualización silenciosa en background.  
    Prioridad: Media.
    Prioridad: Media.

## 11. Estado de implementación (tracking en curso)

| Ítem | Estado original (antes) | Estado actual | Evidencia |
|---|---|---|---|
| 1. `route-wrapper.tsx` fallback de rutas lazy | Spinner full-screen con texto `Cargando...` en `Suspense` | ✅ Implementado: skeleton de layout, sin loader central bloqueante | `client/src/components/route-wrapper.tsx` |
| 2. Prefetch rutas críticas (`/consulta`, `/vacantes`, `/panel`) | Sin prefetch por intención de navegación (carga recién al click) | ✅ Implementado: prefetch deduplicado en hover/focus/touchstart desde navbar | `client/src/lib/route-prefetch.ts`, `client/src/components/ui/global-navbar.tsx` |
| 3. Submit optimista contacto | `isSubmitting` + espera visible de red | ✅ Implementado: feedback inmediato + envío en background + rollback en error | `client/src/pages/contacto.tsx`, `client/src/components/sections/contact-section.tsx` |
| 4. Submit optimista consulta | `isSubmitting` + bloqueo en paso final | ✅ Implementado: `submitted` inmediato + envío en background + rollback de formulario/step en error | `client/src/pages/consulta.tsx` |
| 5. Submit optimista newsletter | `Procesando...` + disabled total | ✅ Implementado: estado `Enviado` inmediato + request en background + rollback de email en error | `client/src/components/ui/newsletter-form.tsx` |
| 6. Testimonios optimistas | `mutateAsync` + spinner `Enviando...` + sin optimistic cache | ✅ Implementado: `onMutate` + rollback + cierre inmediato del modal sin espera visible | `client/src/hooks/use-testimonials.ts`, `client/src/components/ui/testimonial-form.tsx` |
| 7. Aplicaciones a vacantes optimistas | `mutateAsync` + botón `Enviando...` + modal bloqueado | ✅ Implementado: cierre inmediato, toast instantáneo, request en background y rollback de modal/form en error | `client/src/pages/vacantes.tsx`, `client/src/hooks/use-vacancies.ts` |
| 8. Auth loading granular | `isLoading` mezclaba bootstrap + mutaciones y bloqueaba vistas protegidas | ✅ Implementado: `isLoading` solo bootstrap, `isMutatingAuth` para mutaciones puntuales | `client/src/contexts/AuthContext.tsx` |
| 9. Auth feedback duplicado | Toasts de éxito/error en hooks y también en `LoginModal` | ✅ Implementado: `LoginModal` sin toast local de auth; feedback centralizado en hooks | `client/src/components/auth/LoginModal.tsx`, `client/src/hooks/use-auth-mutations.ts` |
| 10. Guardado por secciones en panel | `isSaving` único para perfil/seguridad/preferencias | ✅ Implementado: estado granular por sección y bloqueo aislado de preferencias | `client/src/pages/panel-usuario.tsx` |
| 11. SMTP fuera del request crítico | Endpoints esperaban `sendContactEmail` antes de responder | ✅ Implementado: envío en background con `queueContactEmail` y respuesta inmediata | `server/src/controllers/contact.controller.ts`, `server/src/controllers/public.controller.ts`, `server/src/services/email.service.ts` |
| 12. Resiliencia SMTP | Sin timeout/retry explícito en servicio de email | ✅ Implementado: `withTimeout` + retry controlado para errores transitorios | `server/src/services/email.service.ts` |
| 13. Rate limiting estricto | `strictApiLimiter` con `10/h` generaba riesgo de falsos positivos | ✅ Implementado: ajuste de `strictApiLimiter` a `60/h` | `server/src/middlewares/rate-limit.middleware.ts` |
| 14. Checkout de pago resiliente | Creación de preferencia sin timeout/reintento explícitos | ✅ Implementado: retry acotado + timeout antes de fallback de error UI | `client/src/components/sections/pricing-section.tsx` |
| 15. Retorno de pago no bloqueante | Vista de retorno mostraba validación bloqueante en primer plano | ✅ Implementado: estado base inmediato + revalidación silenciosa en segundo plano | `client/src/components/payment/payment-return-view.tsx` |

---

## Notas metodológicas
- Auditoría basada en inspección de código y configuración.
- No se ejecutaron Lighthouse/DevTools/E2E en este paso.
- Cifras de timing deben tratarse como estimadas hasta instrumentación real.
