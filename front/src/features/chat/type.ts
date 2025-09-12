export type ChatSummary = {
  id: string;
  title: string;
  location: string;
  thumbnailUrl: string;
  lastDate: string; // ISO or YYYY.MM.DD string for now
};

export type ChatListResponse = ChatSummary[];
