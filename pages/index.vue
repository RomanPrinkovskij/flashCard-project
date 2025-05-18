<script setup lang="ts">
const isVisible = ref(false);
const isDex = ref(false);
</script>

<template>
  <strartScreen v-if="!isVisible" @toggle="isVisible = $event" />
  <Catalogs v-if="isVisible && !isDex" @toggle="isDex = $event" />
  <Dex v-if="isDex" />
</template>

<style lang="scss" scoped>
@use '/assets/scss/main.scss';
</style>
