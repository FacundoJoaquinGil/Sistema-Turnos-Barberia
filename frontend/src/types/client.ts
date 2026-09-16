export interface Client {
  id: number;
  name: string;
  phone: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientFormData = Pick<
  Client,
  "name" | "phone" | "notes"
>;