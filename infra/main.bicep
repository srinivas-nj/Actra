@description('Name of the environment (dev, test, prod).')
param environmentName string = 'prod'

@description('Location for all Azure resources.')
param location string = resourceGroup().location

@description('App Service plan SKU for the frontend and backend.')
param appServicePlanSku string = 'B1'

@description('Frontend domain or allowed origin list for CORS. Example: https://app.example.com')
param frontendAllowedOrigins string = 'https://example.com'

@description('Backend app name.')
param backendAppName string = 'actra-backend'

@description('Frontend app name.')
param frontendAppName string = 'actra-frontend'

@description('PostgreSQL admin username.')
param postgresAdminLogin string = 'actraadmin'

@secure()
@description('PostgreSQL admin password.')
param postgresAdminPassword string

@description('Database name for the application.')
param postgresDatabaseName string = 'actra'

@description('Storage account SKU.')
param storageSku string = 'Standard_LRS'

@description('Key Vault name prefix.')
param keyVaultName string = 'actrakev'

var appServicePlanName = 'asp${take(uniqueString(subscription().id, resourceGroup().id, location, environmentName), 6)}'
var appInsightsName = 'appi${take(uniqueString(subscription().id, resourceGroup().id, location, environmentName), 6)}'
var logAnalyticsName = 'law${take(uniqueString(subscription().id, resourceGroup().id, location, environmentName), 6)}'
var storageAccountName = 'st${take(replace(uniqueString(subscription().id, resourceGroup().id, location, environmentName), '-', ''), 12)}'
var kvName = 'kv${take(replace(uniqueString(subscription().id, resourceGroup().id, location, environmentName), '-', ''), 15)}'
var postgresServerName = 'pg${take(replace(uniqueString(subscription().id, resourceGroup().id, location, environmentName), '-', ''), 15)}'
var backendIdentityName = 'id-${backendAppName}-${take(uniqueString(subscription().id, resourceGroup().id, location, environmentName), 6)}'
var frontendIdentityName = 'id-${frontendAppName}-${take(uniqueString(subscription().id, resourceGroup().id, location, environmentName), 6)}'
var frontendCorsAllowedOrigins = split(frontendAllowedOrigins, ',')

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    Flow_Type: 'Bluefield'
    Request_Source: 'rest'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
    perSiteScaling: false
    isSpot: false
  }
}

resource backendIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: backendIdentityName
  location: location
}

resource frontendIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: frontendIdentityName
  location: location
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: storageSku
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: kvName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    publicNetworkAccess: 'Enabled'
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enabledForTemplateDeployment: true
  }
}

resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-12-01-preview' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'Standard_B2ms'
    tier: 'Burstable'
  }
  properties: {
    version: '16'
    administratorLogin: postgresAdminLogin
    administratorLoginPassword: postgresAdminPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    network: {
      publicNetworkAccess: 'Enabled'
      delegatedSubnetResourceId: ''
      privateDnsZoneArmResourceId: ''
    }
    availabilityZone: '1'
    createMode: 'Default'
  }
}

resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-12-01-preview' = {
  name: postgresDatabaseName
  parent: postgresServer
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

resource postgresFirewallAllowAzureServices 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-12-01-preview' = {
  name: 'AllowAzureServices'
  parent: postgresServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource kvSecretDbPassword 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'postgres-password'
  parent: keyVault
  properties: {
    value: postgresAdminPassword
  }
}

resource kvSecretJwtSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'jwt-secret'
  parent: keyVault
  properties: {
    value: 'replace-with-a-secure-secret' 
  }
}

resource backendSite 'Microsoft.Web/sites@2023-01-01' = {
  name: backendAppName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${backendIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'JAVA|21-java21'
      appSettings: [
        {
          name: 'WEBSITES_PORT'
          value: '8080'
        }
        {
          name: 'APP_NAME'
          value: 'actra'
        }
        {
          name: 'SERVER_PORT'
          value: '8080'
        }
        {
          name: 'DATABASE_URL'
          value: 'jdbc:postgresql://${postgresServer.properties.fullyQualifiedDomainName}:5432/${postgresDatabaseName}'
        }
        {
          name: 'DATABASE_USERNAME'
          value: postgresAdminLogin
        }
        {
          name: 'DATABASE_PASSWORD'
          value: postgresAdminPassword
        }
        {
          name: 'DATABASE_DRIVER_CLASS_NAME'
          value: 'org.postgresql.Driver'
        }
        {
          name: 'DATABASE_DIALECT'
          value: 'org.hibernate.dialect.PostgreSQLDialect'
        }
        {
          name: 'JWT_SECRET'
          value: '@Microsoft.KeyVault(SecretUri=${kvSecretJwtSecret.properties.secretUriWithVersion})'
        }
        {
          name: 'CORS_ALLOWED_ORIGINS'
          value: frontendAllowedOrigins
        }
        {
          name: 'STORAGE_PATH'
          value: '/tmp/actra-storage'
        }
        {
          name: 'OLLAMA_BASE_URL'
          value: 'https://localhost'
        }
        {
          name: 'OLLAMA_MODEL'
          value: 'llama3.1'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
      ]
      ftpsState: 'FtpsOnly'
      minTlsVersion: '1.2'
      alwaysOn: true
      http20Enabled: true
      healthCheckPath: '/actuator/health'
      scmSiteAlsoStopped: false
      cors: {
        allowedOrigins: frontendCorsAllowedOrigins
      }
    }
  }
}

resource frontendSite 'Microsoft.Web/sites@2023-01-01' = {
  name: frontendAppName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${frontendIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name: 'WEBSITES_PORT'
          value: '8080'
        }
        {
          name: 'VITE_API_URL'
          value: 'https://${backendSite.properties.defaultHostName}'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
      ]
      ftpsState: 'FtpsOnly'
      minTlsVersion: '1.2'
      alwaysOn: true
      http20Enabled: true
      healthCheckPath: '/'
      scmSiteAlsoStopped: false
      cors: {
        allowedOrigins: frontendCorsAllowedOrigins
      }
    }
  }
}

resource backendDiag 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'diag-${backendSite.name}'
  scope: backendSite
  properties: {
    workspaceId: logAnalytics.id
    logs: [
      {
        categoryGroup: 'allLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

resource frontendDiag 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'diag-${frontendSite.name}'
  scope: frontendSite
  properties: {
    workspaceId: logAnalytics.id
    logs: [
      {
        categoryGroup: 'allLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

output frontendHostName string = frontendSite.properties.defaultHostName
output backendHostName string = backendSite.properties.defaultHostName
output postgresServerFqdn string = postgresServer.properties.fullyQualifiedDomainName
output storageAccountName string = storageAccount.name
output keyVaultName string = keyVault.name
