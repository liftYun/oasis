export type Lang = 'kor' | 'eng';

export interface MainMessages {
  searchTitle: string;
  searchSubtitle: string;
  search: string;
  registerTitle: string;
  registerSubtitle: string;
  register: string;
  brandPrefix: string;
  brandTitle: string;
  likedTitle: string;
  likedSubtitle: string;
  favoriteTitle: string;
  favoriteSubtitle: string;
}

export type MainMessagesMap = Record<Lang, MainMessages>;
