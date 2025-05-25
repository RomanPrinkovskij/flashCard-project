<template>
  <div class="p-4 min-h-screen flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Редагування колоди:</h2>
      <div class="flex justify-center">
        <button v-if="!loading" class="btn btn-primary" @click="openAddModal">
          Додати картку
        </button>
      </div>
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

    <div
      v-if="loading"
      class="flex-grow flex justify-center items-center text-gray-600 text-lg"
    >
      Завантаження карток...
    </div>

    <div v-else>
      <div v-if="textPartListOne.length === 0" class="text-gray-500 mb-8">
        Немає карток
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
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
                @click.stop="openEditModal(item)"
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

    <!-- Add Card Modal -->
    <transition name="fade">
      <div
        v-if="isAdding"
        class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        @click.self="closeAddModal"
      >
        <div
          class="bg-white rounded-lg p-6 w-full h-full max-w-none max-h-none overflow-auto relative"
          @click.stop
        >
          <h3 class="text-2xl font-semibold mb-6">Додати картку</h3>
          <input
            v-model="newQuestion"
            placeholder="Питання"
            class="input input-bordered w-full mb-4"
          />
          <input
            v-model="newAnswer"
            placeholder="Відповідь"
            class="input input-bordered w-full mb-4"
          />
          <!-- File input for image upload -->
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="mb-6"
          />
          <div class="flex justify-end gap-4">
            <button
              class="btn btn-success"
              @click="addItem"
              :disabled="addingLoading"
            >
              <span v-if="!addingLoading">Зберегти</span>
              <svg
                v-else
                class="animate-spin h-5 w-5 text-white inline-block"
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
            <button
              class="btn btn-warning"
              @click="closeAddModal"
              :disabled="addingLoading"
            >
              Скасувати
            </button>
          </div>
          <button
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none"
            @click="closeAddModal"
            aria-label="Close"
            :disabled="addingLoading"
          >
            &times;
          </button>
        </div>
      </div>
    </transition>

    <!-- Edit Card Modal -->
    <transition name="fade">
      <div
        v-if="isEditing"
        class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        @click.self="cancelEdit"
      >
        <div
          class="bg-white rounded-lg p-6 w-full h-full max-w-none max-h-none overflow-auto relative"
          @click.stop
        >
          <h3 class="text-2xl font-semibold mb-6">Редагувати картку</h3>
          <input
            v-model="editQuestion"
            placeholder="Питання"
            class="input input-bordered w-full mb-4"
          />
          <input
            v-model="editAnswer"
            placeholder="Відповідь"
            class="input input-bordered w-full mb-6"
          />
          <div class="flex justify-end gap-4">
            <button class="btn btn-success" @click="saveEdit">
              Зберегти зміни
            </button>
            <button class="btn btn-warning" @click="cancelEdit">
              Скасувати
            </button>
          </div>
          <button
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none"
            @click="cancelEdit"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const hoveredIndex = ref<number | null>(null);
const textPartListOne = ref<
  { cardId: number; question: string; answer: string; imageUrl: string; deckId: number }[]
>([]);

const logoutLoading = ref(false);
const loading = ref(true);

const isAdding = ref(false);
const newQuestion = ref('');
const newAnswer = ref('');
const selectedFile = ref<File | null>(null);
const addingLoading = ref(false);

const isEditing = ref(false);
const editCardId = ref<number | null>(null);
const editQuestion = ref('');
const editAnswer = ref('');

function openAddModal() {
  isAdding.value = true;
  newQuestion.value = '';
  newAnswer.value = '';
  selectedFile.value = null;
}

function closeAddModal() {
  if (addingLoading.value) return;
  isAdding.value = false;
  newQuestion.value = '';
  newAnswer.value = '';
  selectedFile.value = null;
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  } else {
    selectedFile.value = null;
  }
}

async function addItem() {
  if (!newQuestion.value.trim() || !newAnswer.value.trim()) {
    alert('Будь ласка, заповніть питання та відповідь.');
    return;
  }

  addingLoading.value = true;
  try {
    const token = localStorage.getItem('accessToken');
    const deckId = Number(route.query.deckId);
    if (!deckId || !token) {
      throw new Error('Невірний deckId або відсутній токен');
    }

    // 1) Створити картку
    const createRes = await fetch('http://localhost:42069/card', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: newQuestion.value.trim(),
        answer: newAnswer.value.trim(),
        deckId,
      }),
    });

    if (!createRes.ok) {
      const text = await createRes.text();
      throw new Error(`Помилка створення картки: ${text}`);
    }

    const newCard = await createRes.json(); // { id, question, answer, imageUrl, deckId }

    // 2) Завантажити файл, якщо він обраний
    if (selectedFile.value) {
      const formData = new FormData();
      formData.append('file', selectedFile.value);

      const uploadRes = await fetch(
        `http://localhost:42069/card/upload-image/${newCard.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Не вдалося завантажити зображення: ${errText}`);
      }
    }

    // 3) Оновити список карток
    await fetchCards();
    closeAddModal();
  } catch (err: any) {
    alert(err.message || 'Помилка при створенні картки');
  } finally {
    addingLoading.value = false;
  }
}

async function fetchCards() {
  loading.value = true;
  try {
    const token = localStorage.getItem('accessToken');
    const deckId = Number(route.query.deckId);
    if (!deckId || !token) throw new Error('Невірний deckId або відсутній токен');

    const res = await fetch(`http://localhost:42069/card/deck/${deckId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Не вдалося завантажити картки');
    const data = await res.json(); // масив карток
    textPartListOne.value = data.map((card: any) => ({
      cardId: card.id,
      question: card.question,
      answer: card.answer,
      imageUrl: card.imageUrl || '',
      deckId: card.deckId,
    }));
  } catch (error: any) {
    alert('Помилка при завантаженні карток: ' + error.message);
  } finally {
    loading.value = false;
  }
}

function openEditModal(item: { cardId: number; question: string; answer: string }) {
  isEditing.value = true;
  editCardId.value = item.cardId;
  editQuestion.value = item.question;
  editAnswer.value = item.answer;
}

function cancelEdit() {
  isEditing.value = false;
  editCardId.value = null;
  editQuestion.value = '';
  editAnswer.value = '';
}

async function saveEdit() {
  if (!editQuestion.value.trim() || !editAnswer.value.trim()) {
    alert('Будь ласка, заповніть питання та відповідь.');
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    if (!editCardId.value || !token) throw new Error('Невірний ID чи відсутній токен');

    const res = await fetch(`http://localhost:42069/card/${editCardId.value}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: editQuestion.value.trim(),
        answer: editAnswer.value.trim(),
      }),
    });
    if (!res.ok) throw new Error('Не вдалося оновити картку');

    await fetchCards();
    cancelEdit();
  } catch (error: any) {
    alert('Помилка при оновленні картки: ' + error.message);
  }
}

async function deleteCard(index: number) {
  const cardId = textPartListOne.value[index].cardId;
  if (!confirm('Ви впевнені, що хочете видалити цю картку?')) return;

  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Відсутній токен');

    const res = await fetch(`http://localhost:42069/card/${cardId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Не вдалося видалити картку');

    textPartListOne.value.splice(index, 1);
  } catch (error: any) {
    alert('Помилка при видаленні картки: ' + error.message);
  }
}

async function logout() {
  logoutLoading.value = true;
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      await fetch('http://localhost:42069/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    router.push('/login');
  } catch {
    alert('Помилка при виході');
  } finally {
    logoutLoading.value = false;
  }
}

onMounted(() => {
  fetchCards();
});
</script>

<style scoped>
.logout-btn {
  /* Custom logout button styling if needed */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
