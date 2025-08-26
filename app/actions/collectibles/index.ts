import {
  CollectiblesActionType,
  AddFavoriteCollectibleAction,
  RemoveFavoriteCollectibleAction,
  FavoriteCollectible,
} from '../../reducers/collectibles/types';

export const addFavoriteCollectible = (
  selectedAddress: string,
  chainId: string,
  collectible: FavoriteCollectible,
): AddFavoriteCollectibleAction => ({
  type: CollectiblesActionType.ADD_FAVORITE_COLLECTIBLE,
  selectedAddress,
  chainId,
  collectible,
});

export const removeFavoriteCollectible = (
  selectedAddress: string,
  chainId: string,
  collectible: FavoriteCollectible,
): RemoveFavoriteCollectibleAction => ({
  type: CollectiblesActionType.REMOVE_FAVORITE_COLLECTIBLE,
  selectedAddress,
  chainId,
  collectible,
});
