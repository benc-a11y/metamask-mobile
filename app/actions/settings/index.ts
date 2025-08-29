import {
  SettingsActionType,
  SetSearchEngineAction,
  SetShowHexDataAction,
  SetShowCustomNonceAction,
  SetShowFiatOnTestnetsAction,
  SetHideZeroBalanceTokensAction,
  SetLockTimeAction,
  SetPrimaryCurrencyAction,
  SetUseBlockieIconAction,
  ToggleBasicFunctionalityAction,
  ToggleDeviceNotificationAction,
  SetTokenSortConfigAction,
  SetDeepLinkModalDisabledAction,
} from './types';

export function setSearchEngine(searchEngine: string): SetSearchEngineAction {
  return {
    type: SettingsActionType.SET_SEARCH_ENGINE,
    searchEngine,
  };
}

export function setShowHexData(showHexData: boolean): SetShowHexDataAction {
  return {
    type: SettingsActionType.SET_SHOW_HEX_DATA,
    showHexData,
  };
}

export function setShowCustomNonce(
  showCustomNonce: boolean,
): SetShowCustomNonceAction {
  return {
    type: SettingsActionType.SET_SHOW_CUSTOM_NONCE,
    showCustomNonce,
  };
}

export function setShowFiatOnTestnets(
  showFiatOnTestnets: boolean,
): SetShowFiatOnTestnetsAction {
  return {
    type: SettingsActionType.SET_SHOW_FIAT_ON_TESTNETS,
    showFiatOnTestnets,
  };
}

export function setHideZeroBalanceTokens(
  hideZeroBalanceTokens: boolean,
): SetHideZeroBalanceTokensAction {
  return {
    type: SettingsActionType.SET_HIDE_ZERO_BALANCE_TOKENS,
    hideZeroBalanceTokens,
  };
}

export function setLockTime(lockTime: number): SetLockTimeAction {
  return {
    type: SettingsActionType.SET_LOCK_TIME,
    lockTime,
  };
}

export function setPrimaryCurrency(
  primaryCurrency: string,
): SetPrimaryCurrencyAction {
  return {
    type: SettingsActionType.SET_PRIMARY_CURRENCY,
    primaryCurrency,
  };
}

export function setUseBlockieIcon(
  useBlockieIcon: boolean,
): SetUseBlockieIconAction {
  return {
    type: SettingsActionType.SET_USE_BLOCKIE_ICON,
    useBlockieIcon,
  };
}

export function toggleBasicFunctionality(
  basicFunctionalityEnabled: boolean,
): ToggleBasicFunctionalityAction {
  return {
    type: SettingsActionType.TOGGLE_BASIC_FUNCTIONALITY,
    basicFunctionalityEnabled,
  };
}

export function toggleDeviceNotification(
  deviceNotificationEnabled: boolean,
): ToggleDeviceNotificationAction {
  return {
    type: SettingsActionType.TOGGLE_DEVICE_NOTIFICATIONS,
    deviceNotificationEnabled,
  };
}

export function setTokenSortConfig(
  tokenSortConfig: unknown,
): SetTokenSortConfigAction {
  return {
    type: SettingsActionType.SET_TOKEN_SORT_CONFIG,
    tokenSortConfig,
  };
}

export function setDeepLinkModalDisabled(
  deepLinkModalDisabled: boolean,
): SetDeepLinkModalDisabledAction {
  return {
    type: SettingsActionType.SET_DEEP_LINK_MODAL_DISABLED,
    deepLinkModalDisabled,
  };
}
