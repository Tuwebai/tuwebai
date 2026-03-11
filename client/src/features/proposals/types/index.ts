export interface ProposalSubmissionInput {
  nombre: string;
  email: string;
  tipo_proyecto: string;
  servicios?: string;
  presupuesto?: string;
  plazo?: string;
  detalles: string;
}
