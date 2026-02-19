import type { show } from "~/types/show";

const showDateTimeToTimestamp = (item: show) => {
    const [yearRaw, monthRaw, dayRaw] = item.date.split('-');
    const [hourRaw, minuteRaw] = item.time.split(':');

    const year = Number(yearRaw);
    const month = Number(monthRaw);
    const day = Number(dayRaw);
    const hour = Number(hourRaw);
    const minute = Number(minuteRaw);

    if (
        !Number.isFinite(year) ||
        !Number.isFinite(month) ||
        !Number.isFinite(day) ||
        !Number.isFinite(hour) ||
        !Number.isFinite(minute)
    ) {
        return 0;
    }

    return Date.UTC(year, month - 1, day, hour, minute, 0, 0);
};

export const useShowStore = defineStore("shows", {
    state: () => ({
        shows: [] as show[],
        showsOverviewIsLoading: false,
        showsOverviewError: null as string | null,
        dateTimeSort: 'none' as 'none' | 'asc' | 'desc',
        availabilitySort: 'none' as 'none' | 'desc',
        priceSort: 'none' as 'none' | 'asc',
        searchQuery: '',
    }),
    getters: {
        sortedShows(): show[] {
            const result = [...this.shows];

            if (this.dateTimeSort !== 'none') {
                const direction = this.dateTimeSort === 'asc' ? 1 : -1;
                result.sort((a, b) => direction * (showDateTimeToTimestamp(a) - showDateTimeToTimestamp(b)));
                return result;
            }

            if (this.availabilitySort !== 'none') {
                result.sort((a, b) => b.availableSeats - a.availableSeats);
                return result;
            }

            if (this.priceSort !== 'none') {
                result.sort((a, b) => a.price - b.price);
                return result;
            }

            return result;
        },
    },
    actions: {
        toggleDateTimeSort() {
            this.availabilitySort = 'none';
            this.priceSort = 'none';
            this.dateTimeSort =
                this.dateTimeSort === 'none'
                    ? 'asc'
                    : this.dateTimeSort === 'asc'
                        ? 'desc'
                        : 'none';
        },

        toggleAvailabilitySort() {
            this.dateTimeSort = 'none';
            this.priceSort = 'none';
            this.availabilitySort = this.availabilitySort === 'none' ? 'desc' : 'none';
        },

        togglePriceSort() {
            this.dateTimeSort = 'none';
            this.availabilitySort = 'none';
            this.priceSort = this.priceSort === 'none' ? 'asc' : 'none';
        },

        setSearchQuery(query: string) {
            this.searchQuery = query;
        },

        async fetchShows() {
            this.showsOverviewIsLoading = true;
            try {
                const response = await $fetch<show[]>('/shows', {
                    baseURL: 'http://localhost:3000',
                });
                this.shows = response;
            } catch (error) {
                this.showsOverviewError = 'Error fetching shows: ' + (error instanceof Error ? error.message : String(error));
                console.error('Error fetching shows:', error);
            }
            finally {
                this.showsOverviewIsLoading = false;
            }
        },
    },
    
});
