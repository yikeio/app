import { useDebouncedCallback } from "use-debounce";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { Spin } from "antd";
import Avatar from "./avatar";

import LoadingIcon from "../icons/loading.svg";
import { updateConversation } from "../api/conversations";
import {
  IconMessage2,
  IconFileExport,
  IconMenu2,
  IconBrandTelegram,
  IconPencil,
  IconReload,
  IconCopy,
} from "@tabler/icons-react";

import {
  Message,
  SubmitKey,
  useChatStore,
  BOT_HELLO,
  useBillingStore,
} from "../store";

import {
  copyToClipboard,
  downloadAs,
  isMobileScreen,
  selectOrCopy,
  parseTime,
} from "../utils";

import dynamic from "next/dynamic";

import { ControllerPool } from "../requests";
import { Prompt, usePromptStore } from "../store";
import Locale from "../locales";

import { showModal } from "./ui-lib";

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon />,
});

const Emoji = dynamic(async () => (await import("emoji-picker-react")).Emoji, {
  loading: () => <LoadingIcon />,
});

export function UserAvatar(props: { role: Message["role"] }) {
  const config = useChatStore((state) => state.config);

  if (props.role !== "user") {
    return (
      <Avatar src="/logo.svg" className="w-10 h-10 rounded-full shrink-0" />
    );
  }

  return (
    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-inner shrink-0 shadow-gray-300">
      <Emoji unified={config.avatar} size={32} />
    </div>
  );
}

function exportMessages(messages: Message[], topic: string) {
  const mdText =
    `# ${topic}\n\n` +
    messages
      .map((m) => {
        return m.role === "user" ? `## ${m.content}` : m.content.trim();
      })
      .join("\n\n");
  const filename = `${topic}.md`;

  showModal({
    title: Locale.Export.Title,
    children: (
      <div className="markdown-body">
        <pre>{mdText}</pre>
      </div>
    ),
    actions: [
      <button key="copy" onClick={() => copyToClipboard(mdText)}>
        复制
      </button>,
      <button key="download" onClick={() => downloadAs(mdText, filename)}>
        下载
      </button>,
    ],
  });
}

function useSubmitHandler() {
  const config = useChatStore((state) => state.config);
  const chat_submit_key = config.chat_submit_key;

  const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return false;
    if (e.key === "Enter" && e.nativeEvent.isComposing) return false;
    return (
      (config.chat_submit_key === SubmitKey.AltEnter && e.altKey) ||
      (config.chat_submit_key === SubmitKey.CtrlEnter && e.ctrlKey) ||
      (config.chat_submit_key === SubmitKey.ShiftEnter && e.shiftKey) ||
      (config.chat_submit_key === SubmitKey.MetaEnter && e.metaKey) ||
      (config.chat_submit_key === SubmitKey.Enter &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.metaKey)
    );
  };

  return {
    chat_submit_key,
    shouldSubmit,
  };
}

export function PromptHints(props: {
  prompts: Prompt[];
  onPromptSelect: (prompt: Prompt) => void;
}) {
  if (props.prompts.length === 0) return null;

  return (
    <div>
      {props.prompts.map((prompt, i) => (
        <div
          key={prompt.title + i.toString()}
          onClick={() => props.onPromptSelect(prompt)}
        >
          <div>{prompt.title}</div>
          <div>{prompt.content}</div>
        </div>
      ))}
    </div>
  );
}

function useScrollToBottom() {
  // for auto-scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // auto scroll
  useLayoutEffect(() => {
    const dom = scrollRef.current;
    if (dom && autoScroll) {
      setTimeout(() => (dom.scrollTop = dom.scrollHeight), 1);
    }
  });

  return {
    scrollRef,
    autoScroll,
    setAutoScroll,
  };
}

