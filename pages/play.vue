<template>
  <div class="p-4 flex flex-col items-center">
    <h2 class="text-2xl font-bold mb-4">Почали!</h2>

    <div class="flex gap-2 mb-6">
      <!-- Кнопка додавання картки -->
      <button class="btn btn-primary" @click="isForm = !isForm">
        {{ isForm ? 'Скасувати' : 'Додати картку' }}
      </button>

      <!-- Кнопка логаут -->
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

    <!-- Форма додавання картки -->
    <div v-if="isForm" class="mb-6 w-[600px] space-y-2">
      <input
        v-model="question"
        placeholder="Питання"
        class="input input-bordered w-full"
      />
      <input
        v-model="answer"
        placeholder="Відповідь"
        class="input input-bordered w-full"
      />
      <button class="btn btn-success" @click="addItem">Зберегти</button>
    </div>

    <div
      class="relative w-[600px] h-[400px] cursor-pointer perspective"
      @click="flipCard = !flipCard"
      v-if="textPartListOne.length > 0"
    >
      <div
        class="absolute w-full h-full rounded-xl shadow-lg transition-transform duration-500"
        :class="{ 'rotate-y-180': flipCard }"
        style="transform-style: preserve-3d"
      >
        <!-- Лицьова сторона (Питання) -->
        <div
          class="absolute w-full h-full bg-white rounded-xl flex items-center justify-center p-4 text-center text-lg font-semibold"
          style="backface-visibility: hidden"
        >
          {{ currentCard.question }}
        </div>

        <!-- Зворотня сторона (Відповідь) -->
        <div
          class="absolute w-full h-full bg-gray-100 rounded-xl flex items-center justify-center p-4 text-center text-lg font-semibold rotate-y-180"
          style="backface-visibility: hidden"
        >
          {{ currentCard.answer }}
        </div>
      </div>
    </div>

    <div class="mt-4 flex gap-4" v-if="textPartListOne.length > 0">
      <button class="btn btn-primary" @click="prevCard">Попередня</button>
      <button class="btn btn-primary" @click="nextCard">Наступна</button>
    </div>

    <div v-if="textPartListOne.length === 0" class="text-gray-500 mt-6">
      Немає карток
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isForm = ref(false);
const question = ref('');
const answer = ref('');

const textPartListOne = ref<
  {
    cardId: number;
    question: string;
    answer: string;
    image: string;
    deckId: number;
  }[]
>([]);

const currentIndex = ref(0);
const flipCard = ref(false);

const logoutLoading = ref(false);

const currentCard = computed(() => {
  return textPartListOne.value.length > 0
    ? textPartListOne.value[currentIndex.value]
    : { question: '', answer: '', cardId: 0, image: '', deckId: 0 };
});

function nextCard() {
  flipCard.value = false;
  currentIndex.value = (currentIndex.value + 1) % textPartListOne.value.length;
}

function prevCard() {
  flipCard.value = false;
  currentIndex.value =
    (currentIndex.value - 1 + textPartListOne.value.length) %
    textPartListOne.value.length;
}

async function fetchCards() {
  const token = localStorage.getItem('accessToken');
  const deckId = Number(route.query.deckId);
  if (!token || !deckId) return;

  try {
    const response = await $fetch(
      `http://localhost:42069/card/deck/${deckId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const cards = (response as any)?.data || response || [];

    textPartListOne.value = cards.map((card: any) => ({
      cardId: card.id,
      question: card.question,
      answer: card.answer,
      image: '/images/folder.png',
      deckId: card.deckId
    }));

    currentIndex.value = 0; // почати з першої картки
  } catch (err) {
    console.error('Failed to fetch cards:', err);
  }
}

async function addItem() {
  if (!question.value.trim() || !answer.value.trim()) return;

  const token = localStorage.getItem('accessToken');
  const deckId = Number(route.query.deckId);

  if (!deckId) {
    console.error('Deck ID is missing or invalid');
    return;
  }

  try {
    await $fetch('/card', {
      method: 'POST',
      baseURL: 'http://localhost:42069',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        question: question.value,
        answer: answer.value,
        deckId
      }
    });

    question.value = '';
    answer.value = '';
    isForm.value = false;

    await fetchCards();
  } catch (err) {
    console.error('Failed to create card:', err);
  }
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
  fetchCards();
});
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

/* Стилі для кнопки логаут */
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
