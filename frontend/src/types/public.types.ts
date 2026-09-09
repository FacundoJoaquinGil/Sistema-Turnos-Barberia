export interface BarberService {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  active: boolean;
  featured?: boolean;
}

export interface HaircutWork {
  id: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  imageAlt: string;
}