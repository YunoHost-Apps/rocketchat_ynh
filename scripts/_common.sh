# common.sh

ROCKETCHAT_VERSION=0.65.1
ROCKETCHAT_SHASUM=6484c19ad922520e8ca45b2d09eff3be33f227dd74f737b67c437fb3e6c6fc4b
NODE_VERSION=8.9.4
DEBIAN_ISSUE=$(grep 9 /etc/debian_version >/dev/null && echo stretch || echo jessie)

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

  if [ $DEBIAN_ISSUE == "stretch"]; then
    sudo apt-get install -y nodejs
  else
    sudo apt-get install -y npm
  fi
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
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
    echo "deb http://repo.mongodb.org/apt/debian ${DEBIAN_ISSUE}/mongodb-org/4.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
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
