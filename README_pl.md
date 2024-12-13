<!--
To README zostało automatycznie wygenerowane przez <https://github.com/YunoHost/apps/tree/master/tools/readme_generator>
Nie powinno być ono edytowane ręcznie.
-->

# Rocket.Chat dla YunoHost

[![Poziom integracji](https://apps.yunohost.org/badge/integration/rocketchat)](https://ci-apps.yunohost.org/ci/apps/rocketchat/)
![Status działania](https://apps.yunohost.org/badge/state/rocketchat)
![Status utrzymania](https://apps.yunohost.org/badge/maintained/rocketchat)

[![Zainstaluj Rocket.Chat z YunoHost](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

*[Przeczytaj plik README w innym języku.](./ALL_README.md)*

> *Ta aplikacja pozwala na szybką i prostą instalację Rocket.Chat na serwerze YunoHost.*  
> *Jeżeli nie masz YunoHost zapoznaj się z [poradnikiem](https://yunohost.org/install) instalacji.*

## Przegląd

Rocket.Chat is an open-source fully customizable communications platform developed in JavaScript for organizations with high standards of data protection.

### Features

- End to End Encryption
- Multifactor Authentication
- Customizable User Permission
- Mobile Apps for [iOS](https://apps.apple.com/app/rocket-chat/id1148741252) and [Android](https://play.google.com/store/apps/details?id=chat.rocket.android)
- Desktop Apps for [macOS](https://apps.apple.com/br/app/rocket-chat/id1086818840), [Linux](https://snapcraft.io/rocketchat-desktop) and [Windows](https://releases.rocket.chat/desktop/latest/download)

**Dostarczona wersja:** 7.1.0~ynh1

**Demo:** <https://cloud.rocket.chat/trial>

## Zrzuty ekranu

![Zrzut ekranu z Rocket.Chat](./doc/screenshots/screenshot.jpg)

## :red_circle: Niepożądane funkcje

- **Not totally free upstream**: The packaged app is under an overall free license, but with clauses that may restrict its use.

## Dokumentacja i zasoby

- Oficjalna strona aplikacji: <https://rocket.chat/>
- Oficjalna dokumentacja: <https://docs.rocket.chat/guides/user-guides>
- Oficjalna dokumentacja dla administratora: <https://docs.rocket.chat/>
- Repozytorium z kodem źródłowym: <https://github.com/RocketChat/Rocket.Chat>
- Sklep YunoHost: <https://apps.yunohost.org/app/rocketchat>
- Zgłaszanie błędów: <https://github.com/YunoHost-Apps/rocketchat_ynh/issues>

## Informacje od twórców

Wyślij swój pull request do [gałęzi `testing`](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing).

Aby wypróbować gałąź `testing` postępuj zgodnie z instrukcjami:

```bash
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
lub
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```

**Więcej informacji o tworzeniu paczek aplikacji:** <https://yunohost.org/packaging_apps>
