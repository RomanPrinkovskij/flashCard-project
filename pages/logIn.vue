<template>
  <main
    class="min-h-screen flex items-center justify-center bg-base-100"
    data-theme="light"
  >
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
          :disabled="mutation.isPending.value"
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
          :disabled="mutation.isPending.value"
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary w-full flex justify-center items-center"
        :disabled="mutation.isPending.value"
      >
        <span v-if="!mutation.isPending.value">Log In</span>
        <svg
          v-else
          class="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthControllerLogin } from '~/api/generated/auth/auth';
import type { LoginDto } from '~/api/generated/flashCardsAPI.schemas';

const email = ref('');
const password = ref('');
const router = useRouter();

const mutation = useAuthControllerLogin();

function submitLogin() {
  const loginDto: LoginDto = {
    email: email.value,
    password: password.value
  };
  mutation.mutate(
    { data: loginDto },
    {
      onSuccess: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        router.push('/catalog');
      },
      onError: (error) => {
        alert('Login failed: ' + error);
      }
    }
  );
}
</script>
