<template>
  <ProgressSpinner v-if="isLoading" />
  <Message
    v-else-if="!isLoading && !interviews.length"
    icon="pi pi-exclamation-circle"
    severity="info"
    class="messageSize"
    >Нет добавленных собеседование</Message
  >

  <div v-else>
    <h1>Списко собеседований</h1>
    <div class="flex align-items-center mb-5">
      <div class="flex align-items-center mr-2">
        <RadioButton
          inputId="interviewResult2"
          name="result"
          value="Offer"
          v-model="selectedFilterResult"
        />
        <label for="interviewResult2" class="ml-2">Оффер</label>
      </div>
      <div class="flex align-items-center mr-2">
        <RadioButton
          inputId="interviewResult1"
          name="result"
          value="Refusal"
          v-model="selectedFilterResult"
        />
        <label for="interviewResult1" class="ml-2">Отказ</label>
      </div>
      <Button
        class="mr-2"
        label="Применить"
        @click="submitFilter"
        :disabled="!selectedFilterResult"
      />
      <Button
        label="Сбросить"
        severity="danger"
        @click="clearFiler"
        :disabled="!selectedFilterResult"
      />
    </div>

    <DataTable :value="interviews">
      <Column field="company" header="Компания" />
      <Column field="hrName" header="Имя HR" />
      <Column field="vacancyLink" header="Вакансия">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">Ссылка на вакансию</a>
        </template>
      </Column>
      <Column header="Пройденные этапы">
        <template #body="slotProps">
          <div class="flex gap-2">
            <span v-if="!slotProps.data.stage || slotProps.data.stage.length === 0"
              >Нет пройденных этапов</span
            >
            <div v-else class="interview-stages">
              <Badge
                v-for="(stage, idx) in slotProps.data.stage"
                :key="idx"
                :value="idx + 1"
                rounded
                v-tooltip.top="stage.name"
              />
            </div>
          </div> </template
      ></Column>
      <Column header="Зарплатная вилка">
        <template #body="slotProps">
          <div class="flex gap-2">
            <span v-if="!slotProps.data.salaryFrom">Не заполнено</span>

            <span v-if="slotProps.data.salaryTo"
              >{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span
            >
          </div>
        </template></Column
      >

      <Column header="Результат">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result">Не заполнено</span>
          <template v-else>
            <Badge
              :severity="slotProps.data.result === `Offer` ? 'success' : 'danger'"
              :value="slotProps.data.result === `Offer` ? 'Оффер' : 'Отказ'"
            />
          </template> </template
      ></Column>
      <Column header="Контакты">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/ ${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span> </a
            ><a
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://we.me/ ${slotProps.data.contactWhatsApp}`"
              target="_blank"
              class="contacts__whatsapp"
            >
              <span class="contacts__icon pi pi-whatsapp"></span> </a
            ><a
              v-if="slotProps.data.contactPhone"
              :href="`tel: ${slotProps.data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a></div></template
      ></Column>
      <Column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <RouterLink :to="`/interview/${slotProps.data.id}`">
              <Button icon="pi pi-pencil" severity="info" />
            </RouterLink>

            <Button
              icon="pi pi-trash"
              severity="danger"
              @click="confirmRRemoveinterview(slotProps.data.id)"
            />
          </div> </template
      ></Column>
    </DataTable>
  </div>
  <ConfirmDialog />
</template>

<script setup lang="ts">
import {
  DataTable,
  Column,
  Button,
  ConfirmDialog,
  useConfirm,
  ProgressSpinner,
  Message,
  Badge,
  RadioButton,
} from 'primevue'
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'

const userStore = useUserStore()
const db = getFirestore()
const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)
const confirm = useConfirm()
const selectedFilterResult = ref<string>('')

const getAllInterviews = async <T extends IInterview>(isFilter?: boolean): Promise<T[]> => {
  let getData

  if (isFilter) {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value),
    )
  } else {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
    )
  }

  const listDocs = await getDocs(getData)
  return listDocs.docs.map((doc) => doc.data() as T)
}

async function submitFilter(): Promise<void> {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews(true)
  interviews.value = listInterviews
  isLoading.value = false
}
async function clearFiler(): Promise<void> {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = listInterviews
  isLoading.value = false
}

async function confirmRRemoveinterview(id: string): Promise<void> {
  confirm.require({
    message: 'Вы хотите удалить собеседование?',
    header: 'Удаление сообщения',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    rejectClass: 'p-button-secondary p-button-outlined ',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews/${id}`))

      const listInterviews: Array<IInterview> = await getAllInterviews()
      interviews.value = [...listInterviews]

      isLoading.value = false
    },
  })
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = listInterviews
  isLoading.value = false
})
</script>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.messageSize {
  width: 30%;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>
