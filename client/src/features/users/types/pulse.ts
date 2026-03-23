export interface PulsePreviewData {
  hasData: boolean;
  visits?: number;
  month?: string;
}

export type PulseAccessStatus = 'enabled' | 'pending_activation';

export interface PulseStatusData {
  status: PulseAccessStatus;
}

export interface PulseTokenData {
  token: string;
  redirect_url: string;
}
