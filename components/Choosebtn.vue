<script setup lang="ts"></script>

<template>
  <div class="screen">
    <div class="header"></div>
    <div class="content">
      <div class="textPart">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quas
        obcaecati quisquam. Pariatur, neque quis saepe distinctio mollitia quam
        sit illo. Animi, vel iusto ab voluptate voluptates sapiente voluptatem
        quibusdam.
      </div>

      <NuxtLink to="/logIn" class="btn">
        <button>Увійти</button>
      </NuxtLink>
      <NuxtLink to="/registration" class="btn">
        <button>Зареєструватись</button>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.screen {
  display: flex;
  flex-direction: column;
  gap: 80px;
  align-items: center;
  background: black;
}

.header {
  width: 100%;
  height: 50px;
  background: #26adde;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  color: #c3c7c7;
}

.textPart {
  text-align: center;
  padding: 0 50px;
  font-family: inter;
  font-size: 30px;
  font-weight: 500;
}

button {
  border: 1px solid #26adde;
  width: 300px;
  height: 50px;
  border-radius: 100px;
  background: #26adde;
  color: #fff;
  font-family: inter;
  font-size: 30px;
  font-weight: 600;
  text-align: center;
}
</style>
