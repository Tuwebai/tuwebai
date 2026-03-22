# AGENTS.md — AI Engineering Protocol

Este documento define cómo los agentes de IA deben trabajar en este repositorio.

Todos los agentes (GPT, Claude, Codex, etc.) deben leer este archivo antes de modificar código.

# IMPORTANTISIMO:

PRIORIZA EL IDIOMA ESPAÑOL LATINO POR SOBRE CUALQUIER COSA,SI EL USUARIO TE HABLA EN
ESPAÑOL O EN CUALQUIER LENGUAJE DEBES DIRIGIRTE AL USUARIO EN ESPAÑOL LATINO SIEMPRE OBLIGATORIAMENTE,TANTO
PARA COMENTARIOS,PLANES,TASK,WALKTROUGH,AUDITORIAS ,TODO LO QUE VEA EL USUARIO,PIENSA,THINKIN , ETC.## 0️⃣
REGLA BASE — CONTEXTO OBLIGATORIO ANTES DE TOCAR CÓDIGO

ESTOY EN WINDOWS 10,EJECUTA COMANDO DE POWERSHELL SEPARADOS POR ;

WINDOWS BLOQUEA PATCHES GRANDES,ASI QUE TRABAJA EN PATCHES PEQUEÑOS PERO DE MANERA ENTERPRISE

El objetivo es garantizar:

- cambios seguros
- cero regresiones
- arquitectura consistente
- deuda técnica controlada
- código mantenible a largo plazo

---

# 1. Principios fundamentales

Antes de modificar cualquier archivo:

1. entender el flujo completo
2. identificar la causa raíz
3. analizar impacto en el sistema
4. aplicar el cambio mínimo necesario pero enterprise,ningun fix debe ser básico ni temporal

Nunca modificar código sin contexto suficiente.

---

# 2. Regla de cambios mínimos

Los agentes deben preferir:

- cambios pequeños
- cambios aislados
- cambios verificables
- cambios enterprises

Evitar:

- refactors innecesarios
- reescrituras completas
- cambios especulativos
- cambios básicos
- cambios temporales

---

# 3. Arquitectura del proyecto

Estructura principal:
src/
components/
hooks/
services/
api/
config/
utils/

Responsabilidades:

components → UI  
hooks → estado y queries  
services → lógica de dominio  
api → comunicación con backend  
config → configuración global  
utils → utilidades puras

---

# 4. Flujo de datos obligatorio

La arquitectura debe seguir esta dirección:
UI → hooks → services → API

Reglas:

- La UI nunca llama APIs directamente
- hooks coordinan estado y queries
- services contienen lógica del dominio
- api contiene comunicación externa

---

# 5. Contratos de API

Los contratos de API se consideran estables.

Un agente NO debe:

- eliminar campos
- renombrar campos
- cambiar formatos de respuesta

sin analizar impacto en todo el sistema.

---

# 6. Base de datos como Source of Truth

La base de datos real es la fuente de verdad.

Nunca asumir que:
schema.sql
migrations

reflejan exactamente el estado real.

Siempre verificar schema en la DB.

---

# 7. Anti‑regresión obligatoria

Si algo funcionaba antes, debe seguir funcionando.

Antes de finalizar un cambio verificar:

- rutas
- contratos API
- exports públicos
- props de componentes
- comportamiento UI

---

# 8. TypeScript Rules

Evitar completamente:
any
ts-ignore

Preferir:

- tipos explícitos
- interfaces claras
- types reutilizables

---

# 9. Organización de código

Cada archivo debe tener una responsabilidad clara.

Evitar:

- archivos gigantes (>500 líneas)
- controllers monolíticos
- lógica duplicada

Si un archivo crece demasiado, dividirlo.

Para pantallas complejas, tabs, dashboards o formularios largos:

- preferir un componente contenedor/orquestador y subcomponentes por seccion o tab
- cada subcomponente debe mantener una responsabilidad visual o funcional clara
- no dividir por dividir: solo separar cuando reduzca complejidad, acoplamiento o riesgo de regresion
- evitar componentes gigantes con multiples tabs embebidas si ya afectan lectura, testing o mantenimiento
- evitar tambien fragmentacion excesiva en archivos diminutos sin valor arquitectonico real

---

# 10. Debugging protocol

Un bug solo se considera resuelto si:

1. se reproduce
2. se identifica causa raíz
3. se aplica fix
4. se verifica impacto

No aplicar fixes superficiales.

