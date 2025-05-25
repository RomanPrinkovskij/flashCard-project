<template>
  <div class="p-4 flex flex-col items-center">
    <h2 class="text-2xl font-bold mb-6">Почали!</h2>

    <div
      class="relative w-[600px] h-[400px] cursor-pointer perspective"
      @click="flipCard = !flipCard"
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

    <div class="mt-4 flex gap-4">
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
import { useRoute } from 'vue-router';

const route = useRoute();

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
</style>
