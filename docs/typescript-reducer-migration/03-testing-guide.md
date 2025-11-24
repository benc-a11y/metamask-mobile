# TypeScript Reducer Testing Guide

This document describes the testing patterns and infrastructure for TypeScript reducer migration in the MetaMask Mobile codebase.

## Overview

The MetaMask Mobile repository uses Jest for testing. When migrating reducers to TypeScript, tests should be updated to use proper TypeScript typing while maintaining comprehensive coverage.

## Test File Location and Naming

Test files should be co-located with the reducer:

```
app/reducers/[reducerName]/
├── index.ts          # Reducer implementation
├── index.test.ts     # Tests (TypeScript)
└── types.ts          # Optional: State/Action types
```

## Basic Test Structure

### Pattern 1: Simple Reducer Tests

From `app/reducers/onboarding/index.test.ts`:

```typescript
import onboardingReducer from '.';
import {
  CLEAR_EVENTS,
  SAVE_EVENT,
  SET_COMPLETED_ONBOARDING,
} from '../../actions/onboarding';
import { ITrackingEvent } from '../../core/Analytics/MetaMetrics.types';

describe('onboardingReducer', () => {
  const initialState = {
    events: [],
    completedOnboarding: false,
  };

  it('returns the initial state when no action is provided', () => {
    const state = onboardingReducer(undefined, { type: null } as never);
    expect(state).toEqual(initialState);
  });

  it('handles the SAVE_EVENT action', () => {
    const mockEvent = [{ name: 'test_event' }] as [ITrackingEvent];
    const action = { type: SAVE_EVENT, event: mockEvent } as const;
    const state = onboardingReducer(initialState, action);
    expect(state.events).toEqual([mockEvent]);
  });

  it('handles the CLEAR_EVENTS action', () => {
    const stateWithEvents = {
      ...initialState,
      events: [[{ name: 'test_event' }] as [ITrackingEvent]],
    };
    const action = { type: CLEAR_EVENTS } as const;
    const state = onboardingReducer(stateWithEvents, action);
    expect(state.events).toEqual([]);
  });
});
```

### Pattern 2: Tests with Typed Actions and State

From `app/reducers/accounts/index.test.ts`:

```typescript
import { iAccountActions } from 'app/actions/accounts';
import reducer, { iAccountEvent } from '.';

const initialState: Readonly<iAccountEvent> = {
  reloadAccounts: false,
};

const emptyAction: iAccountActions = {
  type: null,
  reloadAccounts: false,
};

describe('accounts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, emptyAction)).toEqual(initialState);
  });

  describe('setReloadAccount', () => {
    it('setReloadAccount should return true when payload contains reloadAccounts: true', () => {
      const state = reducer(undefined, emptyAction);
      const action = {
        type: 'SET_RELOAD_ACCOUNTS',
        reloadAccounts: true,
      };
      expect(reducer(state, action)).toEqual({
        reloadAccounts: true,
      });
    });
  });
});
```

### Pattern 3: Tests with Action Type Enums

From `app/reducers/rpcEvents/index.test.ts`:

```typescript
import { ActionType, iEventAction } from '../../actions/rpcEvents';
import reducer, { RPCStageTypes, iEventGroup, isWhitelistedRPC } from './index';

const emptyAction: iEventAction = {
  type: null,
  rpcName: '',
};

const initialState: Readonly<iEventGroup> = {
  signingEvent: {
    eventStage: RPCStageTypes.IDLE,
    rpcName: '',
  },
};

describe('rpcEvents reducer', () => {
  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, emptyAction)).toEqual(initialState);
    });

    it('should set event stage', () => {
      const state = reducer(undefined, emptyAction);
      const action = {
        type: ActionType.SET_EVENT_STAGE,
        rpcName: 'eth_signTypedData',
        eventStage: RPCStageTypes.REQUEST_SEND,
      };
      expect(reducer(state, action)).toEqual({
        signingEvent: {
          eventStage: RPCStageTypes.REQUEST_SEND,
          rpcName: 'eth_signTypedData',
        },
      });
    });

    it('should return default state if action type is unknown', () => {
      const state = reducer(undefined, emptyAction);
      const action = {
        type: 'UNKNOWN',
        rpcName: 'eth_signTypedData',
      };
      expect(reducer(state, action)).toEqual(state);
    });
  });
});
```

### Pattern 4: Complex Reducer Tests with Type Assertions

From `app/reducers/swaps/swaps.test.ts`:

