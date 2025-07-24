<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-8" elevation="8" rounded="lg">
          <v-card-title class="text-center mb-6">
            <h1 class="text-h4 font-weight-bold">Welcome</h1>
          </v-card-title>
          
          <v-card-text class="text-center">
            <v-img
              src="/src/assets/logo.svg"
              alt="Logo"
              max-width="120"
              class="mx-auto mb-6"
            />
            
            <p class="text-h6 mb-6 text-medium-emphasis">
              Sign in to manage your items
            </p>
            
            <v-btn
              @click="handleGoogleSignIn"
              :loading="loading"
              :disabled="loading"
              color="primary"
              size="large"
              variant="elevated"
              prepend-icon="mdi-google"
              block
              class="mb-4"
            >
              Sign in with Google
            </v-btn>
            
            <p class="text-caption text-medium-emphasis">
              Secure authentication powered by Firebase
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      :timeout="5000"
      color="error"
      location="top"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showError = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { signInWithGoogle, loading } = useAuth()

const showError = ref(false)
const errorMessage = ref('')

const handleGoogleSignIn = async () => {
  try {
    await signInWithGoogle()
  } catch (error) {
    console.error('Sign in error:', error)
    errorMessage.value = 'Failed to sign in. Please try again.'
    showError.value = true
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
