#!/bin/bash

#=================================================
# COMMON VARIABLES
#=================================================

# dependencies used by the app
#pkg_dependencies="apt-transport-https build-essential gzip curl graphicsmagick"  dirmngr

nodejs_version=12

# dependencies used by the app
pkg_dependencies="mongodb mongodb-server mongo-tools apt-transport-https build-essential gzip curl graphicsmagick "
pkg_dependencies_buster="mongodb-org mongodb-org-server mongodb-org-tools"

mongodb_stretch="mongodb"
mongodb_buster="mongod"

#=================================================
# PERSONAL HELPERS
#=================================================

#=================================================
# EXPERIMENTAL HELPERS
#=================================================

# Evaluate a mongo command
#
# example: ynh_mongo_eval_as --command='db.getMongo().getDBNames().indexOf("wekan")'
# example: ynh_mongo_eval_as --command="db.getMongo().getDBNames().indexOf(\"wekan\")"
#
# usage: ynh_mongo_eval_as [--user=user] [--password=password] [--authenticationdatabase=authenticationdatabase] [--database=database] [--host=host] [--port=port] --command="command"
# | arg: -u, --user=                      - the user name to connect as
# | arg: -p, --password=                  - the user password
# | arg: -d, --authenticationdatabase=    - the authenticationdatabase to connect to
# | arg: -d, --database=                  - the database to connect to
# | arg: -h, --host=                      - the host to connect to
# | arg: -P, --port=                      - the port to connect to
# | arg: -c, --command=                   - the command to evaluate
#
#
ynh_mongo_eval_as() {
    # Declare an array to define the options of this helper.
    local legacy_args=upadhPc
    local -A args_array=( [u]=user= [p]=password= [a]=authenticationdatabase= [d]=database= [h]=host= [P]=port= [c]=command= )
    local user
    local password
    local authenticationdatabase
    local database
    local host
    local port
    local command
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"
    user="${user:-}"
    password="${password:-}"
    authenticationdatabase="${authenticationdatabase:-"admin"}"
    database="${database:-"admin"}"
    host="${host:-}"
    port="${port:-}"

    # If user is provided
    if [ -n "$user" ]
    then
        user="--username=$user"
        password="--password=$password"
        authenticationdatabase="--authenticationDatabase=$authenticationdatabase"
    else
        password=""
        authenticationdatabase=""
    fi

    # Configure dabase connection
    database="use $database"

    # If host is provided
    if [ -n "$host" ]
    then
        host="--host=$host"
    fi

    # If host is provided
    if [ -n "$port" ]
    then
        port="--port=$port"
    fi

    mongo --quiet $user $password $authenticationdatabase $host $port <<EOF
$database
${command}
quit()
EOF
}

# Create a database 
#
# [internal]
#
# usage: ynh_mongo_create_db db_name
# | arg: db_name - the database name to create
#
#
ynh_mongo_create_db() {
    local db_name=$1
    local db_user=$2

}

# Drop a database
#
# [internal]
#
# If you intend to drop the database *and* the associated user,
# consider using ynh_mongo_remove_db instead.
#
# usage: ynh_mongo_drop_db -database=db
# | arg: -d, --database=    - the database name to drop
#
#
ynh_mongo_drop_db() {
    local legacy_args=d
    local -A args_array=( [d]=database= )
    local database
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"

    ynh_mongo_eval_as --database="${database}" --command='db.runCommand({dropDatabase: 1})'
}

# Dump a database
#
# example: ynh_mongo_dump_db --database=wekan > ./dump.bson
#
# usage: ynh_mongo_dump_db --database=database
# | arg: -d, --database=    - the database name to dump
# | ret: the mongodump output
#
#
ynh_mongo_dump_db() {
    # Declare an array to define the options of this helper.
    local legacy_args=d
    local -A args_array=( [d]=database= )
    local database
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"

    mongodump --quiet --db="$database" --archive
}

# Create a user
#
# [internal]
#
# usage: ynh_mongo_create_user --db_user=db_user --db_pwd=db_pwd --db_name=db_name
# | arg: -u, --db_user=    - the user name to create
# | arg: -p, --db_pwd=     - the password to identify user by
# | arg: -n, --db_name=     - Name of the database to grant privilegies
#
#
ynh_mongo_create_user() {
    # Declare an array to define the options of this helper.
    local legacy_args=unp
    local -A args_array=( [u]=db_user= [n]=db_name= [p]=db_pwd= )
    local db_user
    local db_name
    local db_pwd
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"

    # Create the user and set the user as admin of the db
    ynh_mongo_eval_as --database="$db_name" --command='db.createUser( { user: "'${db_user}'", pwd: "'${db_pwd}'", roles: [ { role: "readWrite", db: "'${db_name}'" } ] } );'
    
    # Add clustermonitoring rights
    ynh_mongo_eval_as --database="$db_name" --command='db.grantRolesToUser("'${db_user}'",[{ role: "clusterMonitor", db: "admin" }]);'
}

