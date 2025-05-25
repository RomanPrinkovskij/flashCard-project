<template>
  <div class="min-h-screen w-full p-4 bg-base-100 flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Каталоги</h2>
      <div class="flex gap-2">
        <button
          class="btn btn-outline btn-error"
          @click="logout"
          :disabled="logoutMutation.isPending.value"
        >
          <span v-if="!logoutMutation.isPending.value">Вийти</span>
          <svg v-else class="animate-spin h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal for adding catalog -->
    <transition name="fade">
      <div v-if="isForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
          <button class="absolute top-2 right-2 btn btn-sm btn-circle" @click="isForm = false">✕</button>
          <h3 class="text-xl font-bold mb-4">Додати каталог</h3>
          <input
            v-model="name"
            placeholder="Назва каталогу"
            class="input input-bordered w-full mb-2"
          />
          <input
            v-model="description"
            placeholder="Опис каталогу"
            class="input input-bordered w-full mb-4"
          />
          <div class="flex justify-end gap-2">
            <button class="btn" @click="isForm = false">Скасувати</button>
            <button class="btn btn-success" @click="addItem">Зберегти</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal for editing catalog -->
    <transition name="fade">
      <div v-if="editModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
          <button class="absolute top-2 right-2 btn btn-sm btn-circle" @click="closeEditModal">✕</button>
          <h3 class="text-xl font-bold mb-4">Редагувати каталог</h3>
          <input
            v-model="editName"
            placeholder="Назва каталогу"
            class="input input-bordered w-full mb-2"
          />
          <input
            v-model="editDescription"
            placeholder="Опис каталогу"
            class="input input-bordered w-full mb-4"
          />
          <div class="flex justify-end gap-2">
            <button class="btn" @click="closeEditModal">Скасувати</button>
            <button class="btn btn-success" :disabled="updateMutation.isPending.value" @click="confirmEdit">
              <span v-if="!updateMutation.isPending.value">Зберегти</span>
              <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
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
          <button class="absolute top-2 right-2 btn btn-sm btn-circle" @click="closeDeleteModal">✕</button>
          <h3 class="text-xl font-bold mb-4">Видалити каталог?</h3>
          <p class="mb-4">Ви впевнені, що хочете видалити цей каталог? Дію не можна скасувати.</p>
          <div class="flex justify-end gap-2">
            <button class="btn" @click="closeDeleteModal">Скасувати</button>
            <button class="btn btn-error" :disabled="deleteMutation.isPending.value" @click="confirmDelete">
              <span v-if="!deleteMutation.isPending.value">Видалити</span>
              <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="flex-1 flex flex-col">
      <div v-if="subjectList.length === 0 && !subjectQuery.isLoading.value" class="text-gray-500">
        Немає каталогів
      </div>
      <div v-else-if="subjectQuery.isLoading.value" class="text-gray-500">
        Завантаження...
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        <div
          v-for="(item, index) in subjectList"
          :key="item.id"
          class="relative cursor-pointer rounded-[1.25rem] bg-base-100 shadow-xl overflow-hidden transition-shadow duration-300 group border border-transparent hover:shadow-2xl hover:border-primary"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
        >
          <!-- Icon buttons in top-right corner, visible on hover -->
          <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              class="btn btn-md btn-circle btn-ghost"
              title="Редагувати"
              @click.stop="openEditModal(item)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2H7v-2l6-6z" />
              </svg>
            </button>
            <button
              class="btn btn-md btn-circle btn-ghost"
              title="Видалити"
              @click.stop="openDeleteModal(item.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Card content -->
          <NuxtLink
            :to="`/dex?subjectId=${item.id}`"
            class="block p-4 rounded-[1.25rem] transition-colors duration-300 no-underline h-full"
            :class="'text-gray-800'"
          >
            <h3 class="card-title text-lg font-semibold no-underline">
              {{ item.name }}
            </h3>
            <p class="mb-2 no-underline">{{ item.description }}</p>
            <span class="text-sm text-gray-500">
              Колод: {{ item._count?.decks ?? 0 }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-6">
      <button class="btn btn-primary" @click="isForm = true">
        Додати каталог
      </button>
    </div>
  </div>
</template>

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

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthControllerLogout } from '~/api/generated/auth/auth';
import {
  useSubjectControllerFindAll,
  useSubjectControllerRemove,
  useSubjectControllerUpdate,
  useSubjectControllerCreate
} from '~/api/generated/subjects/subjects';
import type { SubjectResponseWithCount } from '~/api/generated/flashCardsAPI.schemas';

const router = useRouter();

const isForm = ref(false);
const name = ref('');
const description = ref('');
const hoveredIndex = ref<number | null>(null);

const subjectQuery = useSubjectControllerFindAll();
const subjectList = computed<SubjectResponseWithCount[]>(() =>
  subjectQuery.data.value || []
);

// Edit modal state
const editModalOpen = ref(false);
const editSubjectId = ref<number | null>(null);
const editName = ref('');
const editDescription = ref('');
const updateMutation = useSubjectControllerUpdate();

function openEditModal(item: SubjectResponseWithCount) {
  editSubjectId.value = item.id;
  editName.value = item.name ?? '';
  editDescription.value = item.description as string;
  editModalOpen.value = true;
}

function closeEditModal() {
  editModalOpen.value = false;
  editSubjectId.value = null;
  editName.value = '';
  editDescription.value = '';
}

async function confirmEdit() {
  if (editSubjectId.value == null) return;
  try {
    await updateMutation.mutateAsync({
      id: editSubjectId.value.toString(),
      data: {
        name: editName.value,
        description: editDescription.value,
      },
    });
    closeEditModal();
    await subjectQuery.refetch();
  } catch (error) {
    alert('Не вдалося оновити каталог. Спробуйте пізніше.');
  }
}

// Delete modal state
const deleteModalOpen = ref(false);
const subjectIdToDelete = ref<number | null>(null);
const deleteMutation = useSubjectControllerRemove();

function openDeleteModal(id: number) {
  subjectIdToDelete.value = id;
  deleteModalOpen.value = true;
}

function closeDeleteModal() {
  subjectIdToDelete.value = null;
  deleteModalOpen.value = false;
}

async function confirmDelete() {
  if (subjectIdToDelete.value == null) return;
  try {
    await deleteMutation.mutateAsync({ id: subjectIdToDelete.value.toString() });
    closeDeleteModal();
    await subjectQuery.refetch();
  } catch (error) {
    alert('Не вдалося видалити каталог. Спробуйте пізніше.');
  }
}

// Create modal state and mutation
const createMutation = useSubjectControllerCreate();

async function addItem() {
  if (!name.value.trim() || !description.value.trim()) return;

  try {
    await createMutation.mutateAsync({
      data: {
        name: name.value,
        description: description.value
      }
    });

    name.value = '';
    description.value = '';
    isForm.value = false;

    await subjectQuery.refetch();
  } catch (err) {
    console.error('Failed to create subject:', err);
  }
}

const logoutMutation = useAuthControllerLogout();

async function logout() {
  logoutMutation.mutate(undefined, {
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/');
    },
    onError: (error) => {
      alert('Logout failed: ' + error);
    }
  });
}
</script>