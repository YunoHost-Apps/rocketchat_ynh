<!--
Ohart ongi: README hau automatikoki sortu da <https://github.com/YunoHost/apps/tree/master/tools/readme_generator>ri esker
EZ editatu eskuz.
-->

# Rocket.Chat YunoHost-erako

[![Integrazio maila](https://dash.yunohost.org/integration/rocketchat.svg)](https://dash.yunohost.org/appci/app/rocketchat) ![Funtzionamendu egoera](https://ci-apps.yunohost.org/ci/badges/rocketchat.status.svg) ![Mantentze egoera](https://ci-apps.yunohost.org/ci/badges/rocketchat.maintain.svg)

[![Instalatu Rocket.Chat YunoHost-ekin](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

*[Irakurri README hau beste hizkuntzatan.](./ALL_README.md)*

> *Pakete honek Rocket.Chat YunoHost zerbitzari batean azkar eta zailtasunik gabe instalatzea ahalbidetzen dizu.*  
> *YunoHost ez baduzu, kontsultatu [gida](https://yunohost.org/install) nola instalatu ikasteko.*

## Aurreikuspena

Rocket.Chat is an open-source fully customizable communications platform developed in JavaScript for organizations with high standards of data protection.

### Features

- End to End Encryption
- Multifactor Authentication
- Customizable User Permission
- Mobile Apps for [iOS](https://apps.apple.com/app/rocket-chat/id1148741252) and [Android](https://play.google.com/store/apps/details?id=chat.rocket.android)
- Desktop Apps for [macOS](https://apps.apple.com/br/app/rocket-chat/id1086818840), [Linux](https://snapcraft.io/rocketchat-desktop) and [Windows](https://releases.rocket.chat/desktop/latest/download)

**Paketatutako bertsioa:** 6.9.0~ynh1

**Demoa:** <https://cloud.rocket.chat/trial>

## Pantaila-argazkiak

![Rocket.Chat(r)en pantaila-argazkia](./doc/screenshots/screenshot.jpg)

## :red_circle: Ezaugarri zalantzagarriak

- **Jatorrizkoa ez da erabat librea**: Aplikazioak lizentzia librea du orokorrean, baina bere erabilera mugatzen duten klausulekin.

## Dokumentazioa eta baliabideak

- Aplikazioaren webgune ofiziala: <https://rocket.chat/>
- Erabiltzaileen dokumentazio ofiziala: <https://docs.rocket.chat/guides/user-guides>
- Administratzaileen dokumentazio ofiziala: <https://docs.rocket.chat/>
- Jatorrizko aplikazioaren kode-gordailua: <https://github.com/RocketChat/Rocket.Chat>
- YunoHost Denda: <https://apps.yunohost.org/app/rocketchat>
- Eman errore baten berri: <https://github.com/YunoHost-Apps/rocketchat_ynh/issues>

## Garatzaileentzako informazioa

Bidali `pull request`a [`testing` abarrera](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing).

`testing` abarra probatzeko, ondorengoa egin:

```bash
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
edo
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```

**Informazio gehiago aplikazioaren paketatzeari buruz:** <https://yunohost.org/packaging_apps>
