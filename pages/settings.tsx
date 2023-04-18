import Head from "next/head"
import * as dayjs from "dayjs"
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react"
import toast from "react-hot-toast"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { UserAvatar } from "../components/avatar"
import { SubmitKey, useBillingStore, useChatStore } from "../store"

function SettingItem(props: {
  title: string
  subTitle?: string
  children: JSX.Element
}) {
  return (
    <div className="flex flex-col justify-between gap-4 py-6 md:flex-row md:items-center">
      <div>
        <Label className="text-gray-700">{props.title}</Label>
        {props.subTitle && (
          <div className="text-sm text-gray-400">{props.subTitle}</div>
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
        <title>设置</title>
        <meta name="description" content="一刻AI助手" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <div className="flex-1 p-3 space-y-6 md:p-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">设置</div>
          </div>
          <div className="flex flex-col divide-y rounded-lg">
            {user.name && (
              <SettingItem title="用户信息">
                <div className="flex items-center gap-2">
                  {user.name}
                  <Button variant="destructive" onClick={handleLogout}>
                    退出登录
                  </Button>
                </div>
              </SettingItem>
            )}

            {user.name && (
              <SettingItem title="我的邀请码">
                <div className="uppercase">{user.referral_code}</div>
              </SettingItem>
            )}

            <SettingItem
              title="使用情况"
              subTitle={`累计已使用 ${totalUsage || 0}`}
            >
              <span>{currentCombo?.available_tokens_count || 0}</span>
            </SettingItem>

            <SettingItem
              title="套餐"
              subTitle={
                currentCombo?.expired_at
                  ? `过期时间: ${dayjs(currentCombo?.expired_at).format(
                      "YYYY/MM/DD HH:mm:ss"
                    )}`
                  : "暂无可用套餐"
              }
            >
              {!currentCombo.is_available ? (
                <Button onClick={() => handleBuy()}>购买套餐</Button>
              ) : (
                <div className="text-gray-500">
                  您还有未用尽的套餐，暂时不需要额外够买
                </div>
              )}
            </SettingItem>

            <SettingItem title="头像">
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

            <SettingItem title="发送键">
              <div className="w-32">
                <Select
                  value={config.chat_submit_key}
                  onValueChange={(key) => {
                    updateConfig(
                      (config) => (
                        (config.chat_submit_key =
                          key.value as any as SubmitKey),
                        user.id
                      ),
                      user.id,
                      { key: "chat_submit_key", value: key }
                    )
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SubmitKey).map((v) => (
                      <SelectItem value={v} key={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SettingItem>

            {/* <SettingItem title={Locale.Settings.Lang.Name}>
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
            </SettingItem> */}

            <SettingItem
              title="附带历史消息数"
              subTitle="每次请求携带的历史消息数"
            >
              <Slider
                title={`${config.chat_contexts_count}px`}
                defaultValue={[config.chat_contexts_count]}
                min={0}
                max={10}
                step={1}
                className="w-64"
                onValueChange={(value) =>
                  updateConfig(
                    (config) =>
                      (config.chat_contexts_count = Number.parseInt(value[0])),
                    user.id,
                    {
                      key: "chat_contexts_count",
                      value: Number.parseInt(value[0]),
                    }
                  )
                }
              ></Slider>
            </SettingItem>

            <SettingItem title="字体大小" subTitle="聊天内容的字体大小">
              <Slider
                title={`${config.chat_font_size ?? 14}px`}
                defaultValue={[config.chat_font_size]}
                min={12}
                max={18}
                step={1}
                className="w-64"
                onValueChange={(value) =>
                  updateConfig(
                    (config) =>
                      (config.chat_font_size = Number.parseInt(value[0])),
                    user.id,
                    { key: "chat_font_size", value: value[0] }
                  )
                }
              ></Slider>
            </SettingItem>

            <SettingItem title="无边框模式">
              <Checkbox
                checked={config.no_border}
                onCheckedChange={(value) =>
                  updateConfig(
                    (config) => (config.no_border = value),
                    user.id,
                    { key: "no_border", value: value }
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