export function Chat(props: {
  showSideBar?: () => void;
  sideBarShowing?: boolean;
}) {
  type RenderMessage = Message & { preview?: boolean };

  const chatStore = useChatStore();
  const [session, sessionIndex] = useChatStore((state) => [
    state.currentSession(),
    state.currentSessionIndex,
  ]);

  const [currentCombo, setActivateVisible, setBillingModalVisible] =
    useBillingStore((state) => [
      state.currentCombo,
      state.setActivateVisible,
      state.setBillingModalVisible,
    ]);

  const chat_font_size = useChatStore((state) => state.config.chat_font_size);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const { chat_submit_key, shouldSubmit } = useSubmitHandler();
  const { scrollRef, setAutoScroll } = useScrollToBottom();

  const {
    user,
    sessions,
    currentSessionIndex,
    messageHistoryPagerMap,
    getConversationHistory,
    updateCurrentSession,
  } = chatStore;
  const { id: currentSessionId } = sessions[currentSessionIndex];
  const pager = messageHistoryPagerMap.get(currentSessionId);

  const onChatBodyScroll = async (e: HTMLElement) => {
    if (e.scrollTop <= 0) {
      setAutoScroll(false);
      if (currentSessionId === "-1" || !pager) return;
      if (pager?.currentPage < pager?.lastPage) {
        const params = {
          page: pager.currentPage + 1,
          pageSize: pager.pageSize,
        };

        try {
          setIsLoadingMessage(true);
          const prevMessages = await getConversationHistory(
            currentSessionId,
            params,
          );
          updateCurrentSession((session) => {
            session.messages = [...prevMessages, ...session.messages];
          });
          scrollRef.current?.scrollTo({ top: 2250 });
          setIsLoadingMessage(false);
        } catch (e) {
          setIsLoadingMessage(false);
        }
      }
    }
  };

  // prompt hints
  const promptStore = usePromptStore();
  const [promptHints, setPromptHints] = useState<Prompt[]>([]);
  const onSearch = useDebouncedCallback(
    (text: string) => {
      setPromptHints(promptStore.search(text));
    },
    100,
    { leading: true, trailing: true },
  );

  const onPromptSelect = (prompt: Prompt) => {
    setUserInput(prompt.content);
    setPromptHints([]);
    inputRef.current?.focus();
  };

  const scrollInput = () => {
    const dom = inputRef.current;
    if (!dom) return;
    const paddingBottomNum: number = parseInt(
      window.getComputedStyle(dom).paddingBottom,
      10,
    );
    dom.scrollTop = dom.scrollHeight - dom.offsetHeight + paddingBottomNum;
  };

  // only search prompts when user input is short
  const SEARCH_TEXT_LIMIT = 30;
  const onInput = (text: string) => {
    scrollInput();
    setUserInput(text);
    const n = text.trim().length;

    // clear search results
    if (n === 0) {
      setPromptHints([]);
    } else if (n < SEARCH_TEXT_LIMIT) {
      // check if need to trigger auto completion
      if (text.startsWith("/")) {
        let searchText = text.slice(1);
        if (searchText.length === 0) {
          searchText = " ";
        }
        onSearch(searchText);
      }
    }
  };

  // submit user input
  const onUserSubmit = () => {
    if (user.state === "unactivated") {
      toast.error("账号未激活，请先激活!");
      setActivateVisible(true);
      return;
    }
    if (!currentCombo) {
      toast.error("当前无可用套餐，请购买套餐!");
      setBillingModalVisible(true);
      return;
    }
    if (userInput.length <= 0) return;
    setIsLoading(true);
    chatStore.onUserInput(userInput).then(() => setIsLoading(false));
    setUserInput("");
    setPromptHints([]);
    if (!isMobileScreen()) inputRef.current?.focus();
    setAutoScroll(true);
  };

  // stop response
  const onUserStop = (messageIndex: number) => {
    ControllerPool.stop(sessionIndex, messageIndex);
  };

  // check if should send message
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (shouldSubmit(e)) {
      onUserSubmit();
      e.preventDefault();
    }
  };
  const onRightClick = (e: any, message: Message) => {
    // auto fill user input
    if (message.role === "user") {
      setUserInput(message.content);
    }

    // copy to clipboard
    if (selectOrCopy(e.currentTarget, message.content)) {
      e.preventDefault();
    }
  };

  const onResend = (botIndex: number) => {
    // find last user input message and resend
    for (let i = botIndex; i >= 0; i -= 1) {
      if (messages[i].role === "user") {
        setIsLoading(true);
        chatStore
          .onUserInput(messages[i].content)
          .then(() => setIsLoading(false));
        inputRef.current?.focus();
        return;
      }
    }
  };

  if (
    session.context.length === 0 &&
    session.messages.at(0)?.content !== BOT_HELLO.content &&
    pager?.currentPage === pager?.lastPage
  ) {
    session.context.push(BOT_HELLO);
  }

  // preview messages
  const messages: RenderMessage[] = useMemo(
    () =>
      session.context.concat(session.messages as RenderMessage[]).concat(
        isLoading
          ? [
              {
                id: "loading",
                role: "assistant",
                content: "……",
                date: new Date().toLocaleString(),
                preview: true,
              },
            ]
          : [],
      ),
    [session.messages, session.context, isLoading],
  );

  // 更新对话
  const handleUpdate = () => {
    const newTopic = prompt(Locale.Chat.Rename, session.title);
    if (newTopic && newTopic !== session.title) {
      chatStore.updateCurrentSession((session) => {
        session.title = newTopic!;
        updateConversation(session.id, { title: newTopic });
      });
    }
  };

  // Auto focus
  useEffect(() => {
    if (props.sideBarShowing && isMobileScreen()) return;
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MessageBody = ({
    message,
    index,
  }: {
    message: RenderMessage;
    index: number;
  }) => {
    const isUser = message.role === "user";
    return (
      <div className="relative max-w-[90%] md:max-w-[75%] flex flex-col gap-2 overflow-hidden group">
        <div className="rounded-lg">
          <div
            className={
              `p-3 md:p-4 rounded-xl relative ` +
              (isUser
                ? "bg-blue-500 justify-self-end rounded-br-none text-white"
                : "bg-white rounded-bl-none text-gray-700")
            }
          >
            {/* 消息内容 */}
            {(message.preview || message.content.length === 0) && !isUser ? (
              <LoadingIcon />
            ) : (
              <div
                className="markdown-body"
                style={{ fontSize: `${chat_font_size}px` }}
                onContextMenu={(e) => onRightClick(e, message)}
                onDoubleClickCapture={() => {
                  if (!isMobileScreen()) return;
                  setUserInput(message.content);
                }}
              >
                <Markdown content={message.content} />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100">
          {!isUser && !message.preview && (
            <div className="text-xs text-gray-400">
              {parseTime(message.date.toLocaleString())}
            </div>
          )}

          {!isUser && !(message.preview || message.content.length === 0) && (
            // 工具栏
            <div className="flex items-center gap-4 text-xs text-gray-400">
              {message.streaming ? (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                  onClick={() => onUserStop(index)}
                >
                  <IconCopy size={12} /> 复制
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                  onClick={() => onResend(index)}
                >
                  <IconReload size={12} /> 重新生成
                </div>
              )}

              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => copyToClipboard(message.content)}
              >
                <IconCopy size={12} /> 复制
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MessageItem = useCallback(
    ({ message, index = 0 }: { message: RenderMessage; index?: number }) => {
      const isUser = message.role === "user";
      const messageBody = (
        <MessageBody
          key={`${message.id}_body`}
          message={message}
          index={index}
        />
      );
      const avatar = (
        <UserAvatar
          key={
            isUser ? `${message.id}_user_avatar` : `${message.id}_bot_avatar`
          }
          role={message.role}
        />
      );

      return (
        <div
          className={`flex flex-col md:flex-row items-start gap-2 md:gap-4 ${
            isUser ? "items-end md:items-start justify-end" : "items-start"
          }`}
        >
          {isUser && !isMobileScreen()
            ? [messageBody, avatar]
            : [avatar, messageBody]}
        </div>
      );
    },
    [],
  );

  return (
    <div
      className="flex flex-col flex-1 max-h-screen overflow-y-auto bg-slate-100"
      key={session.id}
    >
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div
          className="items-center gap-4 md:flex"
          onClick={props?.showSideBar}
        >
          <div className="flex items-center gap-2">
            <IconMessage2 />
            <h3 className="text-xl text-gray-700">{session.title}</h3>
            <button className="w-4 h-4" title="重命名" onClick={handleUpdate}>
              <IconPencil size={12} />
            </button>
          </div>
          <div className="text-sm text-gray-400">
            {Locale.Chat.SubTitle(session.messages.length)}
          </div>
        </div>
        <div>
          <div className="md:hidden">
            <button
              className="flex items-center gap-1 p-2"
              title={Locale.Chat.Actions.ChatList}
              onClick={props?.showSideBar}
            >
              <IconMenu2 size={22} />
              <span>会话列表</span>
            </button>
          </div>
          {/* 暂时不做导出 */}
          <div className="hidden">
            <button
              className="p-2"
              title={Locale.Chat.Actions.Export}
              onClick={() => {
                exportMessages(
                  session.messages.filter((msg) => !msg.isError),
                  session.title,
                );
              }}
            >
              <IconFileExport size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* 对话列表 */}
      <div
        className="flex flex-col flex-1 gap-2 p-6 overflow-y-scroll"
        ref={scrollRef}
        onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        onTouchStart={() => {
          inputRef.current?.blur();
          setAutoScroll(false);
        }}
      >
        {isLoadingMessage && <Spin style={{ display: "block" }} />}
        {messages.map((message, i) => (
          <MessageItem key={message.id} message={message} index={i} />
        ))}
      </div>

      <div className="sticky bottom-0 p-6">
        <PromptHints prompts={promptHints} onPromptSelect={onPromptSelect} />
        <div className="relative flex flex-col items-center gap-2 md:flex-row">
          <textarea
            ref={inputRef}
            className="flex-1 w-full py-3 md:py-2 md:pr-32 rounded-xl ring-0 focus:ring-0"
            placeholder={Locale.Chat.Input(chat_submit_key)}
            rows={2}
            onInput={(e) => onInput(e.currentTarget.value)}
            value={userInput}
            onKeyDown={onInputKeyDown}
            onFocus={() => setAutoScroll(true)}
            onBlur={() => {
              setAutoScroll(false);
              setTimeout(() => setPromptHints([]), 500);
            }}
            autoFocus={!props?.sideBarShowing}
          />
          <button
            className="md:absolute right-4 w-full px-5 py-2 text-white border-blue-600 bg-blue-700 md:-ml-32 md:w-auto hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={onUserSubmit}
          >
            <IconBrandTelegram size={20} />
            <span>发送</span>
          </button>
        </div>
      </div>
    </div>
  );
}
