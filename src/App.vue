<template>
  <ProgressSpinner v-if="isLoading" />
  <div v-else class="container">
    <AppHeader />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from './stores/user'
import { onMounted, ref } from 'vue'
import { ProgressSpinner } from 'primevue'

const userStore = useUserStore()
const isLoading = ref<boolean>(true)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
    isLoading.value = false
  })
})
</script>

<style scoped>
.container {
  min-width: 1280px;
  margin: auto;
  padding: 20px;
}
</style>
