<!--
NB: Deze README is automatisch gegenereerd door <https://github.com/YunoHost/apps/tree/master/tools/readme_generator>
Hij mag NIET handmatig aangepast worden.
-->

# Rocket.Chat voor Yunohost

[![Integratieniveau](https://apps.yunohost.org/badge/integration/rocketchat)](https://ci-apps.yunohost.org/ci/apps/rocketchat/)
![Mate van functioneren](https://apps.yunohost.org/badge/state/rocketchat)
![Onderhoudsstatus](https://apps.yunohost.org/badge/maintained/rocketchat)

[![Rocket.Chat met Yunohost installeren](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

*[Deze README in een andere taal lezen.](./ALL_README.md)*

> *Met dit pakket kun je Rocket.Chat snel en eenvoudig op een YunoHost-server installeren.*  
> *Als je nog geen YunoHost hebt, lees dan [de installatiehandleiding](https://yunohost.org/install), om te zien hoe je 'm installeert.*

## Overzicht

Rocket.Chat is an open-source fully customizable communications platform developed in JavaScript for organizations with high standards of data protection.

### Features

- End to End Encryption
- Multifactor Authentication
- Customizable User Permission
- Mobile Apps for [iOS](https://apps.apple.com/app/rocket-chat/id1148741252) and [Android](https://play.google.com/store/apps/details?id=chat.rocket.android)
- Desktop Apps for [macOS](https://apps.apple.com/br/app/rocket-chat/id1086818840), [Linux](https://snapcraft.io/rocketchat-desktop) and [Windows](https://releases.rocket.chat/desktop/latest/download)

**Geleverde versie:** 7.3.0~ynh2

**Demo:** <https://cloud.rocket.chat/trial>

## Schermafdrukken

![Schermafdrukken van Rocket.Chat](./doc/screenshots/screenshot.jpg)

## :red_circle: Anti-eigenschappen

- **Not totally free upstream**: The packaged app is under an overall free license, but with clauses that may restrict its use.

## Documentatie en bronnen

- Officiele website van de app: <https://rocket.chat/>
- Officiele gebruikersdocumentatie: <https://docs.rocket.chat/guides/user-guides>
- Officiele beheerdersdocumentatie: <https://docs.rocket.chat/>
- Upstream app codedepot: <https://github.com/RocketChat/Rocket.Chat>
- YunoHost-store: <https://apps.yunohost.org/app/rocketchat>
- Meld een bug: <https://github.com/YunoHost-Apps/rocketchat_ynh/issues>

## Ontwikkelaarsinformatie

Stuur je pull request alsjeblieft naar de [`testing`-branch](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing).

Om de `testing`-branch uit te proberen, ga als volgt te werk:

```bash
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
of
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```

**Verdere informatie over app-packaging:** <https://yunohost.org/packaging_apps>
