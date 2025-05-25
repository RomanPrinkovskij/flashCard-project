<template>
  <div class="min-h-screen w-full p-4 bg-base-100 flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Колоди</h2>
      <div class="flex gap-2">
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

    <!-- Modal for adding deck -->
    <transition name="fade">
      <div
        v-if="isForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      >
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
          <button
            class="absolute top-2 right-2 btn btn-sm btn-circle"
            @click="isForm = false"
          >
            ✕
          </button>
          <h3 class="text-xl font-bold mb-4">Додати колоду</h3>
          <input
            v-model="title"
            placeholder="Назва колоди"
            class="input input-bordered w-full mb-2"
          />
          <input
            v-model="description"
            placeholder="Опис"
            class="input input-bordered w-full mb-4"
          />
          <div class="flex justify-end gap-2">
            <button class="btn" @click="isForm = false">Скасувати</button>
            <button
              class="btn btn-success"
              :disabled="createMutation.isPending.value"
              @click="addDeck"
            >
              <span v-if="!createMutation.isPending.value">Зберегти</span>
              <svg
                v-else
                class="animate-spin h-5 w-5 text-white"
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
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for delete confirmation -->
    <transition name="fade">
      <div
        v-if="deleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      >
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
          <button
            class="absolute top-2 right-2 btn btn-sm btn-circle"
            @click="closeDeleteModal"
          >
            ✕
          </button>
          <h3 class="text-xl font-bold mb-4">Видалити колоду?</h3>
          <p class="mb-4">
            Ви впевнені, що хочете видалити цю колоду? Дію не можна скасувати.
          </p>
          <div class="flex justify-end gap-2">
            <button class="btn" @click="closeDeleteModal">Скасувати</button>
            <button
              class="btn btn-error"
              :disabled="deleteMutation.isPending.value"
              @click="confirmDelete"
            >
              <span v-if="!deleteMutation.isPending.value">Видалити</span>
              <svg
                v-else
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="flex-1 flex flex-col">
      <div
        v-if="deckList.length === 0 && !deckQuery.isLoading.value"
        class="text-gray-500"
      >
        Немає колод
      </div>
      <div v-else-if="deckQuery.isLoading.value" class="text-gray-500">
        Завантаження...
      </div>
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1"
      >
        <div
          v-for="(deck, index) in deckList"
          :key="deck.id"
          class="relative cursor-pointer rounded-[1.25rem] bg-base-100 shadow-xl overflow-hidden transition-shadow duration-300 group border border-transparent hover:shadow-2xl hover:border-primary"
        >
          <NuxtLink
            :to="`/cards?deckId=${deck.id}`"
            class="block p-4 rounded-[1.25rem] transition-colors duration-300 no-underline h-full"
            :class="'text-gray-800'"
          >
            <h3 class="card-title text-lg font-semibold no-underline">
              {{ deck.name }}
            </h3>
            <p class="mb-2 no-underline">{{ deck.description }}</p>
            <span class="text-sm text-gray-500"
              >Карток: {{ deck.cardCount ?? 0 }}</span
            >
          </NuxtLink>
          <!-- Play icon in the center, visible on hover, navigates to play -->
          <span
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg"
            style="width: 4.5rem; height: 4.5rem; font-size: 2.5rem"
            @click.stop="startDeck(deck.id)"
            title="Почати"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
            </svg>
          </span>
          <div
            class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <button
              class="btn btn-md btn-circle btn-ghost"
              title="Редагувати"
              @click.stop="startDeckEditing(deck.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2H7v-2l6-6z"
                />
              </svg>
            </button>
            <button
              class="btn btn-md btn-circle btn-ghost"
              title="Видалити"
              @click.stop="openDeleteModal(deck.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-6">
      <button class="btn btn-primary" @click="isForm = true">Додати</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useDeckControllerFindBySubject,
  useDeckControllerCreate,
  useDeckControllerRemove,
  useDeckControllerUpdate,
} from "~/api/generated/decks/decks";
import { useAuthControllerLogout } from "~/api/generated/auth/auth";

const route = useRoute();
const router = useRouter();

const isForm = ref(false);
const title = ref("");
const description = ref("");

const deckQuery = useDeckControllerFindBySubject(
  computed(() => route.query.subjectId?.toString() ?? "")
);
const deckList = computed(() =>
  (deckQuery.data.value || []).map((deck: any) => ({
    ...deck,
    cardCount: deck.cards?.length ?? 0,
  }))
);
// Delete modal state
const deleteModalOpen = ref(false);
const deckIdToDelete = ref<number | null>(null);
const deleteMutation = useDeckControllerRemove();

function openDeleteModal(id: number) {
  deckIdToDelete.value = id;
  deleteModalOpen.value = true;
}

function closeDeleteModal() {
  deckIdToDelete.value = null;
  deleteModalOpen.value = false;
}

async function confirmDelete() {
  if (deckIdToDelete.value == null) return;
  try {
    await deleteMutation.mutateAsync({ id: deckIdToDelete.value.toString() });
    closeDeleteModal();
    await deckQuery.refetch();
  } catch (error) {
    alert("Не вдалося видалити колоду. Спробуйте пізніше.");
  }
}

// Create deck mutation
const createMutation = useDeckControllerCreate();

async function addDeck() {
  if (!title.value.trim() || !description.value.trim()) return;
  const subjectId = route.query.subjectId;
  if (!subjectId) return;

  try {
    await createMutation.mutateAsync({
      data: {
        name: title.value,
        description: description.value,
        subjectId: Number(subjectId),
      },
    });

    title.value = "";
    description.value = "";
    isForm.value = false;

    await deckQuery.refetch();
  } catch (err) {
    console.error("Failed to create deck:", err);
  }
}

function startDeck(deckId: number) {
  router.push({ path: "/play", query: { deckId: deckId.toString() } });
}

function startDeckEditing(deckId: number) {
   router.push({ path: "/cards", query: { deckId: deckId.toString() } });
}

const logoutMutation = useAuthControllerLogout();

async function logout() {
  logoutMutation.mutate(undefined, {
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/");
    },
    onError: (error) => {
      alert("Logout failed: " + error);
    },
  });
}
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
.no-underline {
  text-decoration: none !important;
}
</style> 