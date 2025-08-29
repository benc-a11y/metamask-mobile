import { type Action } from 'redux';

export enum SettingsActionType {
  SET_SEARCH_ENGINE = 'SET_SEARCH_ENGINE',
  SET_SHOW_HEX_DATA = 'SET_SHOW_HEX_DATA',
  SET_SHOW_CUSTOM_NONCE = 'SET_SHOW_CUSTOM_NONCE',
  SET_SHOW_FIAT_ON_TESTNETS = 'SET_SHOW_FIAT_ON_TESTNETS',
  SET_HIDE_ZERO_BALANCE_TOKENS = 'SET_HIDE_ZERO_BALANCE_TOKENS',
  SET_LOCK_TIME = 'SET_LOCK_TIME',
  SET_PRIMARY_CURRENCY = 'SET_PRIMARY_CURRENCY',
  SET_USE_BLOCKIE_ICON = 'SET_USE_BLOCKIE_ICON',
  TOGGLE_BASIC_FUNCTIONALITY = 'TOGGLE_BASIC_FUNCTIONALITY',
  TOGGLE_DEVICE_NOTIFICATIONS = 'TOGGLE_DEVICE_NOTIFICATIONS',
  SET_TOKEN_SORT_CONFIG = 'SET_TOKEN_SORT_CONFIG',
  SET_DEEP_LINK_MODAL_DISABLED = 'SET_DEEP_LINK_MODAL_DISABLED',
}

export interface SetSearchEngineAction
  extends Action<SettingsActionType.SET_SEARCH_ENGINE> {
  searchEngine: string;
}

export interface SetShowHexDataAction
  extends Action<SettingsActionType.SET_SHOW_HEX_DATA> {
  showHexData: boolean;
}

export interface SetShowCustomNonceAction
  extends Action<SettingsActionType.SET_SHOW_CUSTOM_NONCE> {
  showCustomNonce: boolean;
}

export interface SetShowFiatOnTestnetsAction
  extends Action<SettingsActionType.SET_SHOW_FIAT_ON_TESTNETS> {
  showFiatOnTestnets: boolean;
}

export interface SetHideZeroBalanceTokensAction
  extends Action<SettingsActionType.SET_HIDE_ZERO_BALANCE_TOKENS> {
  hideZeroBalanceTokens: boolean;
}

export interface SetLockTimeAction
  extends Action<SettingsActionType.SET_LOCK_TIME> {
  lockTime: number;
}

export interface SetPrimaryCurrencyAction
  extends Action<SettingsActionType.SET_PRIMARY_CURRENCY> {
  primaryCurrency: string;
}

export interface SetUseBlockieIconAction
  extends Action<SettingsActionType.SET_USE_BLOCKIE_ICON> {
  useBlockieIcon: boolean;
}

export interface ToggleBasicFunctionalityAction
  extends Action<SettingsActionType.TOGGLE_BASIC_FUNCTIONALITY> {
  basicFunctionalityEnabled: boolean;
}

export interface ToggleDeviceNotificationAction
  extends Action<SettingsActionType.TOGGLE_DEVICE_NOTIFICATIONS> {
  deviceNotificationEnabled: boolean;
}

export interface SetTokenSortConfigAction
  extends Action<SettingsActionType.SET_TOKEN_SORT_CONFIG> {
  tokenSortConfig: unknown;
}

export interface SetDeepLinkModalDisabledAction
  extends Action<SettingsActionType.SET_DEEP_LINK_MODAL_DISABLED> {
  deepLinkModalDisabled: boolean;
}

export interface SettingsState {
  searchEngine: string;
  primaryCurrency: string;
  lockTime: number;
  useBlockieIcon: boolean;
  hideZeroBalanceTokens: boolean;
  basicFunctionalityEnabled: boolean;
  deepLinkModalDisabled: boolean;
  showHexData?: boolean;
  showCustomNonce?: boolean;
  showFiatOnTestnets?: boolean;
  deviceNotificationEnabled?: boolean;
  tokenSortConfig?: unknown;
}

export type SettingsAction =
  | SetSearchEngineAction
  | SetShowHexDataAction
  | SetShowCustomNonceAction
  | SetShowFiatOnTestnetsAction
  | SetHideZeroBalanceTokensAction
  | SetLockTimeAction
  | SetPrimaryCurrencyAction
  | SetUseBlockieIconAction
  | ToggleBasicFunctionalityAction
  | ToggleDeviceNotificationAction
  | SetTokenSortConfigAction
  | SetDeepLinkModalDisabledAction;
