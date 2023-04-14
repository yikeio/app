"use client";

require("../polyfill");

import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import { BillingDialog } from "./billing";
import { LoginDialog, ActivateDialog } from "./login";
import { Spin } from "antd";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/loading.svg";

import { useChatStore, useBillingStore, ChatSession } from "../store";
import { isMobileScreen } from "../utils";
import Locale from "../locales";
import { ChatList } from "./chat-list";
import { Chat } from "./chat";
import { getConversationList } from "../api/conversations";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "./error";
import Image from "next/image";
import {
  IconTrash,
  IconAdjustmentsHorizontal,
  IconPlus,
} from "@tabler/icons-react";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className="h-screen flex items-center justify-center gap-6">
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

function useSwitchTheme() {
  const config = useChatStore((state) => state.config);

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const themeColor = getComputedStyle(document.body)
      .getPropertyValue("--theme-color")
      .trim();
    const metaDescription = document.querySelector('meta[name="theme-color"]');
    metaDescription?.setAttribute("content", themeColor);
  }, [config.theme]);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

function _Home() {
  const [
    user,
    config,
    sessions,
    currentIndex,
    createConversation,
    removeSession,
    conversationPager,
    getUserSettings,
  ] = useChatStore((state) => [
    state.user,
    state.config,
    state.sessions,
    state.currentSessionIndex,
    state.createConversation,
    state.removeSession,
    state.conversationPager,
    state.getUserSettings,
  ]);
  const [currentCombo, getUserQuotaInfo, setActivateVisible] = useBillingStore(
    (state) => [
      state.currentCombo,
      state.getUserQuotaInfo,
      state.setActivateVisible,
    ],
  );

  const loading = !useHasHydrated();
  const [showSideBar, setShowSideBar] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const chatListRef = useRef<HTMLDivElement>(null);

  // setting
  const [openSettings, setOpenSettings] = useState(false);

  // 退出登陆的时候关掉设置页
  useEffect(() => {
    if (!user.id && !localStorage.getItem("login_token")) {
      setOpenSettings(false);
    }
    // 未注册用户展示激活弹窗
    if (user.id && localStorage.getItem("login_token")) {
      if (user.state === "unactivated") {
        toast("账号未激活，请先激活!");
        setActivateVisible(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (openSettings) {
      getUserQuotaInfo(user.id);
      getUserSettings(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSettings]);

  const toggleSidebar = () => {
    if (!isMobileScreen()) {
      return;
    }
    setShowSideBar(!showSideBar);
  };

  useSwitchTheme();

  const handleCreateConversation = () => {
    if (user.state === "unactivated") {
      toast("账号未激活，请先激活!");
      setActivateVisible(true);
      return;
    }
    if (!currentCombo) {
      toast("当前无可用套餐，请购买套餐!");
      return;
    }
    createConversation();
    toggleSidebar();
  };

  const handleSideBarScroll = async () => {
    if (!chatListRef.current || !conversationPager) return;

    const { scrollTop, clientHeight, scrollHeight } = chatListRef.current;
    if (scrollHeight - clientHeight >= scrollTop) {
      if (conversationPager.currentPage < conversationPager.lastPage) {
        try {
          setIsLoadingMore(true);
          const params = {
            page: conversationPager.currentPage + 1,
            pageSize: conversationPager.pageSize,
          };
          const conversationRes = await getConversationList(user.id, params);
          const list: ChatSession[] = conversationRes.result.data;
          const newList: ChatSession[] = [
            ...sessions,
            ...list.map((conversation) => {
              conversation.context = [];
              conversation.messages = [];
              conversation.updated_at = new Date(
                conversation.updated_at,
              ).toLocaleString();
              return conversation;
            }),
          ];

          // update pager
          useChatStore.setState({
            sessions: newList,
            conversationPager: {
              currentPage: conversationRes.result.current_page,
              pageSize: conversationRes.result.per_page,
              lastPage: conversationRes.result.last_page,
            },
          });

          setIsLoadingMore(false);
        } catch (e) {
          setIsLoadingMore(false);
        }
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className={
        `min-h-screen w-full flex ` +
        (config.no_border && !isMobileScreen() ? "" : "")
      }
    >
      <div
        className={
          `fixed md:relative bg-white border-r inset-0 w-full shrink-0 md:w-72 md:max-w-sm z-10 p-6 flex flex-col ` +
          (showSideBar ? "left-0" : "-left-[100%] md:left-0")
        }
      >
        <div className="flex items-center gap-4 px-2 py-6">
          <Image src="/logo.svg" height={50} width={50} alt={""} />

          <div>
            <h1 className="text-3xl font-bold">Yike Chat</h1>
            <div className="text-gray-500">
              {user?.name || <button className="text-gray-400">未登录</button>}
            </div>
          </div>
        </div>

        <div
          ref={chatListRef}
          className="flex-1"
          onClick={() => {
            setOpenSettings(false);
            toggleSidebar();
          }}
          onScroll={handleSideBarScroll}
        >
          <ChatList />
          <Spin spinning={isLoadingMore} />
        </div>

        <div className="flex flex-col gap-4">
          <button
            className="w-full p-2 px-4 text-white bg-red-500 border-red-400 md:hidden"
            onClick={() => {
              if (confirm(Locale.Home.DeleteChat)) {
                removeSession(currentIndex);
              }
            }}
          >
            <IconTrash size={22} />
            <span>删除选中会话</span>
          </button>
          <div className="flex items-center justify-between">
            <button
              className="p-2"
              onClick={() => {
                setOpenSettings(true);
                toggleSidebar();
              }}
            >
              <IconAdjustmentsHorizontal size={22} />
            </button>
            <button
              className="p-2 px-4"
              onClick={() => {
                handleCreateConversation();
              }}
            >
              <IconPlus size={22} />
              <span>开始新的会话</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden bg-slate-100">
        {openSettings ? (
          <div className="w-full mx-auto max-w-prose">
            <Settings
              closeSettings={() => {
                setOpenSettings(false);
                toggleSidebar();
              }}
            />
          </div>
        ) : (
          <Chat
            key="chat"
            showSideBar={() => toggleSidebar()}
            sideBarShowing={showSideBar}
          />
        )}
      </div>
      <LoginDialog />
      <BillingDialog />
      <ActivateDialog />
      <Toaster />
    </div>
  );
}

export function Home() {
  return (
    <ErrorBoundary>
      <_Home></_Home>
    </ErrorBoundary>
  );
}
