/* eslint-disable @typescript-eslint/default-param-last */

import { ActionType } from '../../actions/experimental';

export interface ExperimentalSettingsState {
  securityAlertsEnabled: boolean;
}

export const initialState: ExperimentalSettingsState = {
  securityAlertsEnabled: true,
};

const experimentalSettingsReducer = (
  state: ExperimentalSettingsState = initialState,
  action: {
    securityAlertsEnabled: boolean;
    type: string;
  },
): ExperimentalSettingsState => {
  switch (action.type) {
    case ActionType.SET_SECURITY_ALERTS_ENABLED:
      return {
        ...state,
        securityAlertsEnabled: action.securityAlertsEnabled,
      };
    default:
      return state;
  }
};

export default experimentalSettingsReducer;
