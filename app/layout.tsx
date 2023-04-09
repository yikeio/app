/* eslint-disable @next/next/no-page-custom-font */
import "./styles/globals.scss";
import "./styles/markdown.scss";
import "./styles/highlight.scss";
import process from "child_process";

let COMMIT_ID: string | undefined;
try {
  COMMIT_ID = process
    // .execSync("git describe --tags --abbrev=0")
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();
} catch (e) {
  console.error("No git or not from git repo.");
}

export const metadata = {
  title: "Yike Chat",
  description: "Your personal ChatGPT Chat Bot.",
  appleWebApp: {
    title: "Yike Chat",
    statusBarStyle: "black-translucent",
  },
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        ></link>
        <script src="/serviceWorkerRegister.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
