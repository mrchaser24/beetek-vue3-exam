<template>
  <div>
    <!-- Show loading spinner while checking auth -->
    <v-container v-if="loading" class="fill-height d-flex align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      />
    </v-container>
    
    <!-- Show login form if not authenticated -->
    <LoginForm v-else-if="!user" />
    
    <!-- Show items table if authenticated -->
    <ItemsTable v-else />
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import LoginForm from '@/components/LoginForm.vue'
import ItemsTable from '@/components/ItemsTable.vue'

const { user, loading } = useAuth()
</script>
