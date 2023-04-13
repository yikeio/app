import { useDebouncedCallback } from "use-debounce";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Spin } from "antd";
import Avatar from "./avatar";

import SendWhiteIcon from "../icons/send-white.svg";
import ExportIcon from "../icons/export.svg";
import MenuIcon from "../icons/menu.svg";
import CopyIcon from "../icons/copy.svg";
import DownloadIcon from "../icons/download.svg";
import LoadingIcon from "../icons/loading.svg";
import BotIcon from "../icons/bot.svg";
import RenameIcon from "../icons/rename.svg";
import { updateConversation } from "../api/conversations";
import { showToast } from "./ui-lib";

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

import { IconButton } from "./button";
import styles from "./home.module.scss";

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
    return <Avatar src="/logo.svg" className="rounded-full h-10 w-10" />;
  }

  return (
    <div className="rounded-full h-12 w-12 bg-gray-100 flex items-center justify-center">
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
        <pre className={styles["export-content"]}>{mdText}</pre>
      </div>
    ),
    actions: [
      <IconButton
        key="copy"
        icon={<CopyIcon />}
        bordered
        text={Locale.Export.Copy}
        onClick={() => copyToClipboard(mdText)}
      />,
      <IconButton
        key="download"
        icon={<DownloadIcon />}
        bordered
        text={Locale.Export.Download}
        onClick={() => downloadAs(mdText, filename)}
      />,
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
    <div className={styles["prompt-hints"]}>
      {props.prompts.map((prompt, i) => (
        <div
          className={styles["prompt-hint"]}
          key={prompt.title + i.toString()}
          onClick={() => props.onPromptSelect(prompt)}
        >
          <div className={styles["hint-title"]}>{prompt.title}</div>
          <div className={styles["hint-content"]}>{prompt.content}</div>
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

  const [currentCombo, setActivateVisible] = useBillingStore((state) => [
    state.currentCombo,
    state.setActivateVisible,
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
      showToast("账号未激活，请先激活!");
      setActivateVisible(true);
      return;
    }
    if (!currentCombo) {
      showToast("当前无可用套餐，请购买套餐!");
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

  const config = useChatStore((state) => state.config);

  const context: RenderMessage[] = session.context.slice();

  if (
    context.length === 0 &&
    session.messages.at(0)?.content !== BOT_HELLO.content &&
    pager?.currentPage === pager?.lastPage
  ) {
    context.push(BOT_HELLO);
  }

  // preview messages
  const messages = context
    .concat(session.messages as RenderMessage[])
    .concat(
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
    )
    .concat(
      userInput.length > 0 && config.chat_bubble
        ? [
            {
              id: "user-input",
              role: "user",
              content: userInput,
              date: new Date().toLocaleString(),
              preview: true,
            },
          ]
        : [],
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
      <div className="flex flex-col gap-2 group w-full md:w-auto">
        <div className="rounded-lg">
          {/* 看起来不需要这个东西 */}
          {/* {(message.preview || message.streaming) && Locale.Chat.Typing} */}
          <div
            className={
              `p-6 rounded-xl relative ` +
              (isUser
                ? "bg-blue-500 rounded-tr-none text-white"
                : "bg-gray-100 rounded-tl-none text-gray-700")
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
        <div className="opacity-0 flex items-center gap-4 group-hover:opacity-100">
          {!isUser && !message.preview && (
            <div className="text-xs text-gray-400">
              {parseTime(message.date.toLocaleString())}
            </div>
          )}

          {!isUser && !(message.preview || message.content.length === 0) && (
            // 工具栏
            <div className="flex items-center text-xs gap-4 text-gray-400">
              {message.streaming ? (
                <div
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => onUserStop(index)}
                >
                  复制
                </div>
              ) : (
                <div
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => onResend(index)}
                >
                  重新生成
                </div>
              )}

              <div
                className="cursor-pointer hover:text-blue-500"
                onClick={() => copyToClipboard(message.content)}
              >
                复制
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MessageItem = ({
    message,
    index = 0,
  }: {
    message: RenderMessage;
    index?: number;
  }) => {
    const isUser = message.role === "user";
    const messageBody = (
      <MessageBody
        key="message-body"
        message={message}
        index={index}
      ></MessageBody>
    );
    const avatar = <UserAvatar key="avatar" role={message.role} />;

    return (
      <div
        key={index}
        className={`flex flex-col md:flex-row items-start gap-2 md:gap-4 ${
          isUser ? "items-end md:items-start justify-end" : "items-start"
        }`}
      >
        {isUser && !isMobileScreen()
          ? [messageBody, avatar]
          : [avatar, messageBody]}
      </div>
    );
  };

  return (
    <div
      className="max-h-screen overflow-y-auto flex flex-1 flex-col"
      key={session.id}
    >
      <div className="flex items-center justify-between py-4 px-6 border-b">
        <div
          className="md:flex items-center gap-4"
          onClick={props?.showSideBar}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-xl text-gray-700">{session.title}</h3>
            <IconButton
              icon={<RenameIcon />}
              className="h-4 w-4"
              title="重命名"
              onClick={handleUpdate}
            />
          </div>
          <div className="text-gray-400 text-sm">
            {Locale.Chat.SubTitle(session.messages.length)}
          </div>
        </div>
        <div className={styles["window-actions"]}>
          <div className={styles["window-action-button"] + " " + styles.mobile}>
            <IconButton
              icon={<MenuIcon />}
              bordered
              title={Locale.Chat.Actions.ChatList}
              onClick={props?.showSideBar}
            />
          </div>
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<ExportIcon />}
              bordered
              title={Locale.Chat.Actions.Export}
              onClick={() => {
                exportMessages(
                  session.messages.filter((msg) => !msg.isError),
                  session.title,
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* 对话列表 */}
      <div
        className="bg-white p-6 flex flex-1 flex-col gap-2 overflow-y-scroll"
        ref={scrollRef}
        onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        onTouchStart={() => {
          inputRef.current?.blur();
          setAutoScroll(false);
        }}
      >
        {isLoadingMessage && <Spin style={{ display: "block" }} />}
        {messages.map((message, i) => {
          return (
            <MessageItem key={i} message={message} index={i}></MessageItem>
          );
        })}
      </div>

      <div className="p-6 border-t sticky bottom-0 bg-white shadow">
        <PromptHints prompts={promptHints} onPromptSelect={onPromptSelect} />
        <div className="flex flex-col md:flex-row gap-4">
          <textarea
            ref={inputRef}
            className="flex-1 w-full"
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
            className="block w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={onUserSubmit}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
