<script setup lang="ts">
const textPartListOne = ref<{ title: string; cards: string; image: string }[]>([
  {
    title: 'English',
    cards: '5',
    image: '/images/folder.png'
  },
  {
    title: 'Geography',
    cards: '5',
    image: '/images/folder.png'
  },
  {
    title: 'CSS',
    cards: '20',
    image: '/images/folder.png'
  }
]);

const isDex = ref(false);

const emit = defineEmits<{
  (e: 'toggle', value: boolean): void;
}>();

function toggleValue() {
  isDex.value = !isDex.value;
  emit('toggle', isDex.value); // або false, залежно від логіки
}

const isForm = ref(false);

function addFolder() {
  isForm.value = !isForm.value;
}

const name = ref('');
function addItem() {
  if (!name.value.trim()) return;

  const newItem = {
    title: name.value,
    cards: '0',
    image: '/images/folder.png'
  };

  textPartListOne.value.push(newItem); // додаємо в масив
  name.value = ''; // очищаємо інпут
  addFolder();
}
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

          <span>Колод:{{ item.cards }}</span>
        </div>
      </li>
    </ul>

    <div class="form" v-if="isForm">
      <div class="header"></div>

      <div class="content">
        <input
          type="text"
          placeholder="Введіть назву каталогу"
          v-model="name"
        />
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
  gap: 10px;

  &__element {
    width: 1fr;
    position: relative;

    &-text {
      position: absolute;
      bottom: 10%;
      left: 10%;
    }
  }

  &__element-img {
    width: 100%;
    height: 150px;
  }
}

.plus {
  width: 50px;
  height: 50px;
  background: #26adde;
  color: $primary-color;
  border: 1px solid #000;
  border-radius: 50%;
  font-size: 20px;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.form {
  position: absolute;
  width: 100%;
  height: 400px;
  z-index: 1;
  top: 200px;
  left: 0;
  border-radius: 30px;
  border: 2px solid #26adde;
  overflow: hidden;
}

.content {
  margin-top: 50px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input {
  width: 100%;
  height: 60px;
  text-align: center;
  display: flex;
  align-items: center;
}

.buttons {
  display: flex;
  gap: 50px;
  justify-content: center;

  button {
    width: 200px;
    height: 50px;
    border-radius: 100px;
    color: $primary-color;
  }

  .red {
    background: #e81f1f;
  }

  .blue {
    background: #26adde;
  }
}
</style>
