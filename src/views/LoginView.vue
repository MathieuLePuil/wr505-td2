<script setup>
import {ref} from 'vue';
import axios from 'axios';

const username = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/login_check', {
      username: username.value,
      password: password.value
    });
    // Store the token in localStorage
    localStorage.setItem('user-token', response.data.token);
    // puis, rediriger vers la page d'accueil
    location.reload();
    location.href = '/';
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
</script>

<template>
  <section>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" required/>
      <input v-model="password" type="password" placeholder="Password" required/>
      <button type="submit">Login</button>
    </form>
  </section>
</template>