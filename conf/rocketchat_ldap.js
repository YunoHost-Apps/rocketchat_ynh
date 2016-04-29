use rocketchat


db.rocketchat_settings.update(
  { "_id" : "LDAP_Enable" },
    {
      $set: { "value": true }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Domain_Base" },
    {
      $set: { "value": "dc=yunohost,dc=org" }
    }
)
db.rocketchat_settings.update(
  { "_id" : "LDAP_Domain_Search_User_ID" },
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


