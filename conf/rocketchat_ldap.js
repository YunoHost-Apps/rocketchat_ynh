use rocketchat


db.rocketchat_settings.update(
  { "_id" : "LDAP_Enable" },
    {
      $set: { "value": true }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Login_Fallback" },
    {
      $set: { "value": false }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Host" },
    {
      $set: { "value": "localhost" }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Port" },
    {
      $set: { "value": "389" }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Reconnect" },
    {
      $set: { "value": true }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_BaseDN" },
    {
      $set: { "value": "dc=yunohost,dc=org" }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Username_Field" },
    {
      $set: { "value": "uid" }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Unique_Identifier_Field" },
    {
      $set: { "value": "uid" }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Domain_Search_Object_Class" },
    {
      $set: { "value": "inetOrgPerson" }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Sync_User_Data" },
    {
      $set: { "value": true }
    }
)
db.rocketchat_settings.update(
  { "_id" : "Accounts_RegistrationForm" },
    {
      $set: { "value": "Enabled" }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_User_Search_Filter" },
    {
      $set: { "value": "(objectclass=inetOrgPerson)" }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_User_Search_Field" },
    {
      $set: { "value": "uid" }
    }
)
