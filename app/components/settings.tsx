import { useState, useEffect, useMemo } from "react";

import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";

import styles from "./settings.module.scss";

import CloseIcon from "../icons/close.svg";
import ClearIcon from "../icons/clear.svg";
import EditIcon from "../icons/edit.svg";

import { List, ListItem, Popover, showToast } from "./ui-lib";

import { IconButton } from "./button";
import { SubmitKey, useChatStore, Theme, useAccessStore } from "../store";
import { Avatar } from "./chat";

import Locale, { AllLangs, changeLang, getLang } from "../locales";
import { SearchService, usePromptStore } from "../store/prompt";
import { requestUsage } from "../requests";

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
  const [config, updateConfig, clearAllData, clearSessions] = useChatStore(
    (state) => [
      state.config,
      state.updateConfig,
      state.clearAllData,
      state.clearSessions,
    ],
  );

  const [usage, setUsage] = useState<{
    used?: number;
  }>();
  const [loadingUsage, setLoadingUsage] = useState(false);
  function checkUsage() {
    setLoadingUsage(true);
    requestUsage()
      .then((res) =>
        setUsage({
          used: res,
        }),
      )
      .finally(() => {
        setLoadingUsage(false);
      });
  }

  useEffect(() => {
    checkUsage();
  }, []);

  const accessStore = useAccessStore();
  const enabledAccessControl = useMemo(
    () => accessStore.enabledAccessControl(),
    [],
  );

  const promptStore = usePromptStore();
  const builtinCount = SearchService.count.builtin;
  const customCount = promptStore.prompts.size ?? 0;

  function handleLogout() {
    localStorage.removeItem("login_token");
    updateConfig((config) => (config.user = {}));
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
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<ClearIcon />}
              onClick={clearSessions}
              bordered
              title={Locale.Settings.Actions.ClearAll}
            />
          </div>
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
          {config.user.name && (
            <SettingItem title={Locale.Settings.User}>
              <div className={styles.user}>
                {config.user.name}
                <button className={styles.logout} onClick={handleLogout}>
                  退出登录
                </button>
              </div>
            </SettingItem>
          )}

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
        <List>
          <SettingItem
            title={Locale.Settings.Prompt.Disable.Title}
            subTitle={Locale.Settings.Prompt.Disable.SubTitle}
          >
            <input
              type="checkbox"
              checked={config.disablePromptHint}
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.disablePromptHint = e.currentTarget.checked),
                )
              }
            ></input>
          </SettingItem>

          <SettingItem
            title={Locale.Settings.Prompt.List}
            subTitle={Locale.Settings.Prompt.ListCount(
              builtinCount,
              customCount,
            )}
          >
            <IconButton
              icon={<EditIcon />}
              text={Locale.Settings.Prompt.Edit}
              onClick={() => showToast(Locale.WIP)}
            />
          </SettingItem>
        </List>
        <List>
          {enabledAccessControl ? (
            <SettingItem
              title={Locale.Settings.AccessCode.Title}
              subTitle={Locale.Settings.AccessCode.SubTitle}
            >
              <input
                value={accessStore.accessCode}
                type="text"
                placeholder={Locale.Settings.AccessCode.Placeholder}
                onChange={(e) => {
                  accessStore.updateCode(e.currentTarget.value);
                }}
              ></input>
            </SettingItem>
          ) : (
            <></>
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

          <SettingItem
            title={Locale.Settings.HistoryCount.Title}
            subTitle={Locale.Settings.HistoryCount.SubTitle}
          >
            <input
              type="range"
              title={config.historyMessageCount.toString()}
              value={config.historyMessageCount}
              min="0"
              max="25"
              step="2"
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.historyMessageCount = e.target.valueAsNumber),
                )
              }
            ></input>
          </SettingItem>

          <SettingItem
            title={Locale.Settings.CompressThreshold.Title}
            subTitle={Locale.Settings.CompressThreshold.SubTitle}
          >
            <input
              type="number"
              min={500}
              max={4000}
              value={config.compressMessageLengthThreshold}
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.compressMessageLengthThreshold =
                      e.currentTarget.valueAsNumber),
                )
              }
            ></input>
          </SettingItem>
        </List>

        <List>
          <SettingItem
            title={Locale.Settings.Temperature.Title}
            subTitle={Locale.Settings.Temperature.SubTitle}
          >
            <input
              type="range"
              value={config.modelConfig.temperature.toFixed(1)}
              min="0"
              max="2"
              step="0.1"
              onChange={(e) => {
                updateConfig(
                  (config) =>
                    (config.modelConfig.temperature =
                      e.currentTarget.valueAsNumber),
                );
              }}
            ></input>
          </SettingItem>
          <SettingItem
            title={Locale.Settings.MaxTokens.Title}
            subTitle={Locale.Settings.MaxTokens.SubTitle}
          >
            <input
              type="number"
              min={100}
              max={4096}
              value={config.modelConfig.max_tokens}
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.modelConfig.max_tokens =
                      e.currentTarget.valueAsNumber),
                )
              }
            ></input>
          </SettingItem>
          <SettingItem
            title={Locale.Settings.PresencePenlty.Title}
            subTitle={Locale.Settings.PresencePenlty.SubTitle}
          >
            <input
              type="range"
              value={config.modelConfig.presence_penalty.toFixed(1)}
              min="-2"
              max="2"
              step="0.5"
              onChange={(e) => {
                updateConfig(
                  (config) =>
                    (config.modelConfig.presence_penalty =
                      e.currentTarget.valueAsNumber),
                );
              }}
            ></input>
          </SettingItem>
        </List>
      </div>
    </>
  );
}
