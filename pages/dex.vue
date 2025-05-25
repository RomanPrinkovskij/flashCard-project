<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Колоди</h2>
      <div class="flex gap-2">
        <button class="btn btn-primary" @click="isForm = !isForm">
          {{ isForm ? 'Скасувати' : 'Додати колоду' }}
        </button>
        <button
          class="btn btn-primary logout-btn"
          @click="logout"
          :disabled="logoutLoading"
        >
          <span v-if="!logoutLoading">Вийти</span>
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
        v-model="title"
        placeholder="Назва колоди"
        class="input input-bordered w-full"
      />
      <input
        v-model="description"
        placeholder="Опис"
        class="input input-bordered w-full"
      />
      <button class="btn btn-success" @click="addDeck">Зберегти</button>
    </div>

    <div v-if="decks.length === 0" class="text-gray-500">Немає колод</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(deck, index) in decks"
        :key="deck.deckId"
        class="relative cursor-pointer rounded-[1.25rem] bg-base-100 shadow-xl overflow-hidden transition-shadow duration-300"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <!-- Основний контент колоди -->
        <div
          class="p-4 rounded-[1.25rem] transition-colors duration-300"
          :class="
            hoveredIndex === index
              ? 'text-gray-300 bg-primary/20'
              : 'text-gray-800'
          "
        >
          <h3 class="card-title text-lg font-semibold">{{ deck.title }}</h3>
          <p class="mb-2">{{ deck.description }}</p>
          <span
            class="text-sm"
            :class="hoveredIndex === index ? 'text-gray-400' : 'text-gray-500'"
          >
            Карток: {{ deck.cardCount }}
          </span>
        </div>

        <!-- Напівпрозорий оверлей з кнопками -->
        <transition name="fade">
          <div
            v-if="hoveredIndex === index"
            class="absolute inset-0 bg-primary/70 flex justify-center items-center gap-4 text-white rounded-[1.25rem]"
          >
            <NuxtLink
              :to="`/cards?deckId=${deck.deckId}`"
              class="btn btn-link text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
              >Редагувати</NuxtLink
            >
            <button
              class="btn btn-link text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
              @click.prevent="startDeck(deck.deckId)"
            >
              Запустити
            </button>
            <button
              class="btn btn-link text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
              @click.prevent="deleteDeck(index)"
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isForm = ref(false);
const title = ref('');
const description = ref('');
const hoveredIndex = ref<number | null>(null);

const decks = ref<
  {
    deckId: number;
    title: string;
    description: string;
    cardCount: number;
  }[]
>([]);

const logoutLoading = ref(false);

async function addDeck() {
  if (!title.value.trim() || !description.value.trim()) return;

  const token = localStorage.getItem('accessToken');
  const subjectId = Number(route.query.subjectId);

  try {
    await $fetch('/deck', {
      method: 'POST',
      baseURL: 'http://localhost:42069',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: title.value,
        description: description.value,
        subjectId
      }
    });

    title.value = '';
    description.value = '';
    isForm.value = false;

    await fetchDecks();
  } catch (err) {
    console.error('Failed to create deck:', err);
  }
}

async function fetchDecks() {
  const token = localStorage.getItem('accessToken');
  const subjectId = Number(route.query.subjectId);

  if (!token || !subjectId) return;

  try {
    const response = await $fetch(
      `http://localhost:42069/deck/subject/${subjectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const deckList = (response as any)?.data || response || [];

    decks.value = deckList.map((deck: any) => ({
      deckId: deck.id,
      title: deck.name,
      description: deck.description,
      cardCount: 0
    }));

    await Promise.all(
      decks.value.map(async (deck, index) => {
        try {
          const cardsResponse = await $fetch(
            `http://localhost:42069/card/deck/${deck.deckId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          const cards = (cardsResponse as any)?.data || cardsResponse || [];
          decks.value[index].cardCount = cards.length;
        } catch (error) {
          console.error(`Failed to fetch cards for deck ${deck.deckId}`, error);
        }
      })
    );
  } catch (err) {
    console.error('Failed to fetch decks:', err);
  }
}

async function deleteDeck(index: number) {
  const deck = decks.value[index];
  if (!deck) return;

  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    await $fetch(`/deck/${deck.deckId}`, {
      method: 'DELETE',
      baseURL: 'http://localhost:42069',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    decks.value.splice(index, 1);
    hoveredIndex.value = null;
  } catch (error) {
    console.error(`Failed to delete deck ${deck.deckId}`, error);
    alert('Не вдалося видалити колоду. Спробуйте пізніше.');
  }
}

function startDeck(deckId: number) {
  router.push({ path: '/play', query: { deckId: deckId.toString() } });
}

async function logout() {
  logoutLoading.value = true;
  try {
    await $fetch('/auth/logout', {
      method: 'POST',
      baseURL: 'http://localhost:42069',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/');
  } catch (e) {
    alert('Logout failed: ' + e);
  } finally {
    logoutLoading.value = false;
  }
}

onMounted(() => {
  fetchDecks();
});
</script>

<style scoped>
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

.btn-link {
  text-decoration: none !important;
}

/* Стилі для logout кнопки */
.logout-btn {
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;
}

.logout-btn:hover {
  background-color: #dc2626; /* Червоний колір Tailwind red-600 */
  border-color: #dc2626;
  color: white;
}
</style>
