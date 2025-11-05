import { AnyAction } from 'redux';

export interface BookmarkState {
  url: string;
  name?: string;
}

const bookmarksReducer = (
  state: BookmarkState[] = [],
  action: AnyAction = { type: '' },
): BookmarkState[] => {
  switch (action.type) {
    case 'ADD_BOOKMARK':
      return [...state, action.bookmark];
    case 'REMOVE_BOOKMARK':
      return state.filter((item) => item.url !== action.bookmark.url);
    default:
      return state;
  }
};
export default bookmarksReducer;
