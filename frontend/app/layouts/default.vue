<script setup lang="ts">
import { ref } from 'vue';
import { useShowStore } from '~/stores/showStore';

const searchQuery = ref('');




</script>

<template>
    <div>
        <header class="app-header">
            <h1 class="app-title">Theater Tickets</h1>

            <div>
                <input type="text" placeholder="Search shows..." class="search-input" v-model="searchQuery"
                    @input="useShowStore().setSearchQuery(searchQuery)" />
                <button class="sort-button" @click="useShowStore().toggleDateTimeSort()">Sort by Date</button>
                <button class="sort-button" @click="useShowStore().togglePriceSort()">Sort by Price</button>
                <button class="sort-button" @click="useShowStore().toggleAvailabilitySort()">Sort by
                    Availability</button>
            </div>
        </header>
        <main class="app-main">
            <slot />
        </main>
        <footer class="app-footer">
            <p>&copy; 2024 Theater Tickets. All rights reserved.</p>
        </footer>
    </div>
</template>