import { create } from "zustand";

export type EventListener = (data?: any) => void;

type EventBusState = {
  listeners: Record<string, EventListener[]>;
  subscribe: (event: string, callback: EventListener) => void;
  unsubscribe: (event: string, callback: EventListener) => void;
  publish: (event: string, data?: any) => void;
};

export const useEventBus = create<EventBusState>((set, get) => ({
  listeners: {},

  subscribe: (event, callback) => {
    const current = get().listeners[event] || [];
    set({
      listeners: {
        ...get().listeners,
        [event]: [...current, callback],
      },
    });
  },

  unsubscribe: (event, callback) => {
    const current = get().listeners[event] || [];
    set({
      listeners: {
        ...get().listeners,
        [event]: current.filter((cb) => cb !== callback),
      },
    });
  },

  publish: (event, data) => {
    const listeners = get().listeners[event] || [];
    listeners.forEach((callback) => callback(data));
  },
}));
