export interface Service {
  id: number;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number;
  price: number;
}