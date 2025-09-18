export const searchMessages = {
  kor: {
    search: '검색',
    selectRegion: '지역을 선택하세요',
    selectDate: '날짜를 선택하세요',
  },
  eng: {
    search: 'Search',
    selectRegion: 'Select a region',
    selectDate: 'Select dates',
  },
} as const;

export type SearchLocale = keyof typeof searchMessages;
