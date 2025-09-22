// src/stores/useSearchStore.ts
import { create } from 'zustand';
import { StayCardDto } from '@/services/stay.types';

interface SearchState {
  results: StayCardDto[];
  setResults: (data: StayCardDto[]) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  setResults: (data) => set({ results: data }),
}));
