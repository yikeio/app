import { useTheme } from "next-themes"

export default function HomeShowcaseImages() {
  const { theme } = useTheme()

  return (
    <div id="showcase-images" className="relative mx-auto py-6 lg:py-12">
      <div className="overflow-hidden rounded-xl border-2 border-primary-600 shadow-xl">
        <img src={`/home/showcases/prompt-${theme === "light" ? "light" : "dark"}.png`} alt="" />
      </div>
    </div>
  )
}