# Check if a mongo database exists
#
# usage: ynh_mongo_database_exists --database=database
# | arg: -d, --database=    - the database for which to check existence
# | exit: Return 1 if the database doesn't exist, 0 otherwise
#
#
ynh_mongo_database_exists() {
    # Declare an array to define the options of this helper.
    local legacy_args=d
    local -A args_array=([d]=database=)
    local database
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"

    if [ $(ynh_mongo_eval_as --command='db.getMongo().getDBNames().indexOf("'${database}'")') -lt 0 ]
    then
        return 0
    else
        return 1
    fi
}

# Restore a database
#
# example: ynh_mongo_restore_db --database=wekan < ./dump.bson
#
# usage: ynh_mongo_restore_db --database=database
# | arg: -d, --database=    - the database name to restore
#
#
ynh_mongo_restore_db() {
    # Declare an array to define the options of this helper.
    local legacy_args=d
    local -A args_array=( [d]=database= )
    local database
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"

    mongorestore --quiet --db="$database" --archive
}

# Drop a user
#
# [internal]
#
# usage: ynh_mongo_drop_user --db_user=user
# | arg: -u, --db_user=     -the user to drop
#
#
ynh_mongo_drop_user() {
    # Declare an array to define the options of this helper.
    local legacy_args=u
    local -A args_array=( [u]=db_user= )
    local db_user
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"

    ynh_mongo_eval_as --command='db.dropUser("'${db_user}'", {w: "majority", wtimeout: 5000})'
}

# Create a database, an user and its password. Then store the password in the app's config
#
# usage: ynh_mongo_setup_db --db_user=user --db_name=name [--db_pwd=pwd]
# | arg: -u, --db_user=     - Owner of the database
# | arg: -n, --db_name=     - Name of the database
# | arg: -p, --db_pwd=      - Password of the database. If not provided, a password will be generated
#
# After executing this helper, the password of the created database will be available in $db_pwd
# It will also be stored as "mongopwd" into the app settings.
#
#
ynh_mongo_setup_db() {
    # Declare an array to define the options of this helper.
    local legacy_args=unp
    local -A args_array=( [u]=db_user= [n]=db_name= [p]=db_pwd= )
    local db_user
    local db_name
    local db_pwd
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"

    local new_db_pwd=$(ynh_string_random) # Generate a random password
    # If $db_pwd is not provided, use new_db_pwd instead for db_pwd
    db_pwd="${db_pwd:-$new_db_pwd}"
    
    # Create the user and grant access to the database
    ynh_mongo_create_user --db_user="$db_user" --db_pwd="$db_pwd" --db_name="$db_name"

    ynh_app_setting_set --app=$app --key=db_pwd --value=$db_pwd 
}

# Remove a database if it exists, and the associated user
#
# usage: ynh_mongo_remove_db --db_user=user --db_name=name
# | arg: -u, --db_user=     - Owner of the database
# | arg: -n, --db_name=     - Name of the database
#
#
ynh_mongo_remove_db() {
    # Declare an array to define the options of this helper.
    local legacy_args=un
    local -A args_array=( [u]=db_user= [n]=db_name= )
    local db_user
    local db_name
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"

    if ynh_mongo_database_exists --database=$db_name
    then # Check if the database exists
        ynh_mongo_drop_db --database="$db_name"  # Remove the database
    else
        ynh_print_warn --message="Database $db_name not found"
    fi

    # Remove mongo user if it exists
    ynh_mongo_drop_user --db_user=$db_user
}






read_json () {
    sudo python3 -c "import sys, json;print(json.load(open('$1'))['$2'])"
}

read_manifest () {
    if [ -f '../manifest.json' ] ; then
        read_json '../manifest.json' "$1"
    else
        read_json '../settings/manifest.json' "$1"
    fi
}

abort_if_up_to_date () {
    version=$(read_json "/etc/yunohost/apps/$YNH_APP_INSTANCE_NAME/manifest.json" 'version' 2> /dev/null || echo '20160501-7')
    last_version=$(read_manifest 'version')
    if [ "${version}" = "${last_version}" ]; then
        ynh_script_progression --message="Up-to-date, nothing to do"
        ynh_die "" 0
    fi
}

ynh_version_gt ()
{
    dpkg --compare-versions "$1" gt "$2"
}





# Check the architecture
#
# example: architecture=$(ynh_detect_arch)
#
# usage: ynh_detect_arch
#
# Requires YunoHost version 2.2.4 or higher.

