# common.sh

ROCKETCHAT_VERSION=0.58.4
ROCKETCHAT_SHASUM=ed53712b37571b959b5c8c8947d6335c21fced316f2b3174bfe027fa25700c44
NODE_VERSION=4.7.1

waitforservice() {
  isup=false; x=90; while [ $x -gt 0 ];do echo "Waiting approx. $x seconds..."; \
  x=$(( $x - 1 )); sleep 1; if $(curl -m 1 -s localhost:$port${path:-/}/api/v1/info | \
  grep -e "success.*true" >/dev/null 2>&1); then isup=true; break; fi; done && if $isup; \
  then echo "service is up"; else {ynh_die "$app could not be started"; fi
}

installdeps(){

  if [ $(dpkg --print-architecture) == "armhf" ]; then
    #Install mongodb for debian armhf
    sudo apt-get update
    sudo apt-get install -y mongodb-server
  else
    #Install mongodb for debian x86/x64
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
    echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
  fi

  # start mongodb service
  sudo systemctl enable mongodb.service
  sudo systemctl start mongodb.service

  # add mongodb to services
  sudo yunohost service add mongodb -l /var/log/mongodb/mongod.log

  #Install other dependencies
  sudo apt-get install -y gzip curl graphicsmagick npm

  # Meteor needs at least this version of node to work.
  sudo npm install -g n
  sudo n $NODE_VERSION
}