---

# 11. Seguridad

Nunca introducir:

- endpoints sin autenticación
- validación incompleta
- acceso directo a datos sensibles

Siempre validar:

- input
- permisos
- autenticación

---

# 12. Manejo de errores

Todo acceso externo debe manejar errores.

Ejemplo:

- llamadas API
- base de datos
- servicios externos

Nunca asumir éxito implícito.

---

# 13. Logging

Logs deben ser:

- útiles
- claros
- sin datos sensibles

Evitar logs excesivos.

---

# 14. Dependencias

Antes de agregar una dependencia nueva:

verificar si la funcionalidad ya existe en el proyecto.

Evitar dependencias innecesarias.

---

# 14.1 Reglas de diseño y skills visuales

Si existe una carpeta de referencia visual o de skills de diseño en el repo, por ejemplo `ui-ux-pro-max-skill/`, todo agente debe:

- auditarla antes de aplicar cambios visuales relevantes
- respetar sus reglas, patrones y criterio de diseño en la medida en que sean compatibles con el producto
- usarla como referencia de diseño premium, no como runtime ni dependencia del build
- priorizar siempre la identidad visual de TuWeb.ai por sobre recomendaciones genéricas del skill
- respetar lo mas posible la paleta, contraste, jerarquía y lenguaje visual ya establecidos en TuWeb.ai

---

# 15. Código muerto

Eliminar:

- imports no usados
- funciones no usadas
- variables zombies

pero solo después de confirmar que no tienen uso indirecto.

---

# 16. Refactors

Los refactors deben ser:

- explícitos
- documentados
- probados

Nunca mezclar refactor con cambio funcional.

---

# 17. Convenciones de naming

Usar nombres claros y consistentes.

Ejemplos:
getUserProfile
createTicket
sendNotification

Evitar nombres genéricos como:
data
info
handler

---

# 18. Estructura de commits

Un cambio debe ser:

- pequeño
- comprensible
- reversible

Evitar commits masivos.

---

# 19. Archivos prohibidos en el repo

Nunca versionar:
node_modules
dist
build
logs
.env
docs/

Si un archivo o carpeta está en `.gitignore`:

- no forzar `git add -f`
- no commitearlo
- no cambiar esa regla salvo pedido explícito del usuario

---

# 20. Definition of Done

Un cambio se considera completo si:

- TypeScript compila
- no hay errores de lint
- no hay `any`
- no se rompen contratos
- no hay regresiones
- el código sigue la arquitectura definida
- Se actualiza la auditoria correspondiente en los puntos marcados como bugs,errores,como corregidos con check verde sin agregar mas secciones ni reemplazar ningun contenido

---

# 21. Documentos adicionales

Este documento define reglas para agentes de IA.

Otros documentos del proyecto:
ARCHITECTURE.md
ENGINEERING_GUIDELINES.md
SECURITY.md
DEPENDENCY_POLICY.md

Cada uno cubre áreas específicas.

Los agentes deben respetarlos cuando existan.

---

## Enterprise Slice Workflow

Todo agente que trabaje en el repositorio debe seguir este flujo de trabajo obligatorio.

### 1. Auditar primero

Antes de modificar código:

- revisar archivos relacionados
- identificar causa raíz
- evaluar impacto
- verificar dónde se menciona el problema en documentación o auditorías existentes

### 2. Mini plan enterprise

Definir un plan corto de 3–5 pasos que incluya:

- alcance del cambio
- archivos afectados
- riesgo de regresión

### 3. Fix seguro

Aplicar una solución técnica adecuada al problema manteniendo consistencia con la arquitectura del proyecto.

Evitar cambios innecesarios fuera del alcance del bug o mejora.

### 4. Actualizar documentación

Si el problema aparece en:

- auditorías
- documentación
- reportes técnicos

marcarlo como corregido en todas las secciones donde se mencione.

### 5. Tests solo cuando corresponda

Si se modifica código ejecutar:

```
npm run check
npm run lint
npm run build
npm run smoke

```

Si el cambio es solo documentación, no es necesario ejecutar tests.

### 6. Commit por slice

Cada cambio debe quedar en un commit claro y reversible.

El mensaje debe indicar:

- tipo de cambio
- área afectada
- motivo del fix

---

# 22. Principio final

Cuando haya duda:

priorizar siempre:

- seguridad
- mantenibilidad
- simplicidad
- estabilidad

sobre velocidad de implementación.
