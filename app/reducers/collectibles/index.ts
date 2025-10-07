import { createSelector } from 'reselect';
import { KnownCaipNamespace } from '@metamask/utils';
import { selectChainId } from '../../selectors/networkController';
import {
  selectAllNftContracts,
  selectAllNfts,
} from '../../selectors/nftController';
import { selectSelectedInternalAccountAddress } from '../../selectors/accountsController';
import { compareTokenIds } from '../../util/tokens';
import { createDeepEqualSelector } from '../../selectors/util';
import { selectEnabledNetworksByNamespace } from '../../selectors/networkEnablementController';

interface FavoriteCollectible {
  tokenId: string;
  address: string;
}

export interface CollectiblesState {
  favorites: {
    [address: string]: {
      [chainId: string]: FavoriteCollectible[];
    };
  };
  isNftFetchingProgress: boolean;
}

const favoritesSelector = (state: { collectibles: CollectiblesState }) =>
  state.collectibles.favorites;

export const isNftFetchingProgressSelector = (state: {
  collectibles: CollectiblesState;
}) => state.collectibles.isNftFetchingProgress;

export const collectibleContractsSelector = createSelector(
  selectSelectedInternalAccountAddress,
  selectChainId,
  selectAllNftContracts,
  (address, chainId, allNftContracts) =>
    (address &&
      chainId &&
      allNftContracts[address]?.[chainId as `0x${string}`]) ||
    [],
);

export const multichainCollectibleContractsSelector = createSelector(
  selectSelectedInternalAccountAddress,
  selectAllNftContracts,
  (address, allNftContracts) => (address && allNftContracts[address]) || {},
);

export const multichainCollectibleContractsByEnabledNetworksSelector =
  createDeepEqualSelector(
    selectSelectedInternalAccountAddress,
    selectAllNftContracts,
    selectEnabledNetworksByNamespace,
    (address, allNftContracts, enabledNetworks) => {
      const addressContracts = address ? allNftContracts[address] : undefined;

      if (!addressContracts || Object.keys(addressContracts).length === 0) {
        return {};
      }

      const enabledNetworksForEip155 =
        enabledNetworks?.[KnownCaipNamespace.Eip155] || {};

      if (
        !enabledNetworksForEip155 ||
        Object.keys(enabledNetworksForEip155).length === 0
      ) {
        return {};
      }

      const enabledChainIds = Object.keys(enabledNetworksForEip155).filter(
        (chainId) =>
          enabledNetworksForEip155[
            chainId as keyof typeof enabledNetworksForEip155
          ],
      );

      if (enabledChainIds.length === 0) {
        return {};
      }

      return enabledChainIds.reduce(
        (acc: Record<string, unknown[]>, chainId) => {
          acc[chainId] = addressContracts[chainId as `0x${string}`] || [];
          return acc;
        },
        {},
      );
    },
  );

export const collectiblesSelector = createDeepEqualSelector(
  selectSelectedInternalAccountAddress,
  selectChainId,
  selectAllNfts,
  (address, chainId, allNfts) =>
    (address && chainId && allNfts[address]?.[chainId as `0x${string}`]) || [],
);

export const multichainCollectiblesSelector = createDeepEqualSelector(
  selectSelectedInternalAccountAddress,
  selectAllNfts,
  (address, allNfts) => (address && allNfts[address]) || {},
);

export const multichainCollectiblesByEnabledNetworksSelector =
  createDeepEqualSelector(
    selectSelectedInternalAccountAddress,
    selectAllNfts,
    selectEnabledNetworksByNamespace,
    (address, allNfts, enabledNetworks) => {
      const addressNfts = address ? allNfts[address] : undefined;

      if (!addressNfts || Object.keys(addressNfts).length === 0) {
        return {};
      }

      const enabledNetworksForEip155 =
        enabledNetworks?.[KnownCaipNamespace.Eip155] || {};

      if (
        !enabledNetworksForEip155 ||
        Object.keys(enabledNetworksForEip155).length === 0
      ) {
        return {};
      }

      const enabledChainIds = Object.keys(enabledNetworksForEip155).filter(
        (chainId) =>
          enabledNetworksForEip155[
            chainId as keyof typeof enabledNetworksForEip155
          ],
      );

      if (enabledChainIds.length === 0) {
        return {};
      }

      const enabledChainIdsSet = new Set(enabledChainIds);

      return Object.keys(addressNfts)
        .filter((chainId) => enabledChainIdsSet.has(chainId))
        .reduce((acc: Record<string, unknown>, chainId) => {
          acc[chainId] = addressNfts[chainId as `0x${string}`];
          return acc;
        }, {});
    },
  );

