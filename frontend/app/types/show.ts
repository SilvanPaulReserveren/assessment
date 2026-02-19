import type { Location } from "./Location";

export type show = {
    id: number;
    title: string;
    date: string;
    time: string;
    location: Location;
    price: number;
    availableSeats: number;
}