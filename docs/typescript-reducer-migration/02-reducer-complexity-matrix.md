# Reducer Complexity Matrix

This document categorizes the 17 reducers currently typed as `any` in `app/reducers/index.ts` into complexity tiers to help prioritize the TypeScript migration effort.

## Complexity Criteria

Reducers are categorized based on:

1. **State Structure Complexity**: Simple primitives vs. nested objects/arrays
2. **Number of Action Types**: Few (1-3), moderate (4-7), many (8+)
3. **File Size**: Lines of code in the reducer file
4. **Dependencies**: External imports and dependencies on other parts of the codebase
5. **Existing TypeScript**: Whether the file is already `.ts` but needs proper typing
6. **Selectors**: Presence of complex selectors that need typing

## Tier Summary

| Tier              | Count | Reducers                                                                                             |
| ----------------- | ----- | ---------------------------------------------------------------------------------------------------- |
| Low Complexity    | 7     | legalNotices, bookmarks, alert, infuraAvailability, signatureRequest, experimentalSettings, accounts |
| Medium Complexity | 6     | privacy, modals, settings, notification, networkOnboarded, rpcEvents                                 |
| High Complexity   | 4     | collectibles, browser, transaction, swaps                                                            |

---

## Low Complexity Tier

These reducers have simple state structures, few action types, and minimal dependencies. They are ideal candidates for starting the migration.

### 1. legalNotices

**File**: `app/reducers/legalNotices/index.ts` (80 lines)
**Current Status**: Already TypeScript, but state type not exported to RootState

| Criteria        | Assessment                                   |
| --------------- | -------------------------------------------- |
| State Structure | Simple - 2 properties (boolean, number/null) |
| Action Types    | 2 actions                                    |
| Dependencies    | Minimal - only RootState import              |
| Selectors       | 1 selector                                   |

**State Shape**:

```typescript
{
  newPrivacyPolicyToastClickedOrClosed: boolean;
  newPrivacyPolicyToastShownDate: number | null;
}
```

**Migration Notes**:

- Already has `LegalNoticesAction` interface defined
- Has `types.ts` file with action type constants
- Needs state interface export and RootState update
- Estimated effort: 1-2 hours

---

### 2. bookmarks