ynh_detect_arch(){
  local architecture
  if [ -n "$(uname -m | grep arm64)" ] || [ -n "$(uname -m | grep aarch64)" ]; then
    architecture="arm64"
  elif [ -n "$(uname -m | grep 64)" ]; then
    architecture="x86-64"
  elif [ -n "$(uname -m | grep 86)" ]; then
    architecture="i386"
  elif [ -n "$(uname -m | grep arm)" ]; then
    architecture="arm"
  else
    architecture="unknown"
  fi
  echo $architecture
}


# Create a dedicated config file
#
# usage: ynh_add_config [--origin="origin file"] [--destination="destination file"] [--vars="vars to replace"]
# | arg: -o, --origin=     - Template config file to use (optionnal, ../conf/.env by default)
# | arg: -d, --destination=    - Destination of the config file (optionnal, $final_path/.env)
# | arg: -v, --vars=  - List of variables to replace separated by a space. For example: 'var_1 var_2 ...'
#
# This will use the template $origin or ../conf/.env by default
# to generate a config file $destination or $final_path/.env by default,
# by replacing the following keywords with global variables
# that should be defined before calling this helper :
#   __PATH__      by  $path_url
#   __DOMAIN__    by $domain
#   __PORT__    by $port
#   __NAME__    by $app
#   __NAMETOCHANGE__    by $app
#   __USER__    by $app
#   __APP__    by $app
#   __FINALPATH__    by $final_path
#   __PHPVERSION__    by $YNH_PHP_VERSION
#   __YNH_NPM__    by $ynh_npm
#   __YNH_NODE__    by $ynh_node
#   __YNH_NODE_LOAD_PATH__    by $ynh_node_load_PATH
#   __NODEJS_PATH__    by $nodejs_path
#   __NODEJS_VERSION__    by $nodejs_version
#   __DB_NAME__    by $db_name
#   __DB_USER__    by $db_user
#   __DB_PWD__    by $db_pwd
#
# And dynamic variables (from the last example) :
#   __VAR_1__    by $var_1
#   __VAR_2__    by $var_2
#
# The helper will verify the checksum and backup the destination file
# if it's different before applying the new origin file.
# And it will calculate and store a destination file checksum
# into the app settings when configuraation is done.
#
ynh_add_config () {
    # Declare an array to define the options of this helper.
    local legacy_args=odv
    local -A args_array=( [o]=origin= [d]=destination= [v]=vars= )
    local origin
    local destination
    local vars
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"
    local origin="${origin:-"../conf/.env"}"
    local destination="${destination:-"$final_path/.env"}"
    local vars="${vars:-}"

    ynh_backup_if_checksum_is_different --file="$destination"
    cp "$origin" "$destination"

    ynh_replace_vars --file="$destination" --vars="$vars"

    ynh_store_file_checksum --file="$destination"
}

# Remove the dedicated config
#
# usage: ynh_remove_config [--file=file]
# | arg: -f, --file=     - Config file to remove (optionnal, $final_path/.env)
#
#
ynh_remove_config () {
    # Declare an array to define the options of this helper.
    local legacy_args=f
    local -A args_array=( [f]=file= )
    local file
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"
    local service="${file:-}"

    # The default behaviour is to use .env file.
    if [ -n "$file" ]; then
        file="final_path/.env"
    fi

    if [ -e "$file" ]
    then
        ynh_secure_remove --file="$file"
    fi
}

