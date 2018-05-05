# common.sh

ROCKETCHAT_VERSION=0.64.1
ROCKETCHAT_SHASUM=8c97b33d9efea7edc2db72462c866ea1c8c4f7054988bebb9fd028c8d6219ec0
NODE_VERSION=8.9.4

checkcmd() {
  curl -m 1 -s localhost:$port$path/api/v1/info | \
    python -c "import sys, json; print json.load(sys.stdin)['success']" 2>/dev/null | \
    grep "True" >/dev/null 2>&1
}

waitforservice() {
  isup=false
  x=90
  while [ $x -gt 0 ]; do
    echo "Waiting approx. $x seconds..."
    x=$(( $x - 1 ))
    sleep 1

    if checkcmd; then
      isup=true; break;
    fi;
  done

  if $isup; then
    echo "service is up"
  else
    ynh_die "$app could not be started"
  fi
}

installnode(){

  sudo apt-get install -y npm
  # Meteor needs at least this version of node to work.
  sudo npm install -g n
  sudo n $NODE_VERSION
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
  sudo systemctl enable mongod.service
  sudo systemctl start mongod.service

  # add mongodb to services
  sudo yunohost service add mongod -l /var/log/mongodb/mongod.log

  #Install other dependencies
  sudo apt-get install -y gzip curl graphicsmagick

  installnode
}
