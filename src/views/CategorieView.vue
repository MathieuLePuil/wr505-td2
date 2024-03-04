<template>
    <section>
        <article>
            <h1 class="text-3xl px-10 my-10 font-semibold">List of actors</h1>
            <div class="flex px-10 mt-5">
                <input v-model="searchText" type="text" placeholder="Search..." class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none">
                <button @click="searchCategories" class="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
                <button @click="showAddCategoryForm = true" class="bg-blue-500 text-white px-4 py-2 rounded ml-10">Add Categorie</button>
            </div>
            <div class="flex px-10 flex-wrap mt-5">
                <div v-for="categorie in categories" :key="categorie.id"  class="flex flex-col items-center w-1/3 px-3 mb-5">
                    <card-categorie :categorie="categorie" @refreshCategories="getCategories" />
                </div>
            </div>
        </article>
        <div class="bg-gradient-to-r flex items-center justify-center">
            <div class="max-w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto bg-white p-6 rounded-lg">
                <div class="flex justify-center" v-if="!isSearching">
                    <nav class="flex space-x-2" aria-label="Pagination">
                        <button @click="previousPage" :disabled="currentPage === 1 || isSearching" class="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r bg-gray-600 text-white border hover:bg-gray-800 font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            Previous
                        </button>
                        <button @click="nextPage" :disabled="currentPage === 4 || isSearching" class="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r bg-gray-600 text-white border hover:bg-gray-800 font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            Next
                        </button>
                    </nav>
                </div>
            </div>
        </div>
        <div v-if="showAddCategoryForm" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <form @submit.prevent="addCategory">
                                <div class="mb-4">
                                    <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                                    <input type="text" id="name" v-model="newCategory.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="flex items-center justify-between">
                                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                        Add Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import CardCategorie from "@/components/CardCategorie.vue";

export default {
    components: {CardCategorie},
    data() {
        return {
            categories: [],
            searchText: '',
            currentPage: 1,
            showAddCategoryForm: false,
            newCategory: {
                name: ''
            }
        };
    },
    created() {
        this.getCategories();
    },
    methods: {
        async getCategories() {
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get(`https://mmi21b12.sae105.ovh/api/categories?page=${this.currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                this.categories = response.data;
            } catch (error) {
                console.error('Error', error);
                console.log(error.response.data.code);
            }
        },
        async searchCategories() {
            try {
                const token = localStorage.getItem('user-token');
                const response = await axios.get(`https://mmi21b12.sae105.ovh/api/categories?name=${this.searchText}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                this.categories = response.data;
            } catch (error) {
                console.error('Error', error);
                console.log(error.response.data.code);
            }
        },
        nextPage() {
            if (this.currentPage < 4) {
                this.currentPage++;
                this.getCategories();
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.getCategories();
            }
        },
        async addCategory() {
            try {
                const token = localStorage.getItem('user-token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                const response = await axios.post('https://mmi21b12.sae105.ovh/api/categories', this.newCategory, { headers });
                this.categories.push(response.data);
                this.showAddCategoryForm = false;
                this.newCategory = { name: '' };
            } catch (error) {
                console.error('Error while adding category:', error);
            }
        },
    },
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
}
</style>