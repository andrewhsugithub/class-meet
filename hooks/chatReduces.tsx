import { MessageType } from "@/common/types";

export const ADD_MESSAGE = "ADD_MESSAGE" as const;
export const ADD_HISTORY = "ADD_HISTORY" as const;
export const TOGGLE_CHAT = "TOGGLE_CHAT" as const;

export const addMessageAction = (message: MessageType) => ({
  type: ADD_MESSAGE,
  payload: { message },
});

export const addHistoryAction = (history: MessageType[]) => ({
  type: ADD_HISTORY,
  payload: { history },
});

export const toggleChatAction = (isChatOpen: boolean) => ({
  type: TOGGLE_CHAT,
  payload: { isChatOpen },
});

export type ChatState = {
  messages: MessageType[];
  isChatOpen: boolean;
};

type ChatAction =
  | {
      type: typeof ADD_MESSAGE;
      payload: {
        message: MessageType;
      };
    }
  | {
      type: typeof ADD_HISTORY;
      payload: {
        history: MessageType[];
      };
    }
  | {
      type: typeof TOGGLE_CHAT;
      payload: {
        isChatOpen: boolean;
      };
    };

export const chatReducer = (state: ChatState, action: ChatAction) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };
    case ADD_HISTORY:
      return {
        ...state,
        messages: action.payload.history,
      };
    case TOGGLE_CHAT:
      return {
        ...state,
        isChatOpen: action.payload.isChatOpen,
      };
  }
};
