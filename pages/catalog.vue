<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Каталоги</h2>
      <div class="flex gap-2">
        <button class="btn btn-primary" @click="isForm = !isForm">
          {{ isForm ? 'Скасувати' : 'Додати каталог' }}
        </button>
        <button
          class="btn btn-outline btn-error"
          @click="logout"
          :disabled="logoutMutation.isPending.value"
        >
          <span v-if="!logoutMutation.isPending.value">Вийти</span>
          <svg
            v-else
            class="animate-spin h-5 w-5 text-error"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="isForm" class="mb-4 space-y-2">
      <input
        v-model="name"
        placeholder="Назва каталогу"
        class="input input-bordered w-full"
      />
      <input
        v-model="description"
        placeholder="Опис каталогу"
        class="input input-bordered w-full"
      />
      <button class="btn btn-success" @click="addItem">Зберегти</button>
    </div>

    <div v-if="textPartListOne.length === 0" class="text-gray-500">
      Немає каталогів
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, index) in textPartListOne"
        :key="item.subjectId"
        class="relative cursor-pointer rounded-[1.25rem] bg-base-100 shadow-xl overflow-hidden transition-shadow duration-300"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <NuxtLink
          :to="`/dex?subjectId=${item.subjectId}`"
          class="block p-4 rounded-[1.25rem] transition-colors duration-300 no-underline"
          :class="
            hoveredIndex === index
              ? 'text-gray-300 bg-primary/20'
              : 'text-gray-800'
          "
        >
          <h3 class="card-title text-lg font-semibold no-underline">
            {{ item.title }}
          </h3>
          <p class="mb-2 no-underline">{{ item.description }}</p>
          <span
            class="text-sm"
            :class="hoveredIndex === index ? 'text-gray-400' : 'text-gray-500'"
          >
            Колод: {{ item.cards }}
          </span>
        </NuxtLink>

        <!-- Оверлей кнопок при ховері -->
        <transition name="fade">
          <div
            v-if="hoveredIndex === index"
            class="absolute inset-0 bg-primary/70 flex justify-center items-center gap-4 text-white rounded-[1.25rem]"
          >
            <NuxtLink
              :to="`/dex?subjectId=${item.subjectId}`"
              class="btn btn-link text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded no-underline"
              >Редагувати</NuxtLink
            >
            <button
              class="btn btn-link text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded no-underline"
              @click.prevent="deleteItem(index)"
            >
              Видалити
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthControllerLogout } from '~/api/generated/auth/auth';

const router = useRouter();

const textPartListOne = ref<
  {
    title: string;
    cards: string;
    image: string;
    subjectId: number;
    description: string;
  }[]
>([]);

const isForm = ref(false);
const name = ref('');
const description = ref('');
const hoveredIndex = ref<number | null>(null);

async function addItem() {
  if (!name.value.trim() || !description.value.trim()) return;

  const token = localStorage.getItem('accessToken');

  try {
    await $fetch('/subject', {
      method: 'POST',
      baseURL: 'http://localhost:42069',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: name.value,
        description: description.value
      }
    });

    name.value = '';
    description.value = '';
    isForm.value = false;

    await fetchSubjects();
  } catch (err) {
    console.error('Failed to create subject:', err);
  }
}

async function fetchSubjects() {
  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    const response = await $fetch('http://localhost:42069/subject', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const subjects = (response as any)?.data || response || [];

    textPartListOne.value = subjects.map((subject: any) => ({
      title: subject.name,
      description: subject.description || '',
      cards: '0',
      image: '/images/folder.png',
      subjectId: subject.id
    }));

    await Promise.all(
      textPartListOne.value.map(async (item, index) => {
        try {
          const decksResponse = await $fetch(
            `http://localhost:42069/deck/subject/${item.subjectId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          const decks = (decksResponse as any)?.data || decksResponse || [];
          textPartListOne.value[index].cards = decks.length.toString();
        } catch (error) {
          console.error(
            `Failed to fetch decks for subject ${item.subjectId}`,
            error
          );
        }
      })
    );
  } catch (err) {
    console.error('Failed to fetch subjects:', err);
  }
}

async function deleteItem(index: number) {
  const item = textPartListOne.value[index];
  if (!item) return;

  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    await $fetch(`/subject/${item.subjectId}`, {
      method: 'DELETE',
      baseURL: 'http://localhost:42069',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    textPartListOne.value.splice(index, 1);
    hoveredIndex.value = null;
  } catch (error) {
    console.error(`Failed to delete subject ${item.subjectId}`, error);
    alert('Не вдалося видалити каталог. Спробуйте пізніше.');
  }
}

// Логіка логауту
const logoutMutation = useAuthControllerLogout();

async function logout() {
  logoutMutation.mutate(undefined, {
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/'); // <-- редірект на стартову сторінку, де рендериться Choosebtn
    },
    onError: (error) => {
      alert('Logout failed: ' + error);
    }
  });
}

onMounted(() => {
  fetchSubjects();
});
</script>

<style scoped>
/* Плавна поява/зникнення оверлею */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Забираємо підкреслення з посилань */
.no-underline {
  text-decoration: none !important;
}
</style>
