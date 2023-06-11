import ChromeIcon from "@/icons/chrome.svg"
import EdgeIcon from "@/icons/edge.svg"
import FirefoxIcon from "@/icons/firefox.svg"

export default function HomeDownload() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border-2 border-primary p-6 lg:flex-row lg:items-center lg:justify-between lg:p-12">
      <a name="download"></a>
      <div className="flex flex-col gap-6 text-center lg:text-left">
        <h2>支持主流浏览器</h2>
        <div>您可以非常方便的在各个设备上直接使用，旨在随时随地享受 AI 带来的生产力提升。</div>
      </div>
      <div>
        <div className="grid grid-cols-3 gap-3 lg:gap-6">
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-4">
            <ChromeIcon />
            <div>Chrome</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-4">
            <EdgeIcon />
            <div>Edge</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-4">
            <FirefoxIcon />
            <div>Firefox</div>
          </div>
        </div>
      </div>
    </div>
  )
}
