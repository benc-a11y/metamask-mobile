# TypeScript Reducer Pattern Analysis

This document describes the TypeScript patterns used in successfully migrated reducers (`userReducer`, `onboardingReducer`, `securityReducer`) in the MetaMask Mobile codebase.

## Overview

The MetaMask Mobile repository follows a consistent pattern for TypeScript reducers. This analysis is based on examining the three successfully migrated reducers and their associated action types.

## Pattern 1: State Interface Definition

State interfaces are defined to describe the shape of the reducer's state. There are two approaches used in the codebase:

### Approach A: Separate Types File (Recommended for Complex Reducers)

Used by `userReducer` - state interface is defined in a separate `types.ts` file:

```typescript
// app/reducers/user/types.ts
import { AppThemeKey } from '../../util/theme/models';

export interface UserState {
  loadingMsg: string;
  loadingSet: boolean;
  passwordSet: boolean;
  seedphraseBackedUp: boolean;
  backUpSeedphraseVisible: boolean;
  protectWalletModalVisible: boolean;
  gasEducationCarouselSeen: boolean;
  userLoggedIn: boolean;
  isAuthChecked: boolean;
  initialScreen: string;
  appTheme: AppThemeKey;
  ambiguousAddressEntries: Record<string, string[]>;
  appServicesReady: boolean;
  existingUser: boolean;
  isConnectionRemoved: boolean;
}
```

### Approach B: Inline State Interface (Suitable for Simple Reducers)

Used by `onboardingReducer` and `securityReducer` - state interface is defined in the same file as the reducer:

```typescript
// app/reducers/onboarding/index.ts
export interface OnboardingState {
  events: [ITrackingEvent][];
  completedOnboarding: boolean;
}

// app/reducers/security/index.ts
export interface SecurityState {
  allowLoginWithRememberMe: boolean;
  dataCollectionForMarketing: boolean | null;
  isNFTAutoDetectionModalViewed: boolean;
}
```

### Key Observations

- State interfaces are always exported for use in selectors and the RootState
- Use specific types rather than `any` - e.g., `Record<string, string[]>` instead of `any`
- Nullable types are explicitly marked with `| null` when needed
- Import external types (like `AppThemeKey`) rather than using string literals

## Pattern 2: Action Type Structure

Actions are defined using TypeScript enums and discriminated unions. There are two patterns observed:

### Approach A: Comprehensive Action Types (Recommended)

Used by `userReducer` - action types are defined in a separate `actions/user/types.ts` file:

```typescript
// app/actions/user/types.ts
import { type AppThemeKey } from '../../util/theme/models';
import { type Action } from 'redux';

// Action type enum
export enum UserActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOADING_SET = 'LOADING_SET',
  LOADING_UNSET = 'LOADING_UNSET',
  PASSWORD_SET = 'PASSWORD_SET',
  // ... more action types
}

// Individual action interfaces
export type LoginAction = Action<UserActionType.LOGIN>;

export type LoadingSetAction = Action<UserActionType.LOADING_SET> & {
  loadingMsg: string;
};

export type SetAppThemeAction = Action<UserActionType.SET_APP_THEME> & {
  payload: { theme: AppThemeKey };
};

// Union type of all actions
export type UserAction =
  | LoginAction
  | LogoutAction
  | LoadingSetAction
  | LoadingUnsetAction;
// ... more action types
```

### Approach B: Inline Action Types (Suitable for Simple Reducers)

Used by `onboardingReducer` - action types defined in the actions file:

```typescript
// app/actions/onboarding/index.ts
export const SAVE_EVENT = 'SAVE_EVENT';
export const CLEAR_EVENTS = 'CLEAR_EVENTS';
export const SET_COMPLETED_ONBOARDING = 'SET_COMPLETED_ONBOARDING';

interface SaveEventAction {
  type: typeof SAVE_EVENT;
  event: [ITrackingEvent];
}

interface ClearEventsAction {
  type: typeof CLEAR_EVENTS;
}

export type OnboardingActionTypes =
  | SaveEventAction
  | ClearEventsAction
  | SetCompletedOnboardingAction;
```

### Approach C: Enum-based Action Types

Used by `securityReducer`:

```typescript
// app/actions/security/index.ts
import type { Action as ReduxAction } from 'redux';

export enum ActionType {
  SET_ALLOW_LOGIN_WITH_REMEMBER_ME = 'SET_ALLOW_LOGIN_WITH_REMEMBER_ME',
  SET_DATA_COLLECTION_FOR_MARKETING = 'SET_DATA_COLLECTION_FOR_MARKETING',
  SET_NFT_AUTO_DETECTION_MODAL_OPEN = 'SET_NFT_AUTO_DETECTION_MODAL_OPEN',
}

export interface AllowLoginWithRememberMeUpdated
  extends ReduxAction<ActionType.SET_ALLOW_LOGIN_WITH_REMEMBER_ME> {
  enabled: boolean;
}

export type Action =
  | AllowLoginWithRememberMeUpdated
  | SetDataCollectionForMarketing
  | SetNftAutoDetectionModalOpen;
```

## Pattern 3: Reducer Function Typing

The reducer function should be typed with explicit parameter and return types:

```typescript
// app/reducers/user/index.ts
/* eslint-disable @typescript-eslint/default-param-last */
const userReducer = (
  state: UserState = userInitialState,
  action: UserAction,
): UserState => {
  switch (action.type) {
    case UserActionType.LOGIN:
      return {
        ...state,
        userLoggedIn: true,
      };
    // ... more cases
    default:
      return state;
  }
};
```

### Key Observations

- The `/* eslint-disable @typescript-eslint/default-param-last */` comment is required because Redux reducers have the state parameter with a default value before the action parameter
- State parameter is typed with the state interface and has a default value of the initial state
- Action parameter is typed with the union type of all possible actions
- Return type is explicitly the state interface
- The switch statement uses the action type enum values for type safety

## Pattern 4: Initial State Definition

Initial state is defined as a typed constant:

```typescript
// app/reducers/user/index.ts
export const userInitialState: UserState = {
  loadingMsg: '',
  loadingSet: false,
  passwordSet: false,
  seedphraseBackedUp: false,
  backUpSeedphraseVisible: false,
  protectWalletModalVisible: false,
  gasEducationCarouselSeen: false,
  userLoggedIn: false,
  isAuthChecked: false,
  initialScreen: '',
  appTheme: AppThemeKey.os,
  ambiguousAddressEntries: {},
  appServicesReady: false,
  existingUser: false,
  isConnectionRemoved: false,
};
```

For immutable initial state (recommended):

```typescript
// app/reducers/security/index.ts
export const initialState: Readonly<SecuritySettingsState> = {
  allowLoginWithRememberMe: false,
  dataCollectionForMarketing: null,
  isNFTAutoDetectionModalViewed: false,
};
```

## Pattern 5: Exporting State Types for Selectors

State types are exported for use in selectors and the RootState interface:

```typescript
// app/reducers/user/index.ts
import { UserAction, UserActionType } from '../../actions/user/types';
import { AppThemeKey } from '../../util/theme/models';
import { UserState } from './types';

export * from './types';
export * from './selectors';
```

This allows the RootState to reference the state type:

```typescript
// app/reducers/index.ts
import userReducer, { UserState } from './user';

export interface RootState {
  user: UserState;
  // ... other reducers
}
```

## Pattern 6: Selector Typing

Selectors are typed using the RootState:

```typescript
// app/reducers/user/selectors.ts
import { RootState } from '..';

export const selectUserState = (state: RootState) => state.user;

export const selectAppServicesReady = (state: RootState) =>
  state.user.appServicesReady;

export const selectUserLoggedIn = (state: RootState) => state.user.userLoggedIn;
```

## Pattern 7: Action Creator Typing

Action creators return typed actions:

```typescript
// app/actions/onboarding/index.ts
export function saveOnboardingEvent(
  eventArgs: [ITrackingEvent],
): SaveEventAction {
  return {
    type: SAVE_EVENT,
    event: eventArgs,
  };
}

export function clearOnboardingEvents(): ClearEventsAction {
  return {
    type: CLEAR_EVENTS,
  };
}
```

## File Organization Patterns

### Simple Reducer (Single File)

For reducers with few action types and simple state:

```
app/reducers/onboarding/
├── index.ts          # Contains state interface, initial state, and reducer
└── index.test.ts     # Tests
```

### Complex Reducer (Multiple Files)

For reducers with many action types or complex state:

```
app/reducers/user/
├── index.ts          # Reducer function, re-exports types and selectors
├── types.ts          # State interface
├── selectors.ts      # Typed selectors
└── index.test.ts     # Tests (if exists)

app/actions/user/
├── index.ts          # Action creators
└── types.ts          # Action type enum and action interfaces
```

## Common Patterns to Avoid

1. **Using `any` type** - The codebase enforces `@typescript-eslint/no-explicit-any` as an error
2. **String literal action types** - Use enums or `typeof` constants instead
3. **Untyped action payloads** - Always define interfaces for action payloads
4. **Missing return types** - Explicitly type the reducer return type
5. **Mutable initial state** - Use `Readonly<T>` for initial state when appropriate

## Integration with RootState

After migrating a reducer, update the RootState interface in `app/reducers/index.ts`:

```typescript
// Before (typed as any)
export interface RootState {
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legalNotices: any;
}

// After (properly typed)
import legalNoticesReducer, { LegalNoticesState } from './legalNotices';

export interface RootState {
  legalNotices: LegalNoticesState;
}
```

## Summary

The key patterns for TypeScript reducer migration are:

1. Define a state interface (exported for RootState)
2. Define action type enum and individual action interfaces
3. Create a union type of all actions
4. Type the reducer function with state and action parameters
5. Type the initial state constant
6. Create typed selectors using RootState
7. Update RootState to use the new state type instead of `any`
