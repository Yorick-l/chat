import { create } from "zustand";
import { Message, Chat } from "@/types/chat";
type AppStore = {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  messageList: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  updateMessage: (id: string, message: Message) => void;
  clearMessageList: () => void;
  currentModel: string;
  setCurrentModel: (model: string) => void;
  streamId: string;
  setStreamId: (id: string) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  setMessageList: (messages: Message[]) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isDrawerOpen: true,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  currentModel: 'gpt-4o',
  setCurrentModel: (model: string) => set({ currentModel: model }),
  messageList: [],
  addMessage: (message: Message) =>
    set((state) => ({ messageList: [...state.messageList, message] })),
  removeMessage: (id: string) =>
    set((state) => ({
      messageList: state.messageList.filter((message) => message.id !== id),
    })),
  updateMessage: (id: string, message: Message) =>
    set((state) => ({
      messageList: state.messageList.map((msg) =>
        msg.id === id ? message : msg
      ),
    })),
  setMessageList: (messages: Message[]) => set({ messageList: messages }),
  clearMessageList: () => set({ messageList: [] }),
  streamId: "",
  setStreamId: (id: string) => set({ streamId: id }),
  selectedChat: null as Chat | null,
  setSelectedChat: (chat: Chat | null) => set({ selectedChat: chat }),
}));
