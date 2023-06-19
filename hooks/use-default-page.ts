import useLocalStorage from "./use-localstorage"

export default function useDefaultPage() {
  const [defaultPage, setDefaultPage] = useLocalStorage("app.default_page", "/")

  return {
    defaultPage,
    setDefaultPage,
  }
}
