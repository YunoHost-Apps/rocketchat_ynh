<!--
Este archivo README esta generado automaticamente<https://github.com/YunoHost/apps/tree/master/tools/readme_generator>
No se debe editar a mano.
-->

# Rocket.Chat para Yunohost

[![Nivel de integración](https://dash.yunohost.org/integration/rocketchat.svg)](https://ci-apps.yunohost.org/ci/apps/rocketchat/) ![Estado funcional](https://ci-apps.yunohost.org/ci/badges/rocketchat.status.svg) ![Estado En Mantención](https://ci-apps.yunohost.org/ci/badges/rocketchat.maintain.svg)

[![Instalar Rocket.Chat con Yunhost](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

*[Leer este README en otros idiomas.](./ALL_README.md)*

> *Este paquete le permite instalarRocket.Chat rapidamente y simplement en un servidor YunoHost.*  
> *Si no tiene YunoHost, visita [the guide](https://yunohost.org/install) para aprender como instalarla.*

## Descripción general

Rocket.Chat is an open-source fully customizable communications platform developed in JavaScript for organizations with high standards of data protection.

### Features

- End to End Encryption
- Multifactor Authentication
- Customizable User Permission
- Mobile Apps for [iOS](https://apps.apple.com/app/rocket-chat/id1148741252) and [Android](https://play.google.com/store/apps/details?id=chat.rocket.android)
- Desktop Apps for [macOS](https://apps.apple.com/br/app/rocket-chat/id1086818840), [Linux](https://snapcraft.io/rocketchat-desktop) and [Windows](https://releases.rocket.chat/desktop/latest/download)

**Versión actual:** 6.11.1~ynh1

**Demo:** <https://cloud.rocket.chat/trial>

## Capturas

![Captura de Rocket.Chat](./doc/screenshots/screenshot.jpg)

## :red_circle: Características no deseables

- **Not totally free upstream**: The packaged app is under an overall free license, but with clauses that may restrict its use.

## Documentaciones y recursos

- Sitio web oficial: <https://rocket.chat/>
- Documentación usuario oficial: <https://docs.rocket.chat/guides/user-guides>
- Documentación administrador oficial: <https://docs.rocket.chat/>
- Repositorio del código fuente oficial de la aplicación : <https://github.com/RocketChat/Rocket.Chat>
- Catálogo YunoHost: <https://apps.yunohost.org/app/rocketchat>
- Reportar un error: <https://github.com/YunoHost-Apps/rocketchat_ynh/issues>

## Información para desarrolladores

Por favor enviar sus correcciones a la [`branch testing`](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing

Para probar la rama `testing`, sigue asÍ:

```bash
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
o
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```

**Mas informaciones sobre el empaquetado de aplicaciones:** <https://yunohost.org/packaging_apps>
