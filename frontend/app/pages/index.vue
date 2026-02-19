<script setup lang="ts">
import Card from '~/components/card.vue';
import { useShowStore } from '~/stores/showStore';

const showStore = useShowStore();

const { sortedShows } = storeToRefs(showStore);


const query = ref('');

onMounted(() => {
    showStore.fetchShows();

    setInterval(() => {
        query.value = showStore.searchQuery
    }, 300);
});



const filteredShowItems = computed(() => {
    return sortedShows.value.filter(show => {
        const searchTerm = query.value.toLowerCase();
        if (!searchTerm) return true; // If search term is empty, show all items
        return (
            show.title.toLowerCase().includes(searchTerm) ||
            show.location.name.toLowerCase().includes(searchTerm) ||
            show.location.city.toLowerCase().includes(searchTerm)
        );
    });
});



const statusLabel = (availableSeats: number) => {
    if (availableSeats > 10) {
        return `Nog ${availableSeats} beschikbaar`;
    } else if (availableSeats > 0) {
        return 'Laatste tickets';
    } else {
        return 'Sold Out';
    }
};

const priceFormatter = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatPrice = (price: number) => priceFormatter.format(price);

const formattedDate = (date: string) => {
    return new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(new Date(date)).replace(',', ' –');
};




</script>

<template>

    <div class="overview-grid">
        <Card v-for="show in filteredShowItems" :key="show.id">
            <template #header>
                <h3 class="card-title">{{ show.title }}</h3>
            </template>
            <template #default>
                <p>Date: {{ formattedDate(show.date) }}</p>
                <p>Location: {{ show.location.name }} ({{ show.location.city }})</p>
                <p>Price: {{ formatPrice(show.price) }}</p>
                <p>Status: {{ statusLabel(show.availableSeats) }}</p>
            </template>
        </Card>
    </div>
</template>


<style lang="css" scoped>
.overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}
</style>