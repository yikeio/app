import { create } from "zustand";

import { type ChatCompletionResponseMessage } from "openai";
import {
  createConversation,
  getConversationList,
  deleteConversation,
  getConversationMessageList,
} from "../api/conversations";
import { ControllerPool, requestChatStream } from "../requests";

import Locale from "../locales";

export type Message = ChatCompletionResponseMessage & {
  date: string;
  streaming?: boolean;
  isError?: boolean;
};

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

export interface ChatConfig {
  historyMessageCount: number; // -1 means all
  compressMessageLengthThreshold: number;
  sendBotMessages: boolean; // send bot's message or not
  submitKey: SubmitKey;
  avatar: string;
  fontSize: number;
  theme: Theme;
  tightBorder: boolean;
  sendPreviewBubble: boolean;

  disablePromptHint: boolean;
}

export const ROLES: Message["role"][] = ["system", "user", "assistant"];

const DEFAULT_CONFIG: ChatConfig = {
  historyMessageCount: 4,
  compressMessageLengthThreshold: 1000,
  sendBotMessages: true as boolean,
  submitKey: SubmitKey.CtrlEnter as SubmitKey,
  avatar: "1f603",
  fontSize: 14,
  theme: Theme.Auto as Theme,
  tightBorder: true,
  sendPreviewBubble: true,

  disablePromptHint: false,
};

export interface ChatSession {
  id: string;
  title: string;
  memoryPrompt: string;
  context: Message[];
  messages: Message[];
  updated_at: string;
}

const DEFAULT_TOPIC = Locale.Store.DefaultTopic;
export const BOT_HELLO: Message = {
  role: "assistant",
  content: Locale.Store.BotHello,
  date: "",
};

function createEmptySession(): ChatSession {
  const createDate = new Date().toLocaleString();

  return {
    id: Date.now() + "",
    title: DEFAULT_TOPIC,
    memoryPrompt: "",
    context: [],
    messages: [],
    updated_at: createDate,
  };
}

interface ChatStore {
  user: Record<string, any>;
  config: ChatConfig;
  sessions: ChatSession[];
  currentSessionIndex: number;
  getConversationList: (userId: string) => Promise<void>;
  createConversation: () => Promise<ChatSession>;
  getConversationHistory: (conversationId: string) => Promise<Message[]>;

  clearSessions: () => void;
  removeSession: (index: number) => void;
  selectSession: (index: number) => void;
  currentSession: () => ChatSession;
  onNewMessage: (message: Message) => void;
  onUserInput: (content: string) => Promise<void>;

  updateCurrentSession: (updater: (session: ChatSession) => void) => void;
  updateMessage: (
    sessionIndex: number,
    messageIndex: number,
    updater: (message?: Message) => void,
  ) => void;
  updateUser: (user: Record<string, string>) => void;
  getConfig: () => ChatConfig;
  updateConfig: (updater: (config: ChatConfig) => void) => void;
  clearAllData: () => void;
}

// 记录会话缓存
const cacheSet = new Set();

