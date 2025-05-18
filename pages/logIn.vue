<template>
  <main class="min-h-screen flex items-center justify-center bg-base-100" data-theme="light">
    <form
      @submit.prevent="submitLogin"
      class="card w-full max-w-md bg-white shadow-md p-6 space-y-6"
    >
      <h1 class="text-2xl font-bold text-center text-gray-900">Login</h1>

      <div class="form-control">
        <label for="email" class="label">
          <span class="label-text text-gray-800">Email</span>
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="input input-bordered"
          required
          autofocus
        />
      </div>

      <div class="form-control">
        <label for="password" class="label">
          <span class="label-text text-gray-800">Password</span>
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Your password"
          class="input input-bordered"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary w-full">Log In</button>
    </form>
  </main>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function submitLogin() {
  // Simple demo: Just log the credentials
  alert(`Email: ${email.value}\nPassword: ${password.value}`)
}
</script>
