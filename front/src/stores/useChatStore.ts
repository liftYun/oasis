import { create } from 'zustand';

type ChatState = {
  unreadMap: Record<string, number>;
  addUnread: (roomId: string, count: number) => void;
  removeUnread: (roomId: string) => void;
  getUnreadTotal: () => number;
};

export const useChatStore = create<ChatState>((set, get) => ({
  unreadMap: {},

  addUnread: (roomId, count) =>
    set((state) => {
      const newMap = {
        ...state.unreadMap,
        [roomId]: count,
      };
      return { unreadMap: newMap };
    }),

  removeUnread: (roomId) =>
    set((state) => {
      const newMap = { ...state.unreadMap };
      delete newMap[roomId];
      return { unreadMap: newMap };
    }),

  getUnreadTotal: () => {
    const total = Object.values(get().unreadMap).reduce((sum, c) => sum + c, 0);
    return total;
  },
}));
