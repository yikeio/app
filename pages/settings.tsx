import { useEffect } from "react"
import useAuth from "@/hooks/use-auth"
import useSettings, { SubmitKey } from "@/hooks/use-settings"

import Head from "@/components/head"
import { Layout } from "@/components/layout"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

function SettingItem(props: { title: string; subTitle?: string; children: JSX.Element }) {
  return (
    <div className="flex flex-wrap justify-between gap-4 py-6 md:items-center">
      <div>
        <Label className="text-gray-700">{props.title}</Label>
        {props.subTitle && <div className="text-sm text-gray-400">{props.subTitle}</div>}
      </div>
      {props.children}
    </div>
  )
}

export default function Setting() {
  const { settings, updateSetting } = useSettings()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <Layout>
      <Head title="设置" />
      <div className="flex-1">
        <section className="mx-auto max-w-5xl p-4 md:p-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">设置</div>
          </div>
          <div className="mt-4 flex-1 space-y-6 rounded-lg border bg-white p-3 shadow-sm md:p-6">
            <div className="flex flex-col divide-y rounded-lg">
              <SettingItem title="发送键">
                <div className="w-32">
                  <Select
                    value={settings.chat_submit_key}
                    onValueChange={(key) => {
                      updateSetting("chat_submit_key", key)
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

              <SettingItem title="附带历史消息数" subTitle="每次请求携带的历史消息数">
                <Slider
                  title={`${settings.chat_contexts_count}px`}
                  defaultValue={[settings.chat_contexts_count]}
                  min={0}
                  max={10}
                  step={1}
                  className="w-64"
                  onValueChange={(value) => updateSetting("chat_contexts_count", value[0])}
                ></Slider>
              </SettingItem>

              <SettingItem title="字体大小" subTitle="聊天内容的字体大小">
                <Slider
                  title={`${settings.chat_font_size ?? 14}px`}
                  defaultValue={[settings.chat_font_size]}
                  min={12}
                  max={18}
                  step={1}
                  className="w-64"
                  onValueChange={(value) => updateSetting("chat_font_size", value[0])}
                ></Slider>
              </SettingItem>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