export const favoritesCollectiblesSelector = createSelector(
  selectSelectedInternalAccountAddress,
  selectChainId,
  favoritesSelector,
  (address, chainId, favorites) =>
    (address && chainId && favorites[address]?.[chainId]) || [],
);

export const isCollectibleInFavoritesSelector = createSelector(
  favoritesCollectiblesSelector,
  (_state: unknown, collectible: { tokenId: string; address: string }) =>
    collectible,
  (favoriteCollectibles, collectible) =>
    Boolean(
      favoriteCollectibles.find(
        ({ tokenId, address }: FavoriteCollectible) =>
          compareTokenIds(tokenId, collectible.tokenId) &&
          address === collectible.address,
      ),
    ),
);

const getFavoritesCollectibles = (
  favoriteCollectibles: CollectiblesState['favorites'],
  selectedAddress: string,
  chainId: string,
): FavoriteCollectible[] =>
  favoriteCollectibles[selectedAddress]?.[chainId] || [];

/* eslint-disable @typescript-eslint/default-param-last, @typescript-eslint/no-non-null-assertion */

export const ADD_FAVORITE_COLLECTIBLE = 'ADD_FAVORITE_COLLECTIBLE';
export const REMOVE_FAVORITE_COLLECTIBLE = 'REMOVE_FAVORITE_COLLECTIBLE';
export const SHOW_NFT_FETCHING_LOADER = 'SHOW_NFT_FETCHING_LOADER';
export const HIDE_NFT_FETCHING_LOADER = 'HIDE_NFT_FETCHING_LOADER';

interface CollectiblesAction {
  type: string;
  selectedAddress?: string;
  chainId?: string;
  collectible?: {
    tokenId: string;
    address: string;
  };
}

export const initialState: CollectiblesState = {
  favorites: {},
  isNftFetchingProgress: false,
};

const collectiblesFavoritesReducer = (
  state: CollectiblesState = initialState,
  action: CollectiblesAction,
): CollectiblesState => {
  switch (action.type) {
    case ADD_FAVORITE_COLLECTIBLE: {
      const { selectedAddress, chainId, collectible } = action;
      const collectibles = getFavoritesCollectibles(
        state.favorites,
        selectedAddress!,
        chainId!,
      );
      collectibles.push({
        tokenId: collectible!.tokenId,
        address: collectible!.address,
      });
      const selectedAddressCollectibles =
        state.favorites[selectedAddress!] || [];
      return {
        ...state,
        favorites: {
          ...state.favorites,
          [selectedAddress!]: {
            ...selectedAddressCollectibles,
            [chainId!]: collectibles.slice(),
          },
        },
      };
    }
    case REMOVE_FAVORITE_COLLECTIBLE: {
      const { selectedAddress, chainId, collectible } = action;
      const collectibles = getFavoritesCollectibles(
        state.favorites,
        selectedAddress!,
        chainId!,
      );
      const indexToRemove = collectibles.findIndex(
        ({ tokenId, address }: FavoriteCollectible) =>
          compareTokenIds(tokenId, collectible!.tokenId) &&
          address === collectible!.address,
      );
      collectibles.splice(indexToRemove, 1);
      const selectedAddressCollectibles =
        state.favorites[selectedAddress!] || [];
      return {
        ...state,
        favorites: {
          ...state.favorites,
          [selectedAddress!]: {
            ...selectedAddressCollectibles,
            [chainId!]: collectibles.slice(),
          },
        },
      };
    }
    case SHOW_NFT_FETCHING_LOADER: {
      return {
        ...state,
        isNftFetchingProgress: true,
      };
    }
    case HIDE_NFT_FETCHING_LOADER: {
      return {
        ...state,
        isNftFetchingProgress: false,
      };
    }
    default: {
      return state;
    }
  }
};

export const showNftFetchingLoadingIndicator = () => ({
  type: SHOW_NFT_FETCHING_LOADER,
});

export const hideNftFetchingLoadingIndicator = () => ({
  type: HIDE_NFT_FETCHING_LOADER,
});

export default collectiblesFavoritesReducer;
