<!--
N.B.: This README was automatically generated by https://github.com/YunoHost/apps/tree/master/tools/README-generator
It shall NOT be edited by hand.
-->

# RocketChat for YunoHost

[![Integration level](https://dash.yunohost.org/integration/rocketchat.svg)](https://dash.yunohost.org/appci/app/rocketchat) ![](https://ci-apps.yunohost.org/ci/badges/rocketchat.status.svg) ![](https://ci-apps.yunohost.org/ci/badges/rocketchat.maintain.svg)  
[![Install RocketChat with YunoHost](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

*[Lire ce readme en français.](./README_fr.md)*

> *This package allows you to install RocketChat quickly and simply on a YunoHost server.
If you don't have YunoHost, please consult [the guide](https://yunohost.org/#/install) to learn how to install it.*

## Overview

Rocket.Chat is an open-source fully customizable communications platform developed in JavaScript for organizations with high standards of data protection.


**Shipped version:** 4.4.0~ynh1

**Demo:** https://cloud.rocket.chat/trial

## Screenshots

![](./doc/screenshots/screenshot.jpg)

## Disclaimers / important information

### E-mail Configuration

To enable E-mail for address verification, go to Rocketchat Administration panel under E-mail -> SMTP and set as follow:

- Protocole: smtp
- Host: localhost
- Port: 25
- From -mail: rocketchat@domain.tld

### Configure and activate federation for Rocketchat

https://support.indie.host/help/fr-fr/13/40

## Documentation and resources

* Official app website: https://rocket.chat/
* Official user documentation: https://docs.rocket.chat/guides/user-guides
* Official admin documentation: https://docs.rocket.chat/
* Upstream app code repository: https://github.com/RocketChat/Rocket.Chat
* YunoHost documentation for this app: https://yunohost.org/app_rocketchat
* Report a bug: https://github.com/YunoHost-Apps/rocketchat_ynh/issues

## Developer info

Please send your pull request to the [testing branch](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing).

To try the testing branch, please proceed like that.
```
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
or
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```

**More info regarding app packaging:** https://yunohost.org/packaging_apps