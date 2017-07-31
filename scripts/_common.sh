# common.sh

ROCKETCHAT_VERSION=0.57.2
ROCKETCHAT_SHASUM=ca43b8d3487d0c8cd82dae5a4f66ef89c9ad7c202c67ff79096bbad696da6a07
NODE_VERSION=4.7.1

waitforservice() {
  isup=false; x=90; while [ $x -gt 0 ];do echo "Waiting approx. $x seconds..."; \
  x=$(( $x - 1 )); sleep 1; if $(curl -m 1 -s localhost:$port${path:-/}/api/v1/info | \
  grep -e "success.*true" >/dev/null 2>&1); then isup=true; break; fi; done && if $isup; \
  then echo "service is up"; else ynh_die "$app could not be started"; fi
}