export const useChatStore = create<ChatStore>()((set, get) => ({
  user: {},
  sessions: [createEmptySession()],
  currentSessionIndex: 0,
  config: {
    ...DEFAULT_CONFIG,
  },

  updateUser(user: Record<string, string>) {
    set(() => ({ user }));
  },

  async getConversationList(userId: string) {
    const conversationRes = await getConversationList(userId);
    console.log("conversationRes", conversationRes);

    const list: ChatSession[] = conversationRes.result.data;

    if (list.length === 0) {
      const conversation = await get().createConversation();
      list.push(conversation);
    }

    set(() => ({
      sessions: list.map((conversation) => {
        conversation.context = [];
        conversation.messages = [];
        conversation.updated_at = new Date(
          conversation.updated_at,
        ).toLocaleString();
        return conversation;
      }),
    }));

    // 有列表则获取当前会话历史
    if (list.length) {
      const conversationId = String(get().currentSession().id);
      const messageList: Message[] = await get().getConversationHistory(
        conversationId,
      );
      get().updateCurrentSession((session) => (session.messages = messageList));
    }
  },

  // 创建新的对话
  async createConversation() {
    const res = await createConversation(DEFAULT_TOPIC);
    const conversation = res.result;
    conversation.context = [];
    conversation.messages = [];
    conversation.updated_at = new Date(
      conversation.updated_at,
    ).toLocaleString();

    set((state) => ({
      currentSessionIndex: 0,
      sessions: [conversation].concat(state.sessions),
    }));

    return conversation;
  },

  async getConversationHistory(conversationId) {
    const conversationRes = await getConversationMessageList(conversationId);

    const list: ChatSession[] = conversationRes.result.data;
    cacheSet.add(conversationId);

    const historyList = list.map((item: any) => {
      return {
        role: item.role,
        content: item.content,
        date: item.created_at,
        streaming: false,
        isError: false,
      };
    });
    return historyList;
  },

  clearSessions() {
    set(() => ({
      sessions: [createEmptySession()],
      currentSessionIndex: 0,
    }));
  },

  getConfig() {
    return get().config;
  },

  updateConfig(updater) {
    const config = get().config;
    updater(config);
    set(() => ({ config }));
  },

  async selectSession(index: number) {
    set({ currentSessionIndex: index });

    const conversationId = String(get().currentSession().id);

    // 判断缓存是否获取过
    if (cacheSet.has(conversationId)) return;

    // 获取历史消息
    const messageList = await get().getConversationHistory(conversationId);
    get().updateCurrentSession((session) => (session.messages = messageList));
  },

  async removeSession(index: number) {
    await deleteConversation(get().currentSession().id);

    let nextSessions = get().sessions.filter((_, i) => i !== index);
    if (!nextSessions.length) nextSessions = [createEmptySession()];

    set(() => ({ sessions: nextSessions }));
  },

  currentSession() {
    let index: number = get().currentSessionIndex;
    const sessions: ChatSession[] = get().sessions;

    if (index < 0 || index >= sessions.length) {
      index = Math.min(sessions.length - 1, Math.max(0, index));
      set(() => ({ currentSessionIndex: index }));
    }

    const session = sessions[index];

    return session;
  },

  onNewMessage(message) {
    get().updateCurrentSession((session) => {
      session.updated_at = new Date().toLocaleString();
    });
  },

  async onUserInput(content) {
    const userMessage: Message = {
      role: "user",
      content,
      date: new Date().toLocaleString(),
    };

    const botMessage: Message = {
      content: "",
      role: "assistant",
      date: new Date().toLocaleString(),
      streaming: true,
    };

    const sessionIndex = get().currentSessionIndex;
    const messageIndex = get().currentSession().messages.length + 1;

    // save user's and bot's message
    get().updateCurrentSession((session) => {
      session.messages.push(userMessage);
      session.messages.push(botMessage);
    });

    // make request
    requestChatStream(content, {
      conversationId: String(get().currentSession().id),
      onMessage(content, done) {
        // stream response
        if (done) {
          botMessage.streaming = false;
          botMessage.content = content;
          get().onNewMessage(botMessage);
          ControllerPool.remove(sessionIndex, messageIndex);
        } else {
          botMessage.content = content;
          set(() => ({}));
        }
      },
      onError(error, statusCode) {
        botMessage.content += "\n\n" + Locale.Store.Error;
        botMessage.streaming = false;
        userMessage.isError = true;
        botMessage.isError = true;
        set(() => ({}));
        ControllerPool.remove(sessionIndex, messageIndex);
      },
      onController(controller) {
        // collect controller for stop/retry
        ControllerPool.addController(sessionIndex, messageIndex, controller);
      },
      filterBot: !get().config.sendBotMessages,
    });
  },

  getMemoryPrompt() {
    const session = get().currentSession();

    return {
      role: "system",
      content: Locale.Store.Prompt.History(session.memoryPrompt),
      date: "",
    } as Message;
  },

  updateMessage(
    sessionIndex: number,
    messageIndex: number,
    updater: (message?: Message) => void,
  ) {
    const sessions = get().sessions;
    const session = sessions.at(sessionIndex);
    const messages = session?.messages;
    updater(messages?.at(messageIndex));
    set(() => ({ sessions }));
  },

  updateCurrentSession(updater) {
    const sessions = get().sessions;
    const index = get().currentSessionIndex;
    updater(sessions[index]);
    set(() => ({ sessions }));
  },

  clearAllData() {
    if (confirm(Locale.Store.ConfirmClearAll)) {
      localStorage.clear();
      location.reload();
    }
  },
}));
