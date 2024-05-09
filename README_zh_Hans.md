<!--
注意：此 README 由 <https://github.com/YunoHost/apps/tree/master/tools/readme_generator> 自动生成
请勿手动编辑。
-->

# YunoHost 上的 Rocket.Chat

[![集成程度](https://dash.yunohost.org/integration/rocketchat.svg)](https://dash.yunohost.org/appci/app/rocketchat) ![工作状态](https://ci-apps.yunohost.org/ci/badges/rocketchat.status.svg) ![维护状态](https://ci-apps.yunohost.org/ci/badges/rocketchat.maintain.svg)

[![使用 YunoHost 安装 Rocket.Chat](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

*[阅读此 README 的其它语言版本。](./ALL_README.md)*

> *通过此软件包，您可以在 YunoHost 服务器上快速、简单地安装 Rocket.Chat。*  
> *如果您还没有 YunoHost，请参阅[指南](https://yunohost.org/install)了解如何安装它。*

## 概况

Rocket.Chat is an open-source fully customizable communications platform developed in JavaScript for organizations with high standards of data protection.

### Features

- End to End Encryption
- Multifactor Authentication
- Customizable User Permission
- Mobile Apps for [iOS](https://apps.apple.com/app/rocket-chat/id1148741252) and [Android](https://play.google.com/store/apps/details?id=chat.rocket.android)
- Desktop Apps for [macOS](https://apps.apple.com/br/app/rocket-chat/id1086818840), [Linux](https://snapcraft.io/rocketchat-desktop) and [Windows](https://releases.rocket.chat/desktop/latest/download)

**分发版本：** 6.7.2~ynh1

**演示：** <https://cloud.rocket.chat/trial>

## 截图

![Rocket.Chat 的截图](./doc/screenshots/screenshot.jpg)

## :red_circle: 负面特征

- **Not totally free upstream**: The packaged app is under an overall free license, but with clauses that may restrict its use.

## 文档与资源

- 官方应用网站： <https://rocket.chat/>
- 官方用户文档： <https://docs.rocket.chat/guides/user-guides>
- 官方管理文档： <https://docs.rocket.chat/>
- 上游应用代码库： <https://github.com/RocketChat/Rocket.Chat>
- YunoHost 商店： <https://apps.yunohost.org/app/rocketchat>
- 报告 bug： <https://github.com/YunoHost-Apps/rocketchat_ynh/issues>

## 开发者信息

请向 [`testing` 分支](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing) 发送拉取请求。

如要尝试 `testing` 分支，请这样操作：

```bash
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
或
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```

**有关应用打包的更多信息：** <https://yunohost.org/packaging_apps>
