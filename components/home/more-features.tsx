import {
  HeartIcon,
  KeyboardIcon,
  LanguagesIcon,
  MicIcon,
  MonitorSmartphoneIcon,
  Share2Icon,
  TypeIcon,
  Volume2Icon,
} from "lucide-react"

export default function HomeMoreFeatures() {
  const features = [
    { name: "语言翻译", description: "支持中英文互译，更多语言正在开发中。", icon: <LanguagesIcon /> },
    { name: "消息收藏", description: "您可以随时收藏喜欢的消息内容，以便于随时回顾。", icon: <HeartIcon /> },
    { name: "内容阅读", description: "支持将回复内容以语音播报的形式播放。", icon: <Volume2Icon /> },
    { name: "语音输入", description: "不想打字，没关系，可以直接使用语音来完成输入。", icon: <MicIcon /> },
    { name: "快捷键", description: "支持快捷键，可以更加方便快捷完成各种操作。", icon: <KeyboardIcon /> },
    { name: "字号调整", description: "支持字号调整，满足不同用户的需求。", icon: <TypeIcon /> },
    {
      name: "内容导出",
      description: "支持将消息内容导出为多种格式文件，方便您随时查阅和分享。",
      icon: <Share2Icon />,
    },
    {
      name: "多端同步",
      description: "支持多端同步，随时随地享受 AI 带来的生产力提升。",
      icon: <MonitorSmartphoneIcon />,
    },
  ]
  return (
    <div className="flex flex-col gap-20 rounded-xl ">
      <div className="flex flex-col gap-6 text-center">
        <h2 className="text-3xl lg:text-5xl">更多功能</h2>
        <div className="text-muted-foreground">我们正在持续完善打磨产品，努力提供一个更完善的生产力工具。</div>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex flex-col items-center justify-center gap-4 rounded-xl border border-primary-200 bg-primary-100 p-6 hover:border-primary-300 hover:shadow-sm dark:border-primary dark:bg-muted dark:hover:border-primary-500"
            >
              <div className="flex items-center justify-center rounded-full border border-primary p-4 text-primary">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-4 text-center">
                <div className="font-bold">{feature.name}</div>
                <div className="text-sm text-muted-foreground">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
