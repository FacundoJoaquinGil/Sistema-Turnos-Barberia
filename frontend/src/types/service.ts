export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
  createdAt: string;
}

export type ServiceFormData = Pick<
  Service,
  | "name"
  | "description"
  | "duration"
  | "price"
  | "isActive"
>;