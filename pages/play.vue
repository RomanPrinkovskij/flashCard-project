<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-base-100 px-4">
    <h2 class="text-3xl font-bold mb-8 text-center">{{ deckTitle }}</h2>

    <!-- Card flip area -->
    <div
      class="relative w-full max-w-xl h-[420px] cursor-pointer perspective"
      @click="flipCard = !flipCard"
      v-if="textPartListOne.length > 0"
    >
      <div
        class="absolute w-full h-full rounded-xl shadow-xl transition-transform duration-500"
        :class="{ 'rotate-y-180': flipCard }"
        style="transform-style: preserve-3d"
      >
        <!-- Front (Question) -->
        <div
          class="absolute w-full h-full bg-white rounded-xl flex flex-col items-center justify-center p-6 text-center text-2xl font-semibold space-y-4"
          style="backface-visibility: hidden"
        >
          <img
            v-if="currentCard.imgUrl"
            :src="currentCard.imgUrl"
            alt="Question image"
            class="max-h-48 object-contain rounded shadow"
          />
          <span>
            {{ currentCard.question }}
          </span>
        </div>

        <!-- Back (Answer) -->
        <div
          class="absolute w-full h-full bg-gray-100 rounded-xl flex items-center justify-center p-8 text-center text-2xl font-semibold rotate-y-180"
          style="backface-visibility: hidden"
        >
          {{ currentCard.answer }}
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex items-center gap-8" v-if="textPartListOne.length > 0">
      <button class="arrow-btn" @click="prevCard" aria-label="Попередня">
        <span class="arrow arrow-left">&lt;</span>
      </button>
      <span class="text-lg font-medium select-none">
        {{ currentIndex + 1 }} / {{ textPartListOne.length }}
      </span>
      <button class="arrow-btn" @click="nextCard" aria-label="Наступна">
        <span class="arrow arrow-right">&gt;</span>
      </button>
    </div>

    <!-- No cards -->
    <div v-if="textPartListOne.length === 0" class="text-gray-500 mt-6 text-xl">
      Немає карток
    </div>

    <!-- Back to catalog -->
    <a
      href="http://localhost:3000/catalog"
      class="mt-12 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium shadow transition"
    >
      Повернутись в каталог
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDeckControllerFindOne } from '~/api/generated/decks/decks';

const route = useRoute();
const deckId = Number(route.query.deckId);

// Fetch deck data
const { data: deckData } = useDeckControllerFindOne(deckId.toString());

const currentIndex = ref(0);
const flipCard = ref(false);

// Cards array
const textPartListOne = computed(() => deckData.value?.cards ?? []);

// Current card
const currentCard = computed(() => {
  return textPartListOne.value.length > 0
    ? textPartListOne.value[currentIndex.value]
    : { question: '', answer: '', cardId: 0, imgUrl: '', deckId: 0 };
});

// Deck title
const deckTitle = computed(() => deckData.value?.name ?? 'Флеш-картки');

// Navigation
function nextCard(event?: Event) {
  if (event) event.stopPropagation();
  flipCard.value = false;
  currentIndex.value = (currentIndex.value + 1) % textPartListOne.value.length;
}

function prevCard(event?: Event) {
  if (event) event.stopPropagation();
  currentIndex.value =
    (currentIndex.value - 1 + textPartListOne.value.length) % textPartListOne.value.length;
  flipCard.value = false;
}

// Keyboard navigation
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (textPartListOne.value.length === 0) return;
    if (e.key === 'ArrowRight') nextCard();
    if (e.key === 'ArrowLeft') prevCard();
  });
}
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.arrow-btn {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  transition: background 0.15s;
}

.arrow {
  color: #2563eb; /* blue-600 */
  font-size: 2.5rem;
  font-weight: bold;
  user-select: none;
  line-height: 1;
  transition: color 0.15s, text-shadow 0.15s;
}

.arrow-btn:hover .arrow,
.arrow-btn:focus .arrow {
  color: #1d4ed8; /* blue-700 */
  text-shadow: 0 2px 8px #93c5fd;
}

.arrow-btn:focus {
  outline: none;
}
</style>
