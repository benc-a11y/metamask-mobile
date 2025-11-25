import { SecurityAlertResponse } from '../BlockaidBanner/BlockaidBanner.types';
import { IQRState } from '../../../../../UI/QRHardware/types';
import { IUseMetricsHook } from '../../../../../hooks/useMetrics/useMetrics.types';

export interface MessageInfo {
  origin: string;
  type: string;
}

export interface PageMeta {
  analytics?: {
    request_platform: string;
    request_source: string;
  };
  icon?: string;
  title: string;
  url: string;
}

export interface MessageParams {
  data: string;
  from: string;
  metamaskId: string;
  meta?: PageMeta;
  origin: string;
  version?: string;
  securityAlertResponse?: SecurityAlertResponse;
}

export interface SignatureRequestProps {
  onReject: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
  currentPageInformation: PageMeta;
  type: string;
  networkType?: string;
  truncateMessage?: boolean;
  toggleExpandedMessage?: () => void;
  fromAddress: string;
  isSigningQRObject?: boolean;
  QRState?: IQRState;
  testID?: string;
  securityAlertResponse?: SecurityAlertResponse;
  metrics: IUseMetricsHook;
  selectedAddress?: string;
}

export { IQRState };