**File**: `app/reducers/bookmarks/index.js` (12 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                                |
| --------------- | ----------------------------------------- |
| State Structure | Very simple - array of bookmark objects   |
| Action Types    | 2 actions (ADD_BOOKMARK, REMOVE_BOOKMARK) |
| Dependencies    | None                                      |
| Selectors       | None                                      |

**State Shape**:

```typescript
Array<{ url: string; name: string }>;
```

**Migration Notes**:

- Simplest reducer in the codebase
- State is just an array, not an object
- No selectors to migrate
- Estimated effort: 30 minutes - 1 hour

---

### 3. alert

**File**: `app/reducers/alert/index.js` (29 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                         |
| --------------- | ---------------------------------- |
| State Structure | Simple - 4 properties              |
| Action Types    | 2 actions (SHOW_ALERT, HIDE_ALERT) |
| Dependencies    | None                               |
| Selectors       | None                               |

**State Shape**:

```typescript
{
  isVisible: boolean;
  autodismiss: number | null;
  content: string | null;
  data: unknown | null;
}
```

**Migration Notes**:

- Very straightforward migration
- May need to determine proper type for `data` property
- Estimated effort: 30 minutes - 1 hour

---

### 4. infuraAvailability

**File**: `app/reducers/infuraAvailability/index.js` (29 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                       |
| --------------- | -------------------------------- |
| State Structure | Very simple - 1 boolean property |
| Action Types    | 2 actions                        |
| Dependencies    | None                             |
| Selectors       | 1 simple selector                |

**State Shape**:

```typescript
{
  isBlocked: boolean;
}
```

**Migration Notes**:

- One of the simplest reducers
- Already exports action type constants
- Estimated effort: 30 minutes - 1 hour

---

### 5. signatureRequest

**File**: `app/reducers/signatureRequest/index.ts` (30 lines)
**Current Status**: Already TypeScript with local interfaces

| Criteria        | Assessment                        |
| --------------- | --------------------------------- |
| State Structure | Simple - 1 optional property      |
| Action Types    | 1 action                          |
| Dependencies    | SecurityAlertResponse type import |
| Selectors       | None                              |

**State Shape**:

```typescript
{
  securityAlertResponse?: SecurityAlertResponse;
}
```

**Migration Notes**:

- Already has `StateType` and `ActionType` interfaces defined locally
- Just needs to export state type and update RootState
- Estimated effort: 30 minutes

---

### 6. experimentalSettings

**File**: `app/reducers/experimentalSettings/index.ts` (31 lines)
**Current Status**: TypeScript but noted as "not yet a valid reducer"

| Criteria        | Assessment                                |
| --------------- | ----------------------------------------- |
| State Structure | Simple - 1 boolean property               |
| Action Types    | 1 action                                  |
| Dependencies    | Actions from `../../actions/experimental` |
| Selectors       | None                                      |

**State Shape**:

```typescript
{
  securityAlertsEnabled: boolean;
}
```

**Migration Notes**:

- Already TypeScript but action type is inline object type
- Needs proper action union type
- Needs state interface export
- Estimated effort: 1 hour

---

### 7. accounts

**File**: `app/reducers/accounts/index.ts` (41 lines)
**Current Status**: Already TypeScript with exported interfaces

| Criteria        | Assessment                            |
| --------------- | ------------------------------------- |
| State Structure | Simple - 1 boolean property           |
| Action Types    | 1 action                              |
| Dependencies    | Actions from `../../actions/accounts` |
| Selectors       | None                                  |

**State Shape**:

```typescript
{
  reloadAccounts: boolean;
}
```

**Migration Notes**:

- Already has `iAccountEvent` interface exported
- Already has proper action types in actions file
- Just needs RootState update
- Has existing tests
- Estimated effort: 30 minutes

---

## Medium Complexity Tier

These reducers have moderate state structures and multiple action types. They require more careful planning but are still manageable.

### 8. privacy

**File**: `app/reducers/privacy/index.js` (39 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                              |
| --------------- | --------------------------------------- |
| State Structure | Moderate - object with nested structure |
| Action Types    | 4 actions                               |
| Dependencies    | None                                    |
| Selectors       | None                                    |

**State Shape**:

```typescript
{
  approvedHosts: Record<string, boolean>;
  revealSRPTimestamps: number[];
}
```

**Migration Notes**:

- Uses string literal action types (need to convert to enum/constants)
- `approvedHosts` is a dynamic object
- Estimated effort: 1-2 hours

---

### 9. modals

**File**: `app/reducers/modals/index.js` (63 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                       |
| --------------- | -------------------------------- |
| State Structure | Moderate - 5+ boolean properties |
| Action Types    | 5 actions                        |
| Dependencies    | None                             |
| Selectors       | None                             |

**State Shape**:

```typescript
{
  networkModalVisible: boolean;
  shouldNetworkSwitchPopToWallet: boolean;
  collectibleContractModalVisible: boolean;
  dappTransactionModalVisible: boolean;
  signMessageModalVisible: boolean;
  infoNetworkModalVisible?: boolean;
}
```

**Migration Notes**:

- Uses string literal action types
- Some actions have conditional logic based on `action.show`
- `infoNetworkModalVisible` is not in initial state but set by action
- Estimated effort: 1-2 hours

---

### 10. settings

**File**: `app/reducers/settings/index.js` (75 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                                |
| --------------- | ----------------------------------------- |
| State Structure | Moderate - 7+ properties of various types |
| Action Types    | 11 actions                                |
| Dependencies    | AppConstants import                       |
| Selectors       | None                                      |

**State Shape**:

```typescript
{
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
}
```

**Migration Notes**:

- Many action types to define
- Some properties are set by actions but not in initial state
- Uses string literal action types
- Estimated effort: 2-3 hours

---

### 11. notification

**File**: `app/reducers/notification/index.js` (204 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                               |
| --------------- | ---------------------------------------- |
| State Structure | Moderate - array of notification objects |
| Action Types    | 11 actions                               |
| Dependencies    | NotificationTypes, createSelector        |
| Selectors       | 1 selector using createSelector          |

**State Shape**:

```typescript
{
  notifications: Array<{
    id: string;
    isVisible: boolean;
    autodismiss: number;
    type: 'TRANSACTION' | 'SIMPLE';
    // ... other properties depending on type
  }>;
}
```

**Migration Notes**:

- Complex notification object structure
- Already exports ACTIONS object with action type constants
- Has helper functions (enqueue, dequeue)
- Selector uses JSDoc for type hints
- Estimated effort: 3-4 hours

---

### 12. networkOnboarded

**File**: `app/reducers/networkSelector/index.ts` (92 lines)
**Current Status**: TypeScript but noted as "not yet a valid reducer"

| Criteria        | Assessment                  |
| --------------- | --------------------------- |
| State Structure | Moderate - nested objects   |
| Action Types    | 4 actions                   |
| Dependencies    | Action import from sendFlow |
| Selectors       | None                        |

**State Shape**:

```typescript
{
  networkOnboardedState: Record<string, boolean>;
  networkState: {
    showNetworkOnboarding: boolean;
    nativeToken: string;
    networkType: string;
    networkUrl: string;
  }
  switchedNetwork: {
    networkUrl: string;
    networkStatus: boolean;
  }
  sendFlowChainId: string | null;
}
```

**Migration Notes**:

- Already TypeScript but action type is inline object type with `any`
- Uses string literal action types
- Needs proper action union type
- Has existing tests
- Estimated effort: 2-3 hours

---

### 13. rpcEvents

**File**: `app/reducers/rpcEvents/index.ts` (129 lines)
**Current Status**: Already TypeScript with exported interfaces

| Criteria        | Assessment                             |
| --------------- | -------------------------------------- |
| State Structure | Moderate - event group objects         |
| Action Types    | 3 actions                              |
| Dependencies    | Actions from `../../actions/rpcEvents` |
| Selectors       | None                                   |

**State Shape**:

```typescript
{
  signingEvent: {
    eventStage: string;
    rpcName: string;
    error?: Error;
  };
}
```

**Migration Notes**:

- Already has `iEventGroup` and `iEventStage` interfaces
- Already has proper action types
- Just needs RootState update
- Has existing tests
- Estimated effort: 30 minutes - 1 hour

---

## High Complexity Tier

These reducers have complex state structures, many action types, and significant dependencies. They require careful planning and thorough testing.

### 14. collectibles

**File**: `app/reducers/collectibles/index.js` (240 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                              |
| --------------- | --------------------------------------- |
| State Structure | Complex - nested by address and chainId |
| Action Types    | 4 actions                               |
| Dependencies    | Many - reselect, selectors, utils       |
| Selectors       | 10+ selectors using createSelector      |

**State Shape**:

```typescript
{
  favorites: Record<
    string,
    Record<
      string,
      Array<{
        tokenId: string;
        address: string;
      }>
    >
  >;
  isNftFetchingProgress: boolean;
}
```

**Migration Notes**:

- Heavy use of reselect with createSelector and createDeepEqualSelector
- Complex nested state structure (address -> chainId -> collectibles)
- Many selectors that need typing
- Selectors depend on other selectors from different files
- Estimated effort: 4-6 hours

---

### 15. browser

**File**: `app/reducers/browser/index.js` (105 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                              |
| --------------- | --------------------------------------- |
| State Structure | Complex - multiple arrays and objects   |
| Action Types    | 10 actions                              |
| Dependencies    | BrowserActionTypes, AppConstants, utils |
| Selectors       | Separate selectors.ts file exists       |

**State Shape**:

```typescript
{
  history: Array<{ url: string; name: string }>;
  whitelist: string[];
  tabs: Array<{
    url: string;
    id: string;
    linkType?: string;
    // ... other tab properties
  }>;
  favicons: Array<{ origin: string; url: string }>;
  activeTab: string | null;
  visitedDappsByHostname: Record<string, boolean>;
}
```

**Migration Notes**:

- Multiple array types with different structures
- Already has BrowserActionTypes enum in actions
- Has separate selectors.ts file (already TypeScript)
- Has existing test file (JavaScript)
- Estimated effort: 3-4 hours

---

### 16. transaction

**File**: `app/reducers/transaction/index.js` (171 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                          |
| --------------- | ----------------------------------- |
| State Structure | Complex - nested transaction object |
| Action Types    | 14 actions                          |
| Dependencies    | redux-persist, transaction helpers  |
| Selectors       | 1 selector                          |

**State Shape**:

```typescript
{
  ensRecipient: string | undefined;
  assetType: 'ETH' | 'ERC20' | 'ERC721' | undefined;
  selectedAsset: {
    tokenId?: string;
    isETH?: boolean;
    symbol?: string;
    // ... other asset properties
  };
  transaction: {
    data: string | undefined;
    from: string | undefined;
    gas: string | undefined;
    gasPrice: string | undefined;
    to: string | undefined;
    value: string | undefined;
    maxFeePerGas: string | undefined;
    maxPriorityFeePerGas: string | undefined;
  };
  warningGasPriceHigh: string | undefined;
  transactionTo: string | undefined;
  transactionToName: string | undefined;
  transactionFromName: string | undefined;
  transactionValue: string | undefined;
  symbol: string | undefined;
  paymentRequest: unknown | undefined;
  readableValue: string | undefined;
  id: string | undefined;
  type: string | undefined;
  proposedNonce: string | undefined;
  nonce: string | undefined;
  securityAlertResponses: Record<string, unknown>;
  useMax: boolean;
  maxValueMode?: boolean;
}
```

**Migration Notes**:

- Many properties with undefined as valid value
- Uses REHYDRATE from redux-persist
- Has helper functions (getAssetType, getTxData, getTxMeta)
- Complex transaction object structure
- Estimated effort: 4-6 hours

---

### 17. swaps

**File**: `app/reducers/swaps/index.js` (449 lines)
**Current Status**: JavaScript

| Criteria        | Assessment                                     |
| --------------- | ---------------------------------------------- |
| State Structure | Very complex - dynamic chain-based state       |
| Action Types    | 2 actions (but complex logic)                  |
| Dependencies    | Many - reselect, controllers, utils, constants |
| Selectors       | 15+ selectors                                  |

**State Shape**:

```typescript
{
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
  [chainId: string]: {
    isLive: boolean;
    featureFlags?: unknown;
  };
}
```

**Migration Notes**:

- Most complex reducer in the codebase
- Dynamic state keys based on chain IDs
- Heavy use of reselect with many selectors
- Already has TypeScript test file with type definitions
- Complex feature flag handling
- Depends on SwapsController state
- Estimated effort: 6-8 hours

---

## Recommended Migration Order

Based on complexity and dependencies, here is the recommended order for migration:

### Phase 1: Quick Wins (Low Complexity)

1. **accounts** - Already TypeScript, just needs RootState update
2. **signatureRequest** - Already TypeScript, minimal changes
3. **rpcEvents** - Already TypeScript, just needs RootState update
4. **legalNotices** - Already TypeScript, needs state export
5. **bookmarks** - Simplest JavaScript reducer
6. **alert** - Simple JavaScript reducer
7. **infuraAvailability** - Simple JavaScript reducer

### Phase 2: Foundation (Low-Medium Complexity)

8. **experimentalSettings** - Already TypeScript, needs proper typing
9. **privacy** - Simple state, few actions
10. **modals** - Moderate complexity, no dependencies

### Phase 3: Core Functionality (Medium Complexity)

11. **settings** - Many actions but straightforward
12. **networkOnboarded** - Already TypeScript, needs proper typing
13. **notification** - Complex but well-structured

### Phase 4: Complex Reducers (High Complexity)

14. **browser** - Has existing TypeScript selectors
15. **transaction** - Critical functionality, needs careful testing
16. **collectibles** - Many selectors to type
17. **swaps** - Most complex, save for last

---

## Effort Estimates Summary

| Tier                           | Estimated Total Effort |
| ------------------------------ | ---------------------- |
| Low Complexity (7 reducers)    | 5-8 hours              |
| Medium Complexity (6 reducers) | 10-15 hours            |
| High Complexity (4 reducers)   | 17-24 hours            |
| **Total**                      | **32-47 hours**        |

Note: These estimates include writing tests and updating related selectors. Actual time may vary based on developer familiarity with the codebase.
