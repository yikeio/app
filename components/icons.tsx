import IconLogo from "@/public/logo.svg"
import {
  IconBrandTelegram,
  IconCopy,
  IconDeviceLaptop,
  IconFileExport,
  IconMenu2,
  IconMessage2,
  IconMoon,
  IconPencil,
  IconPlayerStop,
  IconPlus,
  IconReload,
  IconSettings,
  IconSun,
  IconTrash,
} from "@tabler/icons-react"

export const Icons = {
  sun: IconSun,
  moon: IconMoon,
  laptop: IconDeviceLaptop,
  setting: IconSettings,
  trash: IconTrash,
  message: IconMessage2,
  fileExport: IconFileExport,
  menu: IconMenu2,
  telegram: IconBrandTelegram,
  pencil: IconPencil,
  reload: IconReload,
  copy: IconCopy,
  plus: IconPlus,
  playStop: IconPlayerStop,
  logo: (props) => <IconLogo {...props} />,
  loading: (props) => (
    <svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="15" cy="15" r="15" fill="var(--primary, red)">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="60"
        cy="15"
        r="9"
        fillOpacity="0.3"
        fill="var(--primary, red)"
      >
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0s"
          dur="0.8s"
          values="9;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="0.5"
          to="0.5"
          begin="0s"
          dur="0.8s"
          values=".5;1;.5"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="105" cy="15" r="15" fill="var(--primary, red)">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  ),
}