```typescript
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cloneDeep } from 'lodash';

// Type definitions for the swaps reducer
// Note: The reducer is written in JavaScript without proper TypeScript types,
// so we need to use type assertions in some places

interface SwapsAction {
  type: string | null;
  payload?: object | null;
}

interface SetLivenessPayload {
  chainId: string;
  featureFlags: FeatureFlags | null;
}

interface SetLivenessAction {
  type: typeof SWAPS_SET_LIVENESS;
  payload: SetLivenessPayload;
}

// Define a more flexible type for the swaps state that allows dynamic chain IDs
interface SwapsState {
  isLive: boolean;
  hasOnboarded: boolean;
  featureFlags?: {
    smart_transactions?: unknown;
    smartTransactions?: unknown;
  };
  '0x1': {
    isLive: boolean;
    featureFlags?: unknown;
  };
  [chainId: string]: unknown;
}

import reducer, {
  initialState,
  SWAPS_SET_LIVENESS,
  SWAPS_SET_HAS_ONBOARDED,
} from './index';

const emptyAction: SwapsAction = { type: null };

describe('swaps reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, emptyAction);
    expect(state).toEqual(initialState);
  });

  describe('liveness', () => {
    it('should set isLive to true for iOS when flag is true', () => {
      const initialState = reducer(undefined, emptyAction);
      const action: SetLivenessAction = {
        type: SWAPS_SET_LIVENESS,
        payload: {
          featureFlags: DEFAULT_FEATURE_FLAGS,
          chainId: '0x1',
        },
      };
      // Note: Using 'as any' because the reducer is JavaScript without proper types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const liveState = reducer(initialState as any, action) as SwapsState;
      expect(liveState['0x1'].isLive).toBe(true);
    });
  });
});
```

## Key Testing Patterns

### 1. Empty/Null Action Pattern

Always test that the reducer returns the initial state when given an undefined state and a null/empty action:

```typescript
const emptyAction: ActionType = { type: null } as never;
// or
const emptyAction: ActionType = { type: null, ...defaultProps };

it('returns the initial state when no action is provided', () => {
  expect(reducer(undefined, emptyAction)).toEqual(initialState);
});
```

### 2. Action Type Constants

Use action type constants or enums instead of string literals:

```typescript
// Good
import { ActionType } from '../../actions/myReducer';
const action = { type: ActionType.SET_VALUE, value: 'test' };

// Avoid
const action = { type: 'SET_VALUE', value: 'test' };
```

### 3. Type Assertions with `as const`

Use `as const` for action objects to get proper type inference:

```typescript
const action = { type: SAVE_EVENT, event: mockEvent } as const;
```

### 4. Handling JavaScript Reducers in TypeScript Tests

When testing JavaScript reducers that don't have proper types, use type assertions:

```typescript
// Define interfaces for the test
interface MyState {
  value: string;
}

// Use type assertion when calling reducer
const newState = reducer(state as any, action) as MyState;
```

### 5. Testing State Immutability

Ensure the reducer doesn't mutate the original state:

```typescript
it('should not mutate the original state', () => {
  const originalState = { ...initialState };
  const frozenState = Object.freeze(originalState);

  const action = { type: ActionType.SET_VALUE, value: 'new' };
  const newState = reducer(frozenState, action);

  expect(newState).not.toBe(frozenState);
  expect(newState.value).toBe('new');
});
```

### 6. Testing Default Case

Always test that unknown actions return the current state:

```typescript
it('should return current state for unknown action', () => {
  const state = { ...initialState, value: 'existing' };
  const action = { type: 'UNKNOWN_ACTION' };

  expect(reducer(state, action)).toEqual(state);
});
```

## Testing Selectors

### Basic Selector Tests

```typescript
import { selectUserLoggedIn } from './selectors';

describe('user selectors', () => {
  it('selectUserLoggedIn returns userLoggedIn state', () => {
    const mockState = {
      user: {
        userLoggedIn: true,
        // ... other properties
      },
      // ... other reducers
    } as RootState;

    expect(selectUserLoggedIn(mockState)).toBe(true);
  });
});
```

### Testing Memoized Selectors (reselect)

```typescript
import { createSelector } from 'reselect';

describe('memoized selectors', () => {
  it('should return cached result for same input', () => {
    const selector = createSelector(
      (state: RootState) => state.user,
      (user) => user.userLoggedIn,
    );

    const state = { user: { userLoggedIn: true } } as RootState;

    const result1 = selector(state);
    const result2 = selector(state);

    expect(result1).toBe(result2);
  });
});
```

## Mocking Dependencies

### Mocking External Modules

```typescript
jest.mock('../../selectors/tokensController');
jest.mock('../../components/UI/Swaps/utils', () => ({
  allowedTestnetChainIds: ['0xaa36a7'],
}));
```

### Mocking Device-Specific Behavior

```typescript
import Device from '../../util/device';

describe('device-specific tests', () => {
  it('should handle iOS behavior', () => {
    Device.isIos = jest.fn().mockReturnValue(true);
    Device.isAndroid = jest.fn().mockReturnValue(false);

    // Test iOS-specific behavior
  });
});
```

