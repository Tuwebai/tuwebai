import {
  requestChecklistWebGratis,
  type ChecklistWebGratisDownloadInput,
} from '@/features/checklist/services/checklist-download.service';

export const useChecklistDownloadSubmission = () => ({
  requestChecklistWebGratis: (payload: ChecklistWebGratisDownloadInput) =>
    requestChecklistWebGratis(payload),
});
