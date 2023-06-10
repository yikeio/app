import { useEffect, useState } from "react"
import useSettings, { SubmitKey } from "@/hooks/use-settings"
import { toast } from "react-hot-toast"

import Head from "@/components/head"
import { Layout } from "@/components/layout"
import Loading from "@/components/loading"
import { Card } from "@/components/ui/card"
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
  const { settings: serverSettings, isLoading, updateSetting } = useSettings()
  const [settings, setSettings] = useState<Record<string, string | number>>(serverSettings)

  const handleUpdateItem = async (key: string, value: string | number) => {
    setSettings({ ...settings, [key]: value })
    await updateSetting(key, value)
    toast.success("设置已保存")
  }

  useEffect(() => {
    if (isLoading) {
      return
    }
    setSettings(serverSettings)
  }, [isLoading, serverSettings])

  if (!settings) {
    return <Loading />
  }

  return (
    <Layout>
      <Head title="设置" />
      <div className="flex-1">
        <section className="max-w-5xl p-4 md:p-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">设置</div>
          </div>
          <Card className="mt-4 flex-1 space-y-6 rounded-lg border bg-white p-3 shadow-sm md:p-6">
            <div className="flex flex-col divide-y rounded-lg">
              <SettingItem title="发送键">
                <div className="w-32">
                  <Select
                    value={settings.chat_submit_key as string}
                    onValueChange={(value) => {
                      handleUpdateItem("chat_submit_key", value)
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

              <SettingItem
                title="附带历史消息数"
                subTitle="每次请求携带的历史消息数，数量越多回答越精准，但使用的 token 也将会越多"
              >
                <div className="flex items-center gap-4">
                  <Slider
                    title={`${settings.chat_contexts_count}px`}
                    defaultValue={[settings.chat_contexts_count as number]}
                    min={0}
                    max={10}
                    step={1}
                    className="w-64"
                    onValueChange={(value) => handleUpdateItem("chat_contexts_count", value[0])}
                  ></Slider>
                  {settings.chat_contexts_count}
                </div>
              </SettingItem>

              <SettingItem title="字体大小" subTitle="聊天内容的字体大小">
                <div className="flex items-center gap-4">
                  <Slider
                    title={`${settings.chat_font_size ?? 14}px`}
                    defaultValue={[settings.chat_font_size as number]}
                    min={12}
                    max={18}
                    step={1}
                    className="w-64"
                    onValueChange={(value) => handleUpdateItem("chat_font_size", value[0])}
                  ></Slider>
                  {settings.chat_font_size}px
                </div>
              </SettingItem>
            </div>
          </Card>
        </section>
      </div>
    </Layout>
  )
}
