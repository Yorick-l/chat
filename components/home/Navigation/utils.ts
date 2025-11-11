import { Chat } from "@/types/chat";
export const GROUPED_CHATS_LABELS: Record<keyof GroupedChats, string> = {
  last3days: "最近3天",
  last7days: "最近7天",
  last30days: "最近30天",
  earlier: "更早",
};

export type GroupedChats = {
  last3days: Chat[];
  last7days: Chat[];
  last30days: Chat[];
  earlier: Chat[];
};

export function groupChatsByTime(chats: Chat[]): GroupedChats {
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const result: GroupedChats = {
    last3days: [],
    last7days: [],
    last30days: [],
    earlier: [],
  };

  chats.forEach((chat) => {
    const updatedAt =
      typeof chat.updatedAt === "string"
        ? new Date(chat.updatedAt)
        : chat.updatedAt;
    const diff = (now.getTime() - updatedAt.getTime()) / msInDay;
    if (diff < 3) {
      result.last3days.push(chat);
    } else if (diff < 7) {
      result.last7days.push(chat);
    } else if (diff < 30) {
      result.last30days.push(chat);
    } else {
      result.earlier.push(chat);
    }
  });

  return result;
}
