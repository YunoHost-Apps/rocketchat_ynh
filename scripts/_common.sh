#!/bin/bash

#=================================================
# COMMON VARIABLES
#=================================================

# dependencies used by the app
#pkg_dependencies="apt-transport-https build-essential gzip curl graphicsmagick"  dirmngr

nodejs_version=14

# dependencies used by the app
pkg_dependencies="mongod mongodb-org mongodb-org-server mongodb-org-tools apt-transport-https build-essential gzip curl graphicsmagick"

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
