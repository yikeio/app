import Head from "next/head"
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react"
import toast from "react-hot-toast"

import { Layout } from "@/components/layout"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserAvatar } from "../components/avatar"
import Locale, { AllLangs, changeLang, getLang } from "../locales"
import { SubmitKey, useBillingStore, useChatStore } from "../store"

function SettingItem(props: {
  title: string
  subTitle?: string
  children: JSX.Element
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between p-4">
      <div>
        <div className="font-bold">{props.title}</div>
        {props.subTitle && (
          <div className="text-gray-700">{props.subTitle}</div>
        )}
      </div>
      {props.children}
    </div>
  )
}

export default function Setting() {
  const [user, config, updateConfig, updateUser] = useChatStore((state) => [
    state.user,
    state.config,
    state.updateConfig,
    state.updateUser,
  ])

  const [currentCombo, totalUsage, setBillingModalVisible] = useBillingStore(
    (state) => [
      state.currentCombo,
      state.totalUsage(),
      state.setBillingModalVisible,
    ]
  )

  function handleLogout() {
    localStorage.removeItem("login_token")
    updateUser({})
    toast.success("已登出")
  }

  const handleBuy = () => {
    if (currentCombo) {
      toast.error("您还有未用尽的套餐")
      return
    }
    setBillingModalVisible(true)
  }

  return (
    <Layout>
      <Head>
        <title>Yike setting</title>
        <meta
          name="description"
          content="Yike is a social media platform for sharing your thoughts and ideas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <div className="flex-1 p-3 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">设置</div>
          </div>
          <div className="bg-white border divide-y rounded-lg shadow-sm">
            {user.name && (
              <SettingItem title={Locale.Settings.User}>
                <div className="flex items-center gap-2">
                  {user.name}
                  <button
                    className="px-4 py-1 text-white border-red-600/60 bg-red-500 hover:bg-red-600"
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
              <span>{currentCombo?.available_tokens_count || 0}</span>
            </SettingItem>

            <SettingItem
              title={Locale.Settings.Combo.Title}
              subTitle={Locale.Settings.Combo.SubTitle(
                currentCombo?.expired_at
              )}
            >
              {!currentCombo.is_available ? (
                <button
                  className="text-blue-500 px-2 "
                  onClick={() => handleBuy()}
                >
                  购买套餐
                </button>
              ) : (
                <div className="text-gray-500">
                  您还有未用尽的套餐，暂时不需要额外够买
                </div>
              )}
            </SettingItem>

            <SettingItem title={Locale.Settings.Avatar}>
              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <UserAvatar role="user" />
                  </div>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-fit">
                  <EmojiPicker
                    lazyLoadEmojis
                    theme={EmojiTheme.AUTO}
                    onEmojiClick={(e) => {
                      updateConfig(
                        (config) => (config.avatar = e.unified),
                        user.id,
                        { key: "avatar", value: e.unified }
                      )
                    }}
                  />
                </PopoverContent>
              </Popover>
            </SettingItem>

            <SettingItem title={Locale.Settings.SendKey}>
              <select
                value={config.chat_submit_key}
                onChange={(e) => {
                  updateConfig(
                    (config) => (
                      (config.chat_submit_key = e.target
                        .value as any as SubmitKey),
                      user.id
                    ),
                    user.id,
                    { key: "chat_submit_key", value: e.target.value }
                  )
                }}
              >
                {Object.values(SubmitKey).map((v) => (
                  <option value={v} key={v}>
                    {v}
                  </option>
                ))}
              </select>
            </SettingItem>

            <SettingItem title={Locale.Settings.Lang.Name}>
              <select
                value={getLang()}
                onChange={(e) => {
                  changeLang(e.target.value as any)
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
                        e.currentTarget.value
                      )),
                    user.id,
                    {
                      key: "chat_contexts_count",
                      value: Number.parseInt(e.currentTarget.value),
                    }
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
                        e.currentTarget.value
                      )),
                    user.id,
                    { key: "chat_font_size", value: e.currentTarget.value }
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
                    { key: "no_border", value: e.currentTarget.checked }
                  )
                }
              />
            </SettingItem>
          </div>
        </div>
      </section>
    </Layout>
  )
}