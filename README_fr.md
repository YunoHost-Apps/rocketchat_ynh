<!--
Nota bene : ce README est automatiquement généré par <https://github.com/YunoHost/apps/tree/master/tools/readme_generator>
Il NE doit PAS être modifié à la main.
-->

# Rocket.Chat pour YunoHost

[![Niveau d’intégration](https://apps.yunohost.org/badge/integration/rocketchat)](https://ci-apps.yunohost.org/ci/apps/rocketchat/)
![Statut du fonctionnement](https://apps.yunohost.org/badge/state/rocketchat)
![Statut de maintenance](https://apps.yunohost.org/badge/maintained/rocketchat)

[![Installer Rocket.Chat avec YunoHost](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

*[Lire le README dans d'autres langues.](./ALL_README.md)*

> *Ce package vous permet d’installer Rocket.Chat rapidement et simplement sur un serveur YunoHost.*  
> *Si vous n’avez pas YunoHost, consultez [ce guide](https://yunohost.org/install) pour savoir comment l’installer et en profiter.*

## Vue d’ensemble

Rocket.Chat est une plate-forme de communication open source entièrement personnalisable développée en JavaScript pour les organisations avec des normes élevées de protection des données.

### Fonctionnalités

- Chiffrement de bout en bout
- Authentification multifacteur
- Autorisation utilisateur personnalisable
- Applications mobiles pour [iOS](https://apps.apple.com/app/rocket-chat/id1148741252) et [Android](https://play.google.com/store/apps/details?id=chat.rocket.android)
- Applications de bureau pour [macOS](https://apps.apple.com/br/app/rocket-chat/id1086818840), [Linux](https://snapcraft.io/rocketchat-desktop) et [Windows](https://releases.rocket.chat/desktop/latest/download)

**Version incluse :** 7.3.0~ynh1

**Démo :** <https://cloud.rocket.chat/trial>

## Captures d’écran

![Capture d’écran de Rocket.Chat](./doc/screenshots/screenshot.jpg)

## :red_circle: Anti-fonctionnalités

- **Application sous licence libre restreinte **: L'application packagée est sous une licence globalement libre, mais avec des clauses qui pourraient restreindre son utilisation.

## Documentations et ressources

- Site officiel de l’app : <https://rocket.chat/>
- Documentation officielle utilisateur : <https://docs.rocket.chat/guides/user-guides>
- Documentation officielle de l’admin : <https://docs.rocket.chat/>
- Dépôt de code officiel de l’app : <https://github.com/RocketChat/Rocket.Chat>
- YunoHost Store : <https://apps.yunohost.org/app/rocketchat>
- Signaler un bug : <https://github.com/YunoHost-Apps/rocketchat_ynh/issues>

## Informations pour les développeurs

Merci de faire vos pull request sur la [branche `testing`](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing).

Pour essayer la branche `testing`, procédez comme suit :

```bash
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
ou
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```

**Plus d’infos sur le packaging d’applications :** <https://yunohost.org/packaging_apps>