# Replace variables in a file
#
# usage: ynh_replace_vars --file="file" [--vars="vars to replace"]
# | arg: -o, --file=     - Template config file to use
# | arg: -v, --vars=  - List of variables to replace separated by a space. For example: 'var_1 var_2 ...'
#
# This will replace in the the following keywords with global variables
# that should be defined before calling this helper :
#   __PATH__      by  $path_url
#   __DOMAIN__    by $domain
#   __PORT__    by $port
#   __NAME__    by $app
#   __NAMETOCHANGE__    by $app
#   __USER__    by $app
#   __APP__    by $app
#   __FINALPATH__    by $final_path
#   __PHPVERSION__    by $YNH_PHP_VERSION
#   __YNH_NPM__    by $ynh_npm
#   __YNH_NODE__    by $ynh_node
#   __YNH_NODE_LOAD_PATH__    by $ynh_node_load_PATH
#   __NODEJS_PATH__    by $nodejs_path
#   __NODEJS_VERSION__    by $nodejs_version
#   __DB_NAME__    by $db_name
#   __DB_USER__    by $db_user
#   __DB_PWD__    by $db_pwd
#
# And dynamic variables (from the last example) :
#   __VAR_1__    by $var_1
#   __VAR_2__    by $var_2
#
#
ynh_replace_vars () {
    # Declare an array to define the options of this helper.
    local legacy_args=fv
    local -A args_array=( [f]=file= [v]=vars= )
    local file
    local vars
    # Manage arguments with getopts
    ynh_handle_getopts_args "$@"
    local file="${file:-}"
    local vars="${vars:-}"


    #Replace usual YunoHost variables
    if test -n "${path_url:-}"
    then
        # path_url_slash_less is path_url, or a blank value if path_url is only '/'
        local path_url_slash_less=${path_url%/}
        ynh_replace_string --match_string="__PATH__/" --replace_string="$path_url_slash_less/" --target_file="$file"
        ynh_replace_string --match_string="__PATH__" --replace_string="$path_url" --target_file="$file"
    fi
    if test -n "${domain:-}"; then
        ynh_replace_string --match_string="__DOMAIN__" --replace_string="$domain" --target_file="$file"
    fi
    if test -n "${port:-}"; then
        ynh_replace_string --match_string="__PORT__" --replace_string="$port" --target_file="$file"
    fi
    if test -n "${app:-}"; then
        ynh_replace_string --match_string="__NAME__" --replace_string="$app" --target_file="$file"
        ynh_replace_string --match_string="__NAMETOCHANGE__" --replace_string="$app" --target_file="$file"
        ynh_replace_string --match_string="__USER__" --replace_string="$app" --target_file="$file"
        ynh_replace_string --match_string="__APP__" --replace_string="$app" --target_file="$file"
    fi
    if test -n "${final_path:-}"; then
        ynh_replace_string --match_string="__FINALPATH__" --replace_string="$final_path" --target_file="$file"
    fi
    if test -n "${YNH_PHP_VERSION:-}"; then
        ynh_replace_string --match_string="__PHPVERSION__" --replace_string="$YNH_PHP_VERSION" --target_file="$file"
    fi
    if test -n "${ynh_npm:-}"; then
        ynh_replace_string --match_string="__YNH_NPM__" --replace_string="$ynh_npm" --target_file="$file"
    fi
    if test -n "${ynh_node:-}"; then
        ynh_replace_string --match_string="__YNH_NODE__" --replace_string="$ynh_node" --target_file="$file"
    fi
    if test -n "${ynh_node_load_PATH:-}"; then
        ynh_replace_string --match_string="__YNH_NODE_LOAD_PATH__" --replace_string="$ynh_node_load_PATH" --target_file="$file"
    fi
    if test -n "${nodejs_path:-}"; then
        ynh_replace_string --match_string="__NODEJS_PATH__" --replace_string="$nodejs_path" --target_file="$file"
    fi
    if test -n "${nodejs_version:-}"; then
        ynh_replace_string --match_string="__NODEJS_VERSION__" --replace_string="$nodejs_version" --target_file="$file"
    fi
    if test -n "${db_name:-}"; then
        ynh_replace_string --match_string="__DB_NAME__" --replace_string="$db_name" --target_file="$file"
    fi
    if test -n "${db_user:-}"; then
        ynh_replace_string --match_string="__DB_USER__" --replace_string="$db_user" --target_file="$file"
    fi
    if test -n "${db_pwd:-}"; then
        ynh_replace_string --match_string="__DB_PWD__" --replace_string="$db_pwd" --target_file="$file"
    fi

    # Replace all other variables given as arguments
    for var_to_replace in $vars
    do
        # ${var_to_replace^^} make the content of the variable on upper-cases
        # ${!var_to_replace} get the content of the variable named $var_to_replace 
        ynh_replace_string --match_string="__${var_to_replace^^}__" --replace_string="${!var_to_replace}" --target_file="$file"
    done
}








#=================================================
# FUTURE OFFICIAL HELPERS
#=================================================



# installdeps(){

#   if [ $(dpkg --print-architecture) == "armhf" ]; then
#     #Install mongodb for debian armhf
#     sudo apt-get update
#     sudo apt-get install -y mongodb-server

#     # start mongodb service
#     sudo systemctl enable mongodb.service
#     sudo systemctl start mongodb.service

#     # add mongodb to services
#     sudo yunohost service add mongodb -l /var/log/mongodb/mongodb.log
#   else
#     #Install mongodb for debian x86/x64
#     sudo apt-get install dirmngr && sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
#     echo "deb http://repo.mongodb.org/apt/debian ${DEBIAN_ISSUE}/mongodb-org/4.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
#     sudo apt-get update
#     sudo apt-get install -y mongodb-org

#     # start mongodb service
#     sudo systemctl enable mongod.service
#     sudo systemctl start mongod.service

#     # add mongodb to services
#     sudo yunohost service add mongod -l /var/log/mongodb/mongod.log
#   fi

#   #Install other dependencies
#   sudo apt-get install -y build-essential gzip curl graphicsmagick

# }
