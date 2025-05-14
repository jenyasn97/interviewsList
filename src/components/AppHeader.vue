<template>
  <Menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
        <span :class="item.icon" class="p-menuitem-icon"></span>
        <span class="ml-2">{{ item.label }}</span>
      </router-link>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { Menubar } from 'primevue'
import { ref } from 'vue'

interface IMenuItem {
  label: string
  icon: string
  path: string
}

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
  },
])
</script>

<style scoped>
.menu {
  margin: 30px 0;
}

.menu-exit {
  cursor: pointer;
}
</style>
