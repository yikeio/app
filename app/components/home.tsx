"use client";

require("../polyfill");

import { useState, useEffect } from "react";

import { IconButton } from "./button";
import { LoginDialog } from "./login";
import { showToast } from "./ui-lib";
import styles from "./home.module.scss";

import { checkUser } from "../api/user";

import SettingsIcon from "../icons/settings.svg";
import ChatGptIcon from "../icons/chatgpt.svg";

import BotIcon from "../icons/bot.svg";
import AddIcon from "../icons/add.svg";
import LoadingIcon from "../icons/three-dots.svg";
import CloseIcon from "../icons/close.svg";

import { useChatStore } from "../store";
import { isMobileScreen } from "../utils";
import Locale from "../locales";
import { ChatList } from "./chat-list";
import { Chat } from "./chat";

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

const useUserLogin = () => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [config, updateConfig] = useChatStore((state) => [
    state.config,
    state.updateConfig,
  ]);

  useEffect(() => {
    checkUser()
      .then((res) => {
        updateConfig((config) => (config.user = res.result));
        localStorage.setItem("user", JSON.stringify(res.result));
      })
      .catch((error) => {
        showToast(error.result.message);
        setLoginModalVisible(true);
      });
  }, []);

  return { loginModalVisible, setLoginModalVisible };
};

function _Home() {
  const [createNewSession, currentIndex, removeSession] = useChatStore(
    (state) => [
      state.newSession,
      state.currentSessionIndex,
      state.removeSession,
    ],
  );
  const loading = !useHasHydrated();
  const [showSideBar, setShowSideBar] = useState(true);
  const { loginModalVisible, setLoginModalVisible } = useUserLogin();

  // setting
  const [openSettings, setOpenSettings] = useState(false);
  const config = useChatStore((state) => state.config);

  useSwitchTheme();

  useEffect(() => {
    if (!config.user.name && !localStorage.getItem("login_token")) {
      setLoginModalVisible(true);
    }
  }, [config.user]);

  if (loading) return <Loading />;

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
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
            {config.user?.name || (
              <button
                className={styles["sidebar-login-btn"]}
                onClick={() => setLoginModalVisible(true)}
              >
                未登录
              </button>
            )}
          </div>
          <div className={styles["sidebar-logo"]}>
            <ChatGptIcon />
          </div>
        </div>

        <div
          className={styles["sidebar-body"]}
          onClick={() => {
            setOpenSettings(false);
            setShowSideBar(false);
          }}
        >
          <ChatList />
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
                createNewSession();
                setShowSideBar(false);
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
      <LoginDialog
        open={loginModalVisible}
        closeModal={() => setLoginModalVisible(false)}
      />
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
