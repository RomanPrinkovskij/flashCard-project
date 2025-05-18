<script setup lang="ts">
const textPartListOne = ref<{ title: string; cards: string; image: string }[]>([
  {
    title: 'Words',
    cards: '16',
    image: '/images/folder.png'
  },
  {
    title: 'Infinity',
    cards: '82',
    image: '/images/folder.png'
  },
  {
    title: 'Numbers',
    cards: '20',
    image: '/images/folder.png'
  }
]);
</script>

<template>
  <div class="screen">
    <div class="header"></div>
    <ul class="grid">
      <li
        class="grid__element"
        v-for="(item, index) in textPartListOne"
        :key="index"
      >
        <div class="grid__element-img">
          <img :src="item.image" alt="folder" width="100%" height="100%" />
        </div>
        <div class="grid__element-text">
          <h3>{{ item.title }}</h3>

          <span>Питань:{{ item.cards }}</span>
        </div>
      </li>
    </ul>
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
</style>
