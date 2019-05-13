# rocketchat_ynh

Rocketchat for yunohost

[![Integration level](https://dash.yunohost.org/integration/rocketchat.svg)](https://dash.yunohost.org/appci/app/rocketchat)  
[![Install Rocketchat with YunoHost](https://install-app.yunohost.org/install-with-yunohost.png)](https://install-app.yunohost.org/?app=rocketchat)

## Install with

You can either :

* Install from the Yunohost Admin web interface, by providing this URL: [https://github.com/YunoHost-Apps/rocketchat_ynh](https://github.com/YunoHost-Apps/rocketchat_ynh)
* Install from the command-line: `yunohost app install https://github.com/YunoHost-Apps/rocketchat_ynh`

**Please note that currently the installation does not work on raspberry pi or arm architecture in general.**

## Backup information

Backup stores:

- rocketchat app dir
- rocketchat mongodb (via mongodump)
- nginx configuration
- systemd service configuration

#### Supported architectures

* x86-64b - [![](https://ci-apps.yunohost.org/ci/logs/rocketchat%20%28Community%29.svg)](https://ci-apps.yunohost.org/ci/apps/rocketchat/)
* ARMv8-A - [![](https://ci-apps-arm.yunohost.org/ci/logs/rocketchat%20%28Community%29.svg)](https://ci-apps-arm.yunohost.org/ci/apps/rocketchat/)
* Jessie x86-64b - [![](https://ci-stretch.nohost.me/ci/logs/rocketchat%20%28Community%29.svg)](https://ci-stretch.nohost.me/ci/apps/rocketchat/)

## Links

 * Report a bug: [Issues](/../../issues)
 * Rocketchat website: https://rocket.chat/
 * YunoHost website: https://yunohost.org/
