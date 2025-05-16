<template>
  <div class="content-interview">
    <Card>
      <template #title>Новое собеседование</template>
      <template #content>
        <InputText class="input mb-3" placeholder="Компания" v-model="company" />
        <InputText
          v-model="vacancyLink"
          class="input mb-3"
          placeholder="Описание вакансии (ссылка)"
        />
        <InputText v-model="hrName" class="input mb-3" placeholder="Контакт (имя)" />
        <InputText
          v-model="contactTelegram"
          class="input mb-3"
          placeholder="Telegram username HR"
        />
        <InputText v-model="contactWhatsApp" class="input mb-3" placeholder="WhatsApp телефон HR" />
        <InputText v-model="contactPhone" class="input mb-3" placeholder="Телефон HR" />
        <Button
          @click="addNewInterview"
          label="Создать собеседование"
          :disabled="disabledSaveButton"
          :loading="loading"
        ></Button>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button, Card, InputText } from 'primevue'
import { computed, ref } from 'vue'
import type { IInterviw } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { getAuth } from 'firebase/auth'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const company = ref<string>('')
const vacancyLink = ref<string>('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const contactWhatsApp = ref<string>('')
const contactPhone = ref<string>('')
const loading = ref<boolean>(false)
const db = getFirestore()
const router = useRouter()

const disabledSaveButton = computed(() => {
  return !(company.value && vacancyLink.value && hrName.value)
})
async function addNewInterview(): Promise<void> {
  loading.value = true
  const payload: IInterviw = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactWhatsApp: contactWhatsApp.value,
    contactPhone: contactPhone.value,
    createdAt: new Date(),
  }

  const userId = getAuth().currentUser?.uid
  if (userId) {
    await setDoc(doc(db, `users/${userId}/interviews`, payload.id), payload)
    router.push('/list')
  }
  loading.value = false
}
</script>

<style scoped>
.input {
  width: 100%;
}
.content-interview {
  max-width: 600px;
  margin: auto;
}
</style>
