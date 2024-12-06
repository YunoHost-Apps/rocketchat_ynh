<!--
N.B.: README ini dibuat secara otomatis oleh <https://github.com/YunoHost/apps/tree/master/tools/readme_generator>
Ini TIDAK boleh diedit dengan tangan.
-->

# Rocket.Chat untuk YunoHost

[![Tingkat integrasi](https://dash.yunohost.org/integration/rocketchat.svg)](https://ci-apps.yunohost.org/ci/apps/rocketchat/) ![Status kerja](https://ci-apps.yunohost.org/ci/badges/rocketchat.status.svg) ![Status pemeliharaan](https://ci-apps.yunohost.org/ci/badges/rocketchat.maintain.svg)

[![Pasang Rocket.Chat dengan YunoHost](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

_[Baca README ini dengan bahasa yang lain.](./ALL_README.md)_

> _Paket ini memperbolehkan Anda untuk memasang Rocket.Chat secara cepat dan mudah pada server YunoHost._  
> _Bila Anda tidak mempunyai YunoHost, silakan berkonsultasi dengan [panduan](https://yunohost.org/install) untuk mempelajari bagaimana untuk memasangnya._

## Ringkasan

Rocket.Chat is an open-source fully customizable communications platform developed in JavaScript for organizations with high standards of data protection.

### Features

- End to End Encryption
- Multifactor Authentication
- Customizable User Permission
- Mobile Apps for [iOS](https://apps.apple.com/app/rocket-chat/id1148741252) and [Android](https://play.google.com/store/apps/details?id=chat.rocket.android)
- Desktop Apps for [macOS](https://apps.apple.com/br/app/rocket-chat/id1086818840), [Linux](https://snapcraft.io/rocketchat-desktop) and [Windows](https://releases.rocket.chat/desktop/latest/download)

**Versi terkirim:** 7.1.0~ynh1

**Demo:** <https://cloud.rocket.chat/trial>

## Tangkapan Layar

![Tangkapan Layar pada Rocket.Chat](./doc/screenshots/screenshot.jpg)

## :red_circle: Antifitur

- **Not totally free upstream**: The packaged app is under an overall free license, but with clauses that may restrict its use.

## Dokumentasi dan sumber daya

- Website aplikasi resmi: <https://rocket.chat/>
- Dokumentasi pengguna resmi: <https://docs.rocket.chat/guides/user-guides>
- Dokumentasi admin resmi: <https://docs.rocket.chat/>
- Depot kode aplikasi hulu: <https://github.com/RocketChat/Rocket.Chat>
- Gudang YunoHost: <https://apps.yunohost.org/app/rocketchat>
- Laporkan bug: <https://github.com/YunoHost-Apps/rocketchat_ynh/issues>

## Info developer

Silakan kirim pull request ke [`testing` branch](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing).

Untuk mencoba branch `testing`, silakan dilanjutkan seperti:

```bash
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
atau
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```

**Info lebih lanjut mengenai pemaketan aplikasi:** <https://yunohost.org/packaging_apps>
