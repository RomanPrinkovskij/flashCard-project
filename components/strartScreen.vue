<script setup lang="ts">
const isVisible = ref(false);

const emit = defineEmits<{
  (e: 'toggle', value: boolean): void;
}>();

function toggleValue() {
  isVisible.value = !isVisible.value;
  emit('toggle', isVisible.value); // або false, залежно від логіки
}
</script>

<template>
  <div class="screen">
    <div class="header"></div>
    <div class="textPart">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quas
      obcaecati quisquam. Pariatur, neque quis saepe distinctio mollitia quam
      sit illo. Animi, vel iusto ab voluptate voluptates sapiente voluptatem
      quibusdam.
    </div>

    <div class="btn">
      <button class="btn_catalogs" @click="toggleValue">Каталоги</button>
    </div>
  </div>
  
</template>

<style lang="scss" scoped>
.screen {
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 100px;
  align-items: center;
  border: 1px solid #26adde;
  height: 800px;
}

.header {
  width: 100%;
  height: 50px;
  background: #26adde;
}

.textPart {
  text-align: center;
  padding: 0 50px;
}

.btn_catalogs {
  border: 1px solid black;
  width: 200px;
  height: 50px;
  border-radius: 100px;
  background: #26adde;
  color: #fff;
  font-family: inter;
  font-size: 30px;
  font-weight: 600;
}
</style>
