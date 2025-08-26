import { type Action } from 'redux';

/**
 * Favorite collectible item structure
 */
export interface FavoriteCollectible {
  tokenId: string;
  address: string;
}

/**
 * Collectibles state
 */
export interface CollectiblesState {
  favorites: Record<string, Record<string, FavoriteCollectible[]>>;
  isNftFetchingProgress: boolean;
}

// Action type enum
export enum CollectiblesActionType {
  ADD_FAVORITE_COLLECTIBLE = 'ADD_FAVORITE_COLLECTIBLE',
  REMOVE_FAVORITE_COLLECTIBLE = 'REMOVE_FAVORITE_COLLECTIBLE',
  SHOW_NFT_FETCHING_LOADER = 'SHOW_NFT_FETCHING_LOADER',
  HIDE_NFT_FETCHING_LOADER = 'HIDE_NFT_FETCHING_LOADER',
}

export type AddFavoriteCollectibleAction =
  Action<CollectiblesActionType.ADD_FAVORITE_COLLECTIBLE> & {
    selectedAddress: string;
    chainId: string;
    collectible: FavoriteCollectible;
  };

export type RemoveFavoriteCollectibleAction =
  Action<CollectiblesActionType.REMOVE_FAVORITE_COLLECTIBLE> & {
    selectedAddress: string;
    chainId: string;
    collectible: FavoriteCollectible;
  };

export type ShowNftFetchingLoaderAction =
  Action<CollectiblesActionType.SHOW_NFT_FETCHING_LOADER>;

export type HideNftFetchingLoaderAction =
  Action<CollectiblesActionType.HIDE_NFT_FETCHING_LOADER>;

/**
 * Collectibles actions union type
 */
export type CollectiblesAction =
  | AddFavoriteCollectibleAction
  | RemoveFavoriteCollectibleAction
  | ShowNftFetchingLoaderAction
  | HideNftFetchingLoaderAction;
