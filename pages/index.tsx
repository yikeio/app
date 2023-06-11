import HomeChatFeatures from "@/components/home/chat-features"
import HomeDownload from "@/components/home/download"
import HomeFooter from "@/components/home/footer"
import HomeHeading from "@/components/home/heading"
import HomeJumbotron from "@/components/home/jumbotron"
import HomeMoreFeatures from "@/components/home/more-features"
import HomePricing from "@/components/home/pricing"
import HomeShowcaseImages from "@/components/home/showcase-images"

export default function IndexPage() {
  return (
    <div className="bg-gradient-to-b from-primary-500/20 from-[1%] via-primary-400/20 via-[30%] to-100% dark:from-primary-600/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-12 lg:gap-32 lg:px-0">
        <HomeHeading />
        <HomeJumbotron />
        <HomeShowcaseImages />
        <HomeChatFeatures />
        <HomeMoreFeatures />
        <HomePricing />
        <HomeDownload />
        <HomeFooter />
      </div>
    </div>
  )
}
