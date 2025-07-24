<template>
  <v-card class="ma-4" color="orange-lighten-5" variant="outlined">
    <v-card-title class="text-orange-darken-2">
      <v-icon class="me-2">mdi-firebase</v-icon>
      Firebase Configuration Status
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>API Key</v-list-item-title>
              <v-list-item-subtitle>
                {{ config.apiKey ? '✅ Configured' : '❌ Missing' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Auth Domain</v-list-item-title>
              <v-list-item-subtitle>
                {{ config.authDomain ? '✅ Configured' : '❌ Missing' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Project ID</v-list-item-title>
              <v-list-item-subtitle>
                {{ config.projectId ? '✅ Configured' : '❌ Missing' }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="6">
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>Storage Bucket</v-list-item-title>
              <v-list-item-subtitle>
                {{ config.storageBucket ? '✅ Configured' : '❌ Missing' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Messaging Sender ID</v-list-item-title>
              <v-list-item-subtitle>
                {{ config.messagingSenderId ? '✅ Configured' : '❌ Missing' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>App ID</v-list-item-title>
              <v-list-item-subtitle>
                {{ config.appId ? '✅ Configured' : '❌ Missing' }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      
      <v-alert
        v-if="!isConfigured"
        type="warning"
        class="mt-4"
        text="Please configure your Firebase environment variables in .env.local to enable authentication and database features."
      />
      
      <v-alert
        v-else
        type="success"
        class="mt-4"
        text="Firebase is properly configured and ready to use!"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const isConfigured = computed(() => {
  return Object.values(config).every(value => value && value.trim() !== '')
})
</script>
