import { useEffect, useState } from "react"
import { AuthToken, getToken, getTokenViaSms } from "@/api/auth"
import { User, getAuthUser } from "@/api/user"
import Cookies from "js-cookie"

export default function useAuth() {
  const AUTH_TOKEN_KEY = "auth.token"
  const AUTH_USER_KEY = "auth.user"

  let [user, setUser] = useState<User>(null)

  const redirectToLogin = () => {
    window.location.href = "/auth/login"
  }

  const isLogged = () => {
    return !!Cookies.get(AUTH_TOKEN_KEY)
  }

  const getUser = async (): Promise<User> => {
    if (!isLogged()) {
      return null
    }

    const cache = localStorage.getItem(AUTH_USER_KEY)

    if (!cache) {
      await refreshAuthUser()
    } else {
      setUser(JSON.parse(cache))
    }

    return user
  }

  const refreshAuthUser = async (): Promise<User> => {
    const res = await getAuthUser()

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res))
    setUser(res)

    return user
  }

  const handleOauthCallback = async (
    code: string,
    state: string
  ): Promise<User> => {
    const token = await getToken(code, state)

    if (!token.value) {
      throw new Error(JSON.stringify(token))
    }

    saveToken(token)

    return await refreshAuthUser()
  }

  const handleLoginViaSms = async (phoneNumber, code): Promise<User> => {
    const params = { phoneNumber: `+86:${phoneNumber}`, code }
    const token = await getTokenViaSms(params)

    if (!token.value) {
      throw new Error(JSON.stringify(token))
    }

    saveToken(token)

    return await refreshAuthUser()
  }

  const saveToken = (token: {
    value: string
    expires_at: string
  }): AuthToken => {
    Cookies.set(AUTH_TOKEN_KEY, token.value, {
      expires: new Date(token.expires_at),
    })

    return token
  }

  const logout = () => {
    Cookies.remove(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setUser(null)
  }

  useEffect(() => {
    getUser()
  }, [])

  return {
    user,
    refreshAuthUser,
    redirectToLogin,
    handleOauthCallback,
    handleLoginViaSms,
    logout,
    get isLogged() {
      return isLogged()
    },
  }
}
