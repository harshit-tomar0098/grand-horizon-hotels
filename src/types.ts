export interface Hotel {
  id: number;
  name: string;
  city: string;
  country: string;
  rating: number;
  price: number;
  availability: boolean;
  image: string;
  description: string;
  amenities: string[];
}

export interface Booking {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  hotelId: number;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  country: string;
  minRating: number;
  maxPrice: number;
  availability: "all" | "available" | "unavailable";
}

export interface ToastNotification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
