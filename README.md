# 一刻

此项目为 <https://yike.io> 前端源码，项目基于 Nextjs 13 开发完成。

> **Warning**
> 本项目当前版本出自开发者的业余时间，可能存在一些问题，如果你发现了任何问题，请提交 PR。本项目开源仅出于学习交流目的，不建议直接用于生产环境，不提供任何解答咨询服务。

## 项目源码

- [yikeio/app](https://github.com/yikeio/app) - 前端源码
- [yikeio/server](https://github.com/yikeio/server) - 服务端源码
- [yikeio/dashboard](https://github.com/yikeio/dashboard) - 管理后台源码

## 技术栈

- 使用 [shadcn/ui](https://ui.shadcn.com/) 作为组件库；
- 使用 Tailwind CSS 作为 CSS 框架；
- 使用 `@next/font` 引入 Google Fonts；
- 使用 [Lucide](https://lucide.dev) 图标；
- 使用 `next-themes` 实现主题切换；
- 使用 `@ianvs/prettier-plugin-sort-imports` 排序 import。

## 编译步骤

1. 安装依赖，本项目使用 pnpm 作为包管理器，你也可以使用 npm 或 yarn。

    ```bash
    pnpm install
    ```

    然后更新 `.env.production` 中的环境变量，或者创建一个 `.env.local` 来覆盖。

1. 启动开发服务器：

    ```bash
    pnpm dev
    ```

1. 构建项目：

    ```bash
    pnpm build
    ```

此步骤将会生成一个 `out` 目录，该目录为构建后的静态文件，你可以使用任何静态服务器来部署该目录。

> **Warning**
> 请勿直接使用 `next start` 来启动项目，因为该命令会启动一个 Node 服务器，而不是静态服务器。

## 部署

你可以使用任何静态服务器来部署该项目，例如 nginx:

```nginx
server {
    listen 80;
    server_name admin.app.com;  # Update to your domain

    root /var/www/out; # Update to your path

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    location ~* /(.*)/(\d+)$ {
        try_files $1/[id].html /$1/[id].html /index.html;
    }

    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

## 贡献

欢迎任何形式的贡献，包括但不限于提交问题、需求、功能、文档、测试用例、演示等。

## 合作

如果你希望在此项目上合作或付费技术支持，请联系我们：<anzhengchao@gmail.com>。

## 核心团队

- [@overtrue](https://github.com/overtrue) - 前端开发者，后端开发者
- [@ranpro](https://github.com/ranpro) - 后端开发者
- [@PengYYYYY](https://github.com/PengYYYYY) - 前端开发者
- [@honkinglin](https://github.com/honkinglin) - 前端开发者
- [@xixileng](https://github.com/xixileng) - 前端开发者

## License

Licensed under the [MIT license](https://github.com/yikeio/app/blob/main/LICENSE.md).
