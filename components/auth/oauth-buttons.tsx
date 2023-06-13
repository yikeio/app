import { useRouter } from "next/router"
import { getAuthRedirectUrl } from "@/api/auth"
import GitHubIcon from "@/icons/github.svg"
import GoogleIcon from "@/icons/google.svg"

import { Button } from "../ui/button"

export default function OAuthLoginButtons() {
  const router = useRouter()

  const handleRedirect = async (type) => {
    router.push(getAuthRedirectUrl(type))
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <Button
        className="w-full text-foreground hover:bg-muted hover:text-accent-foreground"
        variant="outline"
        size="sm"
        onClick={() => handleRedirect("github")}
      >
        <GitHubIcon className="mr-2 h-5 w-5" /> <span>GitHub</span>
      </Button>

      <Button
        className="w-full text-foreground hover:bg-muted hover:text-accent-foreground"
        variant="outline"
        size="sm"
        onClick={() => handleRedirect("google")}
      >
        <GoogleIcon className="mr-2 h-5 w-5" /> <span>Google</span>
      </Button>
    </div>
  )
}
