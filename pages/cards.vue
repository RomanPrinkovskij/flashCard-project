<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Картки</h2>
      <div class="flex gap-2">
        <button
          class="btn btn-primary"
          @click="isForm = !isForm"
          v-if="!isEditing"
        >
          {{ isForm ? 'Скасувати' : 'Додати картку' }}
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

    <!-- Форма додавання нової картки -->
    <div v-if="isForm && !isEditing" class="mb-4 space-y-2">
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

    <!-- Форма редагування картки -->
    <div v-if="isEditing" class="mb-4 space-y-2">
      <input
        v-model="editQuestion"
        placeholder="Питання"
        class="input input-bordered w-full"
      />
      <input
        v-model="editAnswer"
        placeholder="Відповідь"
        class="input input-bordered w-full"
      />
      <div class="flex gap-2">
        <button class="btn btn-success" @click="saveEdit">
          Зберегти зміни
        </button>
        <button class="btn btn-warning" @click="cancelEdit">Скасувати</button>
      </div>
    </div>

    <div v-if="textPartListOne.length === 0" class="text-gray-500">
      Немає карток
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, index) in textPartListOne"
        :key="item.cardId"
        class="relative card bg-base-100 shadow-xl cursor-pointer"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <div class="card-body">
          <h3 class="card-title">{{ item.question }}</h3>
          <p>{{ item.answer }}</p>
        </div>

        <!-- Оверлей з кнопками при ховері -->
        <transition name="fade">
          <div
            v-if="hoveredIndex === index"
            class="absolute inset-0 bg-primary/70 flex justify-center items-center gap-4 text-white rounded-lg"
          >
            <button
              class="btn btn-link text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
              @click.stop="startEdit(item)"
            >
              Редагувати
            </button>
            <button
              class="btn btn-link text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
              @click.stop="deleteCard(index)"
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
const isEditing = ref(false);
const hoveredIndex = ref<number | null>(null);

const question = ref('');
const answer = ref('');

const editCardId = ref<number | null>(null);
const editQuestion = ref('');
const editAnswer = ref('');

const textPartListOne = ref<
  {
    cardId: number;
    question: string;
    answer: string;
    image: string;
    deckId: number;
  }[]
>([]);

const logoutLoading = ref(false);

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
  } catch (err) {
    console.error('Failed to fetch cards:', err);
  }
}

function startEdit(card: (typeof textPartListOne.value)[0]) {
  editCardId.value = card.cardId;
  editQuestion.value = card.question;
  editAnswer.value = card.answer;
  isEditing.value = true;
  isForm.value = false;
}

function cancelEdit() {
  isEditing.value = false;
  editCardId.value = null;
  editQuestion.value = '';
  editAnswer.value = '';
}

async function saveEdit() {
  if (
    !editQuestion.value.trim() ||
    !editAnswer.value.trim() ||
    editCardId.value === null
  )
    return;

  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('Ви не авторизовані. Будь ласка, увійдіть в систему.');
    return;
  }

  try {
    await $fetch(`/card/${editCardId.value}`, {
      method: 'PATCH',
      baseURL: 'http://localhost:42069',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        question: editQuestion.value,
        answer: editAnswer.value
      }
    });

    const cardIndex = textPartListOne.value.findIndex(
      (c) => c.cardId === editCardId.value
    );
    if (cardIndex !== -1) {
      textPartListOne.value[cardIndex].question = editQuestion.value;
      textPartListOne.value[cardIndex].answer = editAnswer.value;
    }

    cancelEdit();
  } catch (err) {
    console.error('Failed to update card:', err);
    alert('Не вдалося зберегти зміни. Спробуйте пізніше.');
  }
}

async function deleteCard(index: number) {
  const card = textPartListOne.value[index];
  if (!card) return;

  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    await $fetch(`/card/${card.cardId}`, {
      method: 'DELETE',
      baseURL: 'http://localhost:42069',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    textPartListOne.value.splice(index, 1);
    hoveredIndex.value = null;
  } catch (err) {
    console.error('Failed to delete card:', err);
    alert('Не вдалося видалити картку. Спробуйте пізніше.');
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
