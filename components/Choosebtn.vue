<script setup lang="ts"></script>

<template>
  <main
    class="min-h-screen flex flex-col items-center gap-16 bg-base-100 py-12"
    data-theme="light"
  >
    <header class="w-full h-12 bg-primary"></header>

    <section
      class="flex flex-col items-center gap-10 text-center px-6 max-w-3xl"
    >
      <p class="text-gray-800 text-2xl font-medium">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quas
        obcaecati quisquam. Pariatur, neque quis saepe distinctio mollitia quam
        sit illo. Animi, vel iusto ab voluptate voluptates sapiente voluptatem
        quibusdam.
      </p>

      <div class="flex flex-col gap-4 w-full max-w-xs">
        <NuxtLink to="/logIn" class="btn btn-primary w-full text-lg"
          >Увійти</NuxtLink
        >
        <NuxtLink to="/registration" class="btn btn-primary w-full text-lg"
          >Зареєструватись</NuxtLink
        >
      </div>
    </section>
  </main>
</template>
