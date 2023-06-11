import ChromeIcon from "@/icons/chrome.svg"
import EdgeIcon from "@/icons/edge.svg"
import FirefoxIcon from "@/icons/firefox.svg"
import SafariIcon from "@/icons/safari.svg"

export default function HomeDownload() {
  return (
    <>
      <a name="download"></a>
      <div className="flex flex-col gap-4 rounded-xl border-2 border-primary p-6 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <h2>支持主流浏览器</h2>
          <div className="text-muted-foreground">
            您可以非常方便的在各个设备上直接使用，
            <br />
            旨在随时随地享受 AI 带来的生产力提升。
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-6">
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-4">
              <ChromeIcon className="h-12" />
              <div>Chrome</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-4">
              <SafariIcon className="h-12" />
              <div>Safari</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-4">
              <FirefoxIcon className="h-12" />
              <div>Firefox</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-4">
              <EdgeIcon className="h-12" />
              <div>Edge</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
