# RocketChat for YunoHost

[![Integration level](https://dash.yunohost.org/integration/rocketchat.svg)](https://dash.yunohost.org/appci/app/rocketchat) ![](https://ci-apps.yunohost.org/ci/badges/rocketchat.status.svg) ![](https://ci-apps.yunohost.org/ci/badges/rocketchat.maintain.svg)  
[![Install rocketchat with YunoHost](https://install-app.yunohost.org/install-with-yunohost.svg)](https://install-app.yunohost.org/?app=rocketchat)

*[Lire ce readme en français.](./README_fr.md)*

> *This package allows you to install rocketchat quickly and simply on a YunoHost server.  
If you don't have YunoHost, please consult [the guide](https://yunohost.org/#/install) to learn how to install it.*

## Overview
Quick description of this app.

**Shipped version:** 3.12.0

## Screenshots

![](Link to a screenshot of this app.)

## Demo

* [Official demo](Link to a demo site for this app.)

## Configuration

How to configure this app: From an admin panel, a plain file with SSH, or any other way.

## Documentation

 * Official documentation: Link to the official documentation of this app
 * YunoHost documentation: If specific documentation is needed, feel free to contribute.

## YunoHost specific features

#### Multi-user support

Are LDAP and HTTP auth supported?
Can the app be used by multiple users?

#### Supported architectures

* x86-64 - [![Build Status](https://ci-apps.yunohost.org/ci/logs/rocketchat%20%28Apps%29.svg)](https://ci-apps.yunohost.org/ci/apps/rocketchat/)
* ARMv8-A - [![Build Status](https://ci-apps-arm.yunohost.org/ci/logs/rocketchat%20%28Apps%29.svg)](https://ci-apps-arm.yunohost.org/ci/apps/rocketchat/)

## Limitations

* Any known limitations.

## Additional information

* Other info you would like to add about this app.

#### Supported architectures

* x86-64b - [![](https://ci-apps.yunohost.org/ci/logs/rocketchat%20%28Community%29.svg)](https://ci-apps.yunohost.org/ci/apps/rocketchat/)
* ARMv8-A - [![](https://ci-apps-arm.yunohost.org/ci/logs/rocketchat%20%28Community%29.svg)](https://ci-apps-arm.yunohost.org/ci/apps/rocketchat/)
* Jessie x86-64b - [![](https://ci-stretch.nohost.me/ci/logs/rocketchat%20%28Community%29.svg)](https://ci-stretch.nohost.me/ci/apps/rocketchat/)

## Links

 * Report a bug: https://github.com/YunoHost-Apps/rocketchat_ynh/issues
 * App website: https://rocket.chat/
 * Upstream app repository: https://github.com/RocketChat/Rocket.Chat
 * YunoHost website: https://yunohost.org/

---

## Developer info

Please send your pull request to the [testing branch](https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing).

To try the testing branch, please proceed like that.
```
sudo yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
or
sudo yunohost app upgrade rocketchat -u https://github.com/YunoHost-Apps/rocketchat_ynh/tree/testing --debug
```
