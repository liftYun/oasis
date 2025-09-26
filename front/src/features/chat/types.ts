export type ChatSummary = {
  id: string;
  title: string;
  location: string;
  thumbnailUrl: string;
  opponentProfileUrl?: string;
  lastMessage: string;
  lastDate: string; // ISO or YYYY.MM.DD string for now
  // unread meta (optional to avoid breaking existing consumers)
  unreadCount?: number;
};

export type ChatListResponse = ChatSummary[];
