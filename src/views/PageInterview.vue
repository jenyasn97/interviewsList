<template>
  <ProgressSpinner v-if="isLoading" />

  <div v-else-if="interview?.id && !isLoading" class="content-interview">
    <Card>
      <template #title>Собеседование в Компанию {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Компания</label>
          <InputText class="input mb-3" id="company" v-model="interview.company" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="vcancyLink">Описание вакансии (сслыка)</label>
          <InputText class="input mb-3" id="vcancyLink" v-model="interview.vacancyLink" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="hrName">Контакт HR</label>
          <InputText class="input mb-3" id="hrName" v-model="interview.hrName" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactTelegtram">Telegtram HR</label>
          <InputText class="input mb-3" id="contactTelegtram" v-model="interview.contactTelegram" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactWhatsApp">WhatsApp HR</label>
          <InputText class="input mb-3" id="contactWhatsApp" v-model="interview.contactWhatsApp" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactPhone">Телефон HR</label>
          <InputText class="input mb-3" id="contactPhone" v-model="interview.contactPhone" />
        </div>
        <div class="flex gap-3 mb-3">
          <InputNumber
            inputId="salaryFrom"
            fluid
            placeholder="Зарплатная вилка от"
            v-model="interview.salaryFrom"
          />
          <InputNumber
            inputId="salaryTo"
            fluid
            placeholder="Зарплатная вилка до"
            v-model="interview.salaryTo"
          />
        </div>
        <Button
          label="Добавить этап"
          severity="info"
          icon="pi pi-plus"
          class="mb-3"
          @click="addStage"
        />
        <template v-if="interview.stage">
          <div class="interview-stage" v-for="(stage, index) in interview.stage" :key="index">
            <div class="flex flex-column gap-2 mb-3">
              <label :for="`stage-name-${index}`">Название этапа</label>
              <InputText :id="`stage-name-${index}`" v-model="stage.name" />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-date-${index}`">Дата прохождения этапа </label>
              <DatePicker
                :id="`stage-date-${index}`"
                date-format="dd.mm.yy"
                class="input mb-3"
                v-model="stage.date"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-description-${index}`">Комментарий</label>
              <Textarea
                :id="`stage-description-${index}`"
                class="input mb-3"
                rows="5"
                v-model="stage.description"
              />
            </div>
            <Button
              label="Удалить этап"
              severity="danger"
              icon="pi pi-trash"
              @click="() => removeStage(index)"
            />
          </div>
        </template>
        <div class="flex gap-3 mb-3">
          <div class="flex align-items-center">
            <RadioButton
              inputId="interviewResult1"
              name="result"
              value="Refusal"
              v-model="interview.result"
            />
            <label for="interviewResult1" class="ml-2">Отказ</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton
              inputId="interviewResult2"
              name="result"
              value="Offer"
              v-model="interview.result"
            />
            <label for="interviewResult2" class="ml-2">Оффер</label>
          </div>
        </div>
        <Button label="Сохранить" icon="pi pi-save" @click="saveInterview" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  InputText,
  InputNumber,
  Textarea,
  Button,
  DatePicker,
  RadioButton,
  ProgressSpinner,
} from 'primevue'
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview, IStage } from '@/interfaces'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()
const isLoading = ref<boolean>(true)
const interview = ref<IInterview>()
const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

async function getData(): Promise<void> {
  isLoading.value = true
  const docSnap = await getDoc(docref)

  if (docSnap) {
    const data = docSnap.data() as IInterview
    if (data.stage && data.stage.length) {
      data.stage = data.stage.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return { ...stage, date: stage.date.toDate() }
        }
        return stage
      })
    }
    interview.value = data
  }
  isLoading.value = false
}

function addStage() {
  if (interview.value) {
    if (!interview.value.stage) {
      interview.value.stage = []
    }
    interview.value.stage.push({ name: '', date: null, description: '' })
  }
}

function removeStage(idx: number) {
  if (interview.value) {
    if (interview.value.stage) {
      interview.value.stage.splice(idx, 1)
    }
  }
}

async function saveInterview(): Promise<void> {
  isLoading.value = true
  await updateDoc(docref, { ...interview.value })
  await getData()
  isLoading.value = false
}

onMounted(async () => {
  await getData()
})
</script>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
