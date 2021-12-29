# RocketChat pour YunoHost

[![Niveau d'intégration](https://dash.yunohost.org/integration/rocketchat.svg)](https://dash.yunohost.org/appci/app/rocketchat) ![](https://ci-apps.yunohost.org/ci/badges/rocketchat.status.svg) ![](https://ci-apps.yunohost.org/ci/badges/rocketchat.maintain.svg)  
[![Installer RocketChat avec YunoHost](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

*[Read this readme in english.](./README.md)*
*[Lire ce readme en français.](./README_fr.md)*

> *Ce package vous permet d'installer RocketChat rapidement et simplement sur un serveur YunoHost.
Si vous n'avez pas YunoHost, regardez [ici](https://yunohost.org/#/install) pour savoir comment l'installer et en profiter.*

## Vue d'ensemble

Rocket.Chat est une plate-forme de communication open source entièrement personnalisable développée en JavaScript pour les organisations avec des normes élevées de protection des données. 

**Version incluse :** 4.3.0~ynh1

**Démo :** https://cloud.rocket.chat/trial

## Captures d'écran

![](./doc/screenshots/screenshot.jpg)

## Documentations et ressources

* Site officiel de l'app : https://rocket.chat/
* Documentation officielle de l'admin : https://docs.rocket.chat/
* Dépôt de code officiel de l'app : https://github.com/RocketChat/Rocket.Chat
* Documentation YunoHost pour cette app : https://yunohost.org/app_rocketchat
* Signaler un bug : https://github.com/YunoHost-Apps/rocketchat_ynh/issues

## Informations pour les développeurs

Merci de faire vos pull request sur la [branche testing](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing).

Pour essayer la branche testing, procédez comme suit.
```
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
ou
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```

**Plus d'infos sur le packaging d'applications :** https://yunohost.org/packaging_apps