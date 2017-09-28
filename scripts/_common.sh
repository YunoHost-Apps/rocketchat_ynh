# common.sh

ROCKETCHAT_VERSION=0.58.3
ROCKETCHAT_SHASUM=d7df5aedaa0a28bf82d6d5e9d98c5027eec92d15f270b6642d3eab09bb83e5ca
NODE_VERSION=4.7.1

waitforservice() {
  isup=false; x=90; while [ $x -gt 0 ];do echo "Waiting approx. $x seconds..."; \
  x=$(( $x - 1 )); sleep 1; if $(curl -m 1 -s localhost:$port${path:-/}/api/v1/info | \
  grep -e "success.*true" >/dev/null 2>&1); then isup=true; break; fi; done && if $isup; \
  then echo "service is up"; else {ynh_die "$app could not be started"; fi
}

installdeps(){
  #Install dependencies
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
  echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org gzip curl graphicsmagick npm

  # start mongodb service
  sudo systemctl enable mongod.service
  sudo systemctl start mongod.service

  # add mongodb to services
  sudo yunohost service add mongod -l /var/log/mongodb/mongod.log

  # Meteor needs at least this version of node to work.
  sudo npm install -g n
  sudo n $NODE_VERSION
}
