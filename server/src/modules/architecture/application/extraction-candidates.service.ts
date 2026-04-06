export type ExtractionDecision = 'extract_now' | 'keep_in_monolith' | 'revisit_later';

export interface ExtractionCandidate {
  candidate: 'notifications' | 'async_jobs' | 'provider_webhooks_hub';
  blockers: string[];
  decision: ExtractionDecision;
  justification: string;
  ownershipReady: boolean;
  scaleSignal: 'low' | 'medium' | 'high';
}

const extractionCandidates: ExtractionCandidate[] = [
  {
    candidate: 'notifications',
    decision: 'revisit_later',
    ownershipReady: false,
    scaleSignal: 'low',
    blockers: [
      'todavia comparte adapters y runtime con mail transaccional',
      'no existe cola separada ni ownership de modulo',
    ],
    justification: 'Todavia no duele lo suficiente como para justificar un deploy separado.',
  },
  {
    candidate: 'async_jobs',
    decision: 'revisit_later',
    ownershipReady: false,
    scaleSignal: 'medium',
    blockers: [
      'no hay scheduler central ni contrato unico de jobs',
      'el volumen actual no exige aislamiento operativo',
    ],
    justification: 'Conviene cerrar el monolito modular antes de separar procesamiento async.',
  },
  {
    candidate: 'provider_webhooks_hub',
    decision: 'keep_in_monolith',
    ownershipReady: true,
    scaleSignal: 'medium',
    blockers: [
      'hoy solo hay pocos webhooks y ya estan encapsulados por modulo',
      'separarlo ahora agregaria complejidad de despliegue sin beneficio claro',
    ],
    justification: 'El hub de webhooks se mantiene como capacidad interna del monolito hasta que aparezca mayor volumen o equipos separados.',
  },
];

export const listExtractionCandidates = (): ExtractionCandidate[] => extractionCandidates;
