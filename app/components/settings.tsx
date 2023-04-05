import { useState } from "react";

import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";

import styles from "./settings.module.scss";

import CloseIcon from "../icons/close.svg";
import ClearIcon from "../icons/clear.svg";

import { List, ListItem, Popover, showToast } from "./ui-lib";

import { IconButton } from "./button";
import { SubmitKey, useChatStore, Theme } from "../store";
import { Avatar } from "./chat";

import Locale, { AllLangs, changeLang, getLang } from "../locales";

function SettingItem(props: {
  title: string;
  subTitle?: string;
  children: JSX.Element;
}) {
  return (
    <ListItem>
      <div className={styles["settings-title"]}>
        <div>{props.title}</div>
        {props.subTitle && (
          <div className={styles["settings-sub-title"]}>{props.subTitle}</div>
        )}
      </div>
      {props.children}
    </ListItem>
  );
}

export function Settings(props: { closeSettings: () => void }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [user, config, updateConfig, updateUser, clearAllData, clearSessions] =
    useChatStore((state) => [
      state.user,
      state.config,
      state.updateConfig,
      state.updateUser,
      state.clearAllData,
      state.clearSessions,
    ]);

  function handleLogout() {
    localStorage.removeItem("login_token");
    updateUser({});
    showToast("已登出");
  }

  return (
    <>
      <div className={styles["window-header"]}>
        <div className={styles["window-header-title"]}>
          <div className={styles["window-header-main-title"]}>
            {Locale.Settings.Title}
          </div>
          <div className={styles["window-header-sub-title"]}>
            {Locale.Settings.SubTitle}
          </div>
        </div>
        <div className={styles["window-actions"]}>
          {/* <div className={styles["window-action-button"]}>
            <IconButton
              icon={<ClearIcon />}
              onClick={clearSessions}
              bordered
              title={Locale.Settings.Actions.ClearAll}
            />
          </div> */}
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<CloseIcon />}
              onClick={props.closeSettings}
              bordered
              title={Locale.Settings.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["settings"]}>
        <List>
          {user.name && (
            <SettingItem title={Locale.Settings.User}>
              <div className={styles.user}>
                {user.name}
                <button className={styles.logout} onClick={handleLogout}>
                  退出登录
                </button>
              </div>
            </SettingItem>
          )}

          {/* 账户余额 */}
          {/* <SettingItem
            title={Locale.Settings.Usage.Title}
            subTitle={
              loadingUsage
                ? Locale.Settings.Usage.IsChecking
                : Locale.Settings.Usage.SubTitle(usage?.used ?? "[?]")
            }
          >
            {loadingUsage ? (
              <div />
            ) : (
              <IconButton
                icon={<ResetIcon></ResetIcon>}
                text={Locale.Settings.Usage.Check}
                onClick={checkUsage}
              />
            )}
          </SettingItem> */}

          <SettingItem title={Locale.Settings.Avatar}>
            <Popover
              onClose={() => setShowEmojiPicker(false)}
              content={
                <EmojiPicker
                  lazyLoadEmojis
                  theme={EmojiTheme.AUTO}
                  onEmojiClick={(e) => {
                    updateConfig((config) => (config.avatar = e.unified));
                    setShowEmojiPicker(false);
                  }}
                />
              }
              open={showEmojiPicker}
            >
              <div
                className={styles.avatar}
                onClick={() => setShowEmojiPicker(true)}
              >
                <Avatar role="user" />
              </div>
            </Popover>
          </SettingItem>

          <SettingItem title={Locale.Settings.SendKey}>
            <select
              value={config.submitKey}
              onChange={(e) => {
                updateConfig(
                  (config) =>
                    (config.submitKey = e.target.value as any as SubmitKey),
                );
              }}
            >
              {Object.values(SubmitKey).map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </select>
          </SettingItem>

          <ListItem>
            <div className={styles["settings-title"]}>
              {Locale.Settings.Theme}
            </div>
            <select
              value={config.theme}
              onChange={(e) => {
                updateConfig(
                  (config) => (config.theme = e.target.value as any as Theme),
                );
              }}
            >
              {Object.values(Theme).map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </select>
          </ListItem>

          <SettingItem title={Locale.Settings.Lang.Name}>
            <select
              value={getLang()}
              onChange={(e) => {
                changeLang(e.target.value as any);
              }}
            >
              {AllLangs.map((lang) => (
                <option value={lang} key={lang}>
                  {Locale.Settings.Lang.Options[lang]}
                </option>
              ))}
            </select>
          </SettingItem>

          <SettingItem
            title={Locale.Settings.FontSize.Title}
            subTitle={Locale.Settings.FontSize.SubTitle}
          >
            <input
              type="range"
              title={`${config.fontSize ?? 14}px`}
              value={config.fontSize}
              min="12"
              max="18"
              step="1"
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.fontSize = Number.parseInt(e.currentTarget.value)),
                )
              }
            ></input>
          </SettingItem>

          <SettingItem title={Locale.Settings.TightBorder}>
            <input
              type="checkbox"
              checked={config.tightBorder}
              onChange={(e) =>
                updateConfig(
                  (config) => (config.tightBorder = e.currentTarget.checked),
                )
              }
            ></input>
          </SettingItem>

          <SettingItem title={Locale.Settings.SendPreviewBubble}>
            <input
              type="checkbox"
              checked={config.sendPreviewBubble}
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.sendPreviewBubble = e.currentTarget.checked),
                )
              }
            ></input>
          </SettingItem>
        </List>
      </div>
    </>
  );
}
