export interface Bookmark {
  url: string;
  name?: string;
}

export type BookmarksState = Bookmark[];

interface BookmarksAction {
  type: string;
  bookmark?: Bookmark;
}

export const initialState: BookmarksState = [];

/* eslint-disable @typescript-eslint/default-param-last */
const bookmarksReducer = (
  state: BookmarksState = initialState,
  action: BookmarksAction,
): BookmarksState => {
  switch (action.type) {
    case 'ADD_BOOKMARK': {
      const bookmark = action.bookmark;
      if (!bookmark) return state;
      return [...state, bookmark];
    }
    case 'REMOVE_BOOKMARK': {
      const bookmark = action.bookmark;
      if (!bookmark) return state;
      return state.filter((item) => item.url !== bookmark.url);
    }
    default:
      return state;
  }
};
export default bookmarksReducer;
