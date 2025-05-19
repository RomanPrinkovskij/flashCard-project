<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFetch } from '#app';

const textPartListOne = ref<{ title: string; cards: string; image: string }[]>(
  []
);
const isDex = ref(false);
const isForm = ref(false);
const name = ref('');
const description = ref('');

const emit = defineEmits<{
  (e: 'toggle', value: boolean): void;
}>();

function toggleValue() {
  isDex.value = !isDex.value;
  emit('toggle', isDex.value);
}

function addFolder() {
  isForm.value = !isForm.value;
}

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
        name: name.value, // ✅ ПРАВИЛЬНЕ поле
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
      title: subject.name, // ✅ Виправлено з `title` на `name`
      cards: subject.cardCount?.toString() || '0',
      image: '/images/folder.png'
    }));
  } catch (err) {
    console.error('Failed to fetch subjects:', err);
  }
}

onMounted(() => {
  fetchSubjects();
});
</script>

<template>
  <div class="screen">
    <div class="header"></div>
    <ul class="grid">
      <li
        class="grid__element"
        v-for="(item, index) in textPartListOne"
        :key="index"
        @click="toggleValue"
      >
        <div class="grid__element-img">
          <img :src="item.image" alt="folder" width="100%" height="100%" />
        </div>
        <div class="grid__element-text">
          <h3>{{ item.title }}</h3>
          <span>Колод: {{ item.cards }}</span>
        </div>
      </li>
    </ul>

    <div class="form" v-if="isForm">
      <div class="header"></div>
      <div class="content">
        <input type="text" placeholder="Назва каталогу" v-model="name" />
        <input type="text" placeholder="Опис каталогу" v-model="description" />
        <div class="buttons">
          <button class="blue" @click="addItem">Додати</button>
          <button class="red" @click="addFolder">Закрити</button>
        </div>
      </div>
    </div>

    <button class="plus" @click="addFolder">+</button>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 50px;
  background: #26adde;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;

  &__element {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }

    &-img {
      width: 100%;
      height: 150px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-text {
      padding: 12px;
      color: #333;

      h3 {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 4px;
      }

      span {
        font-size: 14px;
        color: #666;
      }
    }
  }
}

.plus {
  width: 50px;
  height: 50px;
  background: #26adde;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  position: absolute;
  right: 16px;
  bottom: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.form {
  position: absolute;
  width: 100%;
  max-width: 400px;
  left: 50%;
  transform: translateX(-50%);
  top: 200px;
  background: #ffffff;
  border-radius: 20px;
  border: 2px solid #26adde;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 10;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;

  input {
    height: 50px;
    padding: 0 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 16px;
    color: #333;

    &::placeholder {
      color: #aaa;
    }
  }

  .buttons {
    display: flex;
    justify-content: space-between;

    button {
      flex: 1;
      height: 45px;
      border-radius: 9999px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      color: white;
      margin: 0 5px;
      cursor: pointer;

      &.red {
        background: #e81f1f;
      }

      &.blue {
        background: #26adde;
      }
    }
  }
}
</style>