### Mocking Global Variables

```typescript
const withGlobalDev = (devValue: boolean, testFn: () => void) => {
  const originalDev = (global as { __DEV__?: boolean }).__DEV__;
  (global as { __DEV__?: boolean }).__DEV__ = devValue;
  try {
    testFn();
  } finally {
    (global as { __DEV__?: boolean }).__DEV__ = originalDev;
  }
};

it('should handle dev mode', () => {
  withGlobalDev(true, () => {
    // Test dev-specific behavior
  });
});
```

## Test Coverage Requirements

When migrating a reducer to TypeScript, ensure tests cover:

1. **Initial State**: Reducer returns correct initial state
2. **All Action Types**: Each action type is tested
3. **Default Case**: Unknown actions return current state
4. **Edge Cases**: Null/undefined values, empty arrays, etc.
5. **State Immutability**: Original state is not mutated
6. **Selectors**: All exported selectors are tested

## Running Tests

```bash
# Run all tests
yarn test

# Run tests for a specific reducer
yarn test app/reducers/user

# Run tests with coverage
yarn test --coverage app/reducers/user

# Run tests in watch mode
yarn test --watch app/reducers/user
```

## Test File Template

Use this template when creating tests for a newly migrated reducer:

```typescript
import reducer, { initialState, MyState } from '.';
import { ActionType, MyAction } from '../../actions/myReducer';

const emptyAction: MyAction = {
  type: null,
} as never;

describe('myReducer', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, emptyAction)).toEqual(initialState);
    });
  });

  describe('ACTION_TYPE_ONE', () => {
    it('should handle ACTION_TYPE_ONE', () => {
      const action: MyAction = {
        type: ActionType.ACTION_TYPE_ONE,
        payload: 'value',
      };

      const expectedState: MyState = {
        ...initialState,
        property: 'value',
      };

      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('ACTION_TYPE_TWO', () => {
    it('should handle ACTION_TYPE_TWO', () => {
      const previousState: MyState = {
        ...initialState,
        property: 'old value',
      };

      const action: MyAction = {
        type: ActionType.ACTION_TYPE_TWO,
        payload: 'new value',
      };

      const expectedState: MyState = {
        ...previousState,
        property: 'new value',
      };

      expect(reducer(previousState, action)).toEqual(expectedState);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const state: MyState = {
        ...initialState,
        property: 'value',
      };

      const action = { type: 'UNKNOWN' } as never;

      expect(reducer(state, action)).toEqual(state);
    });
  });
});
```

## Common Testing Issues and Solutions

### Issue 1: Type Errors with Action Types

**Problem**: TypeScript complains about action type not matching

**Solution**: Use type assertion or `as const`:

```typescript
// Option 1: as const
const action = { type: ACTION_TYPE, value: 'test' } as const;

// Option 2: Type assertion
const action = { type: ACTION_TYPE, value: 'test' } as MyAction;

// Option 3: Explicit typing
const action: MyAction = { type: ACTION_TYPE, value: 'test' };
```

### Issue 2: Testing Reducers with `any` in RootState

**Problem**: Reducer state is typed as `any` in RootState

**Solution**: Create local type definitions in test file:

```typescript
interface TestState {
  property: string;
}

const state = reducer(undefined, emptyAction) as TestState;
```

### Issue 3: Mocking Complex State

**Problem**: Need to create mock RootState for selector tests

**Solution**: Create partial mock with type assertion:

```typescript
const mockState = {
  user: {
    userLoggedIn: true,
  },
  // Only include what's needed for the test
} as unknown as RootState;
```

### Issue 4: Testing Async Actions

**Problem**: Action creators return thunks

**Solution**: Test the thunk separately from the reducer:

```typescript
// Test reducer with the action that the thunk dispatches
const action = { type: ActionType.SUCCESS, data: mockData };
expect(reducer(initialState, action)).toEqual(expectedState);

// Test thunk separately with redux-mock-store if needed
```

## ESLint Rules for Tests

The codebase has specific ESLint rules for test files:

```javascript
// .eslintrc.js
{
  files: ['**/*.test.{js,ts,tsx}'],
  rules: {
    '@metamask/design-tokens/color-no-hex': 'off',
  },
}
```

When using `any` in tests (which should be avoided when possible), use the eslint-disable comment:

```typescript
// TODO: Replace "any" with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const action: any = { type: ActionType.SET_VALUE, value: 'test' };
```

## Summary

Key points for testing TypeScript reducers:

1. Co-locate test files with reducer files
2. Use TypeScript for test files (`.test.ts`)
3. Import and use proper types for actions and state
4. Test initial state, all actions, and default case
5. Use `as const` or explicit typing for action objects
6. Mock external dependencies appropriately
7. Ensure state immutability in tests
8. Follow the test template for consistency
