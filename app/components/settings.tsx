import { useState } from "react";

import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import toast from "react-hot-toast";

import { ListItem, Popover } from "./ui-lib";

import { SubmitKey, useChatStore, Theme, useBillingStore } from "../store";
import { UserAvatar } from "./chat";

import Locale, { AllLangs, changeLang, getLang } from "../locales";
import { IconX } from "@tabler/icons-react";

function SettingItem(props: {
  title: string;
  subTitle?: string;
  children: JSX.Element;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <div className="font-bold">{props.title}</div>
        {props.subTitle && (
          <div className="text-gray-700">{props.subTitle}</div>
        )}
      </div>
      {props.children}
    </div>
  );
}

export function Settings(props: { closeSettings: () => void }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [user, config, updateConfig, updateUser] = useChatStore((state) => [
    state.user,
    state.config,
    state.updateConfig,
    state.updateUser,
  ]);

  const [currentCombo, totalUsage, setBillingModalVisible] = useBillingStore(
    (state) => [
      state.currentCombo,
      state.totalUsage(),
      state.setBillingModalVisible,
    ],
  );

  function handleLogout() {
    localStorage.removeItem("login_token");
    updateUser({});
    toast("已登出");
  }

  const handleBuy = () => {
    if (currentCombo) {
      toast("您还有未用尽的套餐");
      return;
    }
    setBillingModalVisible(true);
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">设置</div>
        <button
          onClick={props.closeSettings}
          className="p-1 bg-white hover:bg-slate-100"
        >
          <IconX size={22} />
        </button>
      </div>
      <div className="bg-white border divide-y rounded-lg shadow-sm">
        {user.name && (
          <SettingItem title={Locale.Settings.User}>
            <div className="flex items-center gap-2">
              {user.name}
              <button
                className="px-4 py-1 text-white bg-red-500"
                onClick={handleLogout}
              >
                退出登录
              </button>
            </div>
          </SettingItem>
        )}

        {user.name && (
          <SettingItem title={Locale.Settings.UserReferral}>
            <div className="uppercase">{user.referral_code}</div>
          </SettingItem>
        )}

        <SettingItem
          title={Locale.Settings.Usage.Title}
          subTitle={Locale.Settings.Usage.SubTitle(totalUsage || 0)}
        >
          <span>{currentCombo?.usage?.available_tokens_count || 0}</span>
        </SettingItem>

        <SettingItem
          title={Locale.Settings.Combo.Title}
          subTitle={Locale.Settings.Combo.SubTitle(currentCombo?.expired_at)}
        >
          {!currentCombo ? (
            <button className="text-blue-500 px-2 " onClick={() => handleBuy()}>
              购买套餐
            </button>
          ) : (
            <div className="text-gray-500">
              您还有未用尽的套餐，暂时不需要额外够买
            </div>
          )}
        </SettingItem>

        <SettingItem title={Locale.Settings.Avatar}>
          <Popover
            onClose={() => setShowEmojiPicker(false)}
            content={
              <EmojiPicker
                lazyLoadEmojis
                theme={EmojiTheme.AUTO}
                onEmojiClick={(e) => {
                  updateConfig(
                    (config) => (config.avatar = e.unified),
                    user.id,
                    { key: "avatar", value: e.unified },
                  );
                  setShowEmojiPicker(false);
                }}
              />
            }
            open={showEmojiPicker}
          >
            <div onClick={() => setShowEmojiPicker(true)}>
              <UserAvatar role="user" />
            </div>
          </Popover>
        </SettingItem>

        <SettingItem title={Locale.Settings.SendKey}>
          <select
            value={config.chat_submit_key}
            onChange={(e) => {
              updateConfig(
                (config) => (
                  (config.chat_submit_key = e.target.value as any as SubmitKey),
                  user.id
                ),
                user.id,
                { key: "chat_submit_key", value: e.target.value },
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
          <div className="">{Locale.Settings.Theme}</div>
          <select
            value={config.theme}
            onChange={(e) => {
              updateConfig(
                (config) => (
                  (config.theme = e.target.value as any as Theme), user.id
                ),
                user.id,
                { key: "theme", value: e.target.value },
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
          title={Locale.Settings.HistoryCount.Title}
          subTitle={Locale.Settings.HistoryCount.SubTitle}
        >
          <input
            type="range"
            title={`${config.chat_contexts_count}px`}
            value={config.chat_contexts_count}
            min="0"
            max="10"
            step="1"
            onChange={(e) =>
              updateConfig(
                (config) =>
                  (config.chat_contexts_count = Number.parseInt(
                    e.currentTarget.value,
                  )),
                user.id,
                {
                  key: "chat_contexts_count",
                  value: Number.parseInt(e.currentTarget.value),
                },
              )
            }
          ></input>
        </SettingItem>

        <SettingItem
          title={Locale.Settings.FontSize.Title}
          subTitle={Locale.Settings.FontSize.SubTitle}
        >
          <input
            type="range"
            title={`${config.chat_font_size ?? 14}px`}
            value={config.chat_font_size}
            min="12"
            max="18"
            step="1"
            onChange={(e) =>
              updateConfig(
                (config) =>
                  (config.chat_font_size = Number.parseInt(
                    e.currentTarget.value,
                  )),
                user.id,
                { key: "chat_font_size", value: e.currentTarget.value },
              )
            }
          ></input>
        </SettingItem>

        <SettingItem title={Locale.Settings.TightBorder}>
          <input
            type="checkbox"
            checked={config.no_border}
            onChange={(e) =>
              updateConfig(
                (config) => (config.no_border = e.currentTarget.checked),
                user.id,
                { key: "no_border", value: e.currentTarget.checked },
              )
            }
          />
        </SettingItem>

        <SettingItem title={Locale.Settings.SendPreviewBubble}>
          <input
            type="checkbox"
            checked={config.chat_bubble}
            onChange={(e) =>
              updateConfig(
                (config) => (config.chat_bubble = e.currentTarget.checked),
                user.id,
                { key: "chat_bubble", value: e.currentTarget.checked },
              )
            }
          />
        </SettingItem>
      </div>
    </div>
  );
}
