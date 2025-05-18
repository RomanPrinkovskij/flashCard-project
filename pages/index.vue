<script setup lang="ts"></script>

<template>
  <div class="screem">
    <NuxtLink to="/logIn">
      <button>Увійти</button>
    </NuxtLink>
    <NuxtLink to="/registration">
      <button>зареєструватись</button>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
@use '/assets/scss/main.scss';
</style>
