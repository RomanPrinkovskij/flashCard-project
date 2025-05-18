<script setup lang="ts">
const login = ref('');
const password = ref('');
</script>

<template>
  <div class="screen">
    <input type="text" placeholder="Логін" v-model="login" />
    <input type="text" placeholder="Пароль" v-model="password" />
    <NuxtLink to="/catalog">
      <button class="LogInBtn">Ввійти</button>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.screen {
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: center;
  align-items: center;
}

input {
  height: 40px;
  width: 80%;
}
</style>
