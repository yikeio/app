"use client";

require("../polyfill");

import { useState, useEffect, useRef } from "react";

import { IconButton } from "./button";
import { BillingDialog } from "./billing";
import { LoginDialog, ActivateDialog } from "./login";
import { Spin } from "antd";
import styles from "./home.module.scss";

import SettingsIcon from "../icons/settings.svg";
import ChatGptIcon from "../icons/chatgpt.svg";

import BotIcon from "../icons/bot.svg";
import AddIcon from "../icons/add.svg";
import LoadingIcon from "../icons/loading.svg";
import CloseIcon from "../icons/close.svg";

import { useChatStore, useBillingStore, ChatSession } from "../store";
import { isMobileScreen } from "../utils";
import Locale from "../locales";
import { ChatList } from "./chat-list";
import { Chat } from "./chat";
import { showToast } from "./ui-lib";
import { getConversationList } from "../api/conversations";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "./error";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"]}>
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
        showToast("账号未激活，请先激活!");
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

  useSwitchTheme();

  const handleCreateConversation = () => {
    if (user.state === "unactivated") {
      showToast("账号未激活，请先激活!");
      setActivateVisible(true);
      return;
    }
    if (!currentCombo) {
      showToast("当前无可用套餐，请购买套餐!");
      return;
    }
    createConversation();
    setShowSideBar(false);
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
      className={`${
        config.no_border && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      }`}
    >
      <div
        className={styles.sidebar + ` ${showSideBar && styles["sidebar-show"]}`}
      >
        <div className={styles["sidebar-header"]}>
          <div className={styles["sidebar-title"]}>Yike Chat</div>
          <div className={styles["sidebar-sub-title"]}>
            {user?.name || (
              <button className={styles["sidebar-login-btn"]}>未登录</button>
            )}
          </div>
          <div className={styles["sidebar-logo"]}>
            <ChatGptIcon />
          </div>
        </div>

        <div
          ref={chatListRef}
          className={styles["sidebar-body"]}
          onClick={() => {
            setOpenSettings(false);
            setShowSideBar(false);
          }}
          onScroll={handleSideBarScroll}
        >
          <ChatList />
          <Spin spinning={isLoadingMore} />
        </div>

        <div className={styles["sidebar-tail"]}>
          <div className={styles["sidebar-actions"]}>
            <div className={styles["sidebar-action"] + " " + styles.mobile}>
              <IconButton
                icon={<CloseIcon />}
                onClick={() => {
                  if (confirm(Locale.Home.DeleteChat)) {
                    removeSession(currentIndex);
                  }
                }}
              />
            </div>
            <div className={styles["sidebar-action"]}>
              <IconButton
                icon={<SettingsIcon />}
                onClick={() => {
                  setOpenSettings(true);
                  setShowSideBar(false);
                }}
                shadow
              />
            </div>
          </div>
          <div>
            <IconButton
              icon={<AddIcon />}
              text={Locale.Home.NewChat}
              onClick={() => {
                handleCreateConversation();
              }}
              shadow
            />
          </div>
        </div>
      </div>

      <div className={styles["window-content"]}>
        {openSettings ? (
          <Settings
            closeSettings={() => {
              setOpenSettings(false);
              setShowSideBar(true);
            }}
          />
        ) : (
          <Chat
            key="chat"
            showSideBar={() => setShowSideBar(true)}
            sideBarShowing={showSideBar}
          />
        )}
      </div>
      <LoginDialog />
      <BillingDialog />
      <ActivateDialog />
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
