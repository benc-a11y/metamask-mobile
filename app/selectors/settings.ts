import { RootState } from '../reducers';
import { SettingsState } from '../reducers/settings';
import { createSelector } from 'reselect';
import { createDeepEqualSelector } from './util';

const selectSettings = (state: RootState) => state.settings;

export const selectShowFiatInTestnets = createSelector(
  selectSettings,
  (settingsState: SettingsState) => settingsState.showFiatOnTestnets as boolean,
);

export const selectPrimaryCurrency = createSelector(
  selectSettings,
  (settingsState: SettingsState) => settingsState.primaryCurrency,
);
export const selectShowCustomNonce = createSelector(
  selectSettings,
  (settingsState: SettingsState) => settingsState.showCustomNonce,
);

export const selectBasicFunctionalityEnabled = createSelector(
  selectSettings,
  (settingsState: SettingsState) =>
    settingsState.basicFunctionalityEnabled as boolean,
);

export const selectHideZeroBalanceTokens = createSelector(
  selectSettings,
  (settingsState: SettingsState) =>
    Boolean(settingsState.hideZeroBalanceTokens),
);

export const selectDeepLinkModalDisabled = createSelector(
  selectSettings,
  (settingsState: SettingsState) =>
    Boolean(settingsState.deepLinkModalDisabled),
);

export const selectUseBlockieIcon = createDeepEqualSelector(
  selectSettings,
  (settingsState: SettingsState) => Boolean(settingsState.useBlockieIcon),
);
