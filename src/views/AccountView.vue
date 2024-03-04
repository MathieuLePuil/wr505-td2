<script setup>
import { ref } from 'vue';
import axios from 'axios';

const username = ref(localStorage.getItem('username'));
const email = ref('');
const userid = ref('');
const firstname = ref('');
const lastname = ref('');
const showEditForm = ref(false);

const fetchUserDetails = async () => {
    const response = await axios.get(`https://mmi21b12.sae105.ovh/api/users?username=${username.value}`);
    const user = response.data['hydra:member'][0];
    userid.value = user.id;
    username.value = user.username;
    email.value = user.email;
    firstname.value = user.firstname;
    lastname.value = user.lastname;
};

const updateUserDetails = async () => {
    const token = localStorage.getItem('user-token');
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json',
    };
    const userToUpdate = {
        username: username.value,
        email: email.value,
        firstname: firstname.value,
        lastname: lastname.value,
    };
    await axios.patch(`https://mmi21b12.sae105.ovh/api/users/${userid.value}`, userToUpdate, { headers });
    showEditForm.value = false;
};

fetchUserDetails();
</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Account</h1>
        <p>Welcome, {{ username }}</p>
        <p>Email: {{ email }}</p>
        <p>First Name: {{ firstname }}</p>
        <p>Last Name: {{ lastname }}</p>
        <button @click="showEditForm = true" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">Edit</button>
        <div v-if="showEditForm" class="mt-4">
            <form @submit.prevent="updateUserDetails" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username:</label>
                    <input id="username" v-model="username" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email:</label>
                    <input id="email" v-model="email" type="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="firstname">First Name:</label>
                    <input id="firstname" v-model="firstname" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="lastname">Last Name:</label>
                    <input id="lastname" v-model="lastname" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="flex items-center justify-between">
                    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>