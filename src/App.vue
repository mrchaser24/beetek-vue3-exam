<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { initAuth, cleanup } = useAuth()

onMounted(() => {
  initAuth()
})

onUnmounted(() => {
  cleanup()
})
</script>
