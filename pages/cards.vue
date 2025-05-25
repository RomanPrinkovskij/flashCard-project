<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Картки</h2>
      <button class="btn btn-primary" @click="isForm = !isForm">
        {{ isForm ? 'Скасувати' : 'Додати картку' }}
      </button>
    </div>

    <div v-if="isForm" class="mb-4 space-y-2">
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

    <div v-if="textPartListOne.length === 0" class="text-gray-500">
      Немає карток
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, index) in textPartListOne"
        :key="index"
        class="card bg-base-100 shadow-xl"
      >
        <div class="card-body">
          <h3 class="card-title">{{ item.question }}</h3>
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

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

onMounted(() => {
  fetchCards();
});
</script>
