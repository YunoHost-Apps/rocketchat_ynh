# common.sh

ROCKETCHAT_VERSION=0.73.2
ROCKETCHAT_SHASUM=3dc3eb11f383f7b72b0f23fedb305b6a566fa536a1e5087a4398255deeb864d8
ROCKETCHAT_DOWNLOAD_URI=https://releases.rocket.chat/${ROCKETCHAT_VERSION}/download
NODE_VERSION=8.11.4
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
  if [ $DEBIAN_ISSUE == "stretch" ]; then
    sudo curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
    sudo bash nodesource_setup.sh
    sudo apt-get install -y nodejs
  else
    sudo apt-get install -y npm
    # Using npm install inherits and n, and the node version required by Rocket.Chat:
    sudo npm install -g inherits n
    sudo n $NODE_VERSION
  fi
  echo "node version is now: "
  node --version
}

installdeps(){

  if [ $(dpkg --print-architecture) == "armhf" ]; then
    #Install mongodb for debian armhf
    sudo apt-get update
    sudo apt-get install -y mongodb-server

    # start mongodb service
    sudo systemctl enable mongodb.service
    sudo systemctl start mongodb.service

    # add mongodb to services
    sudo yunohost service add mongodb -l /var/log/mongodb/mongodb.log
  else
    #Install mongodb for debian x86/x64
    sudo apt-get install dirmngr && sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
    echo "deb http://repo.mongodb.org/apt/debian ${DEBIAN_ISSUE}/mongodb-org/4.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org

    # start mongodb service
    sudo systemctl enable mongod.service
    sudo systemctl start mongod.service

    # add mongodb to services
    sudo yunohost service add mongod -l /var/log/mongodb/mongod.log
  fi

  #Install other dependencies
  sudo apt-get install -y build-essential gzip curl graphicsmagick

  installnode
}
