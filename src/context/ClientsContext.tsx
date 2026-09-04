import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

import { clientsMock } from "../mocks/clientsMock";

import type {
  Client,
  ClientFormData,
} from "../types/client";

interface ClientsContextValue {
  clients: Client[];

  addClient: (
    data: ClientFormData,
  ) => Client;

  updateClient: (
    id: number,
    data: ClientFormData,
  ) => void;

  isPhoneInUse: (
    phone: string,
    excludeClientId?: number,
  ) => boolean;
}

interface ClientsProviderProps {
  children: ReactNode;
}

const ClientsContext =
  createContext<ClientsContextValue | null>(
    null,
  );

export const ClientsProvider = ({
  children,
}: ClientsProviderProps) => {
  const [clients, setClients] =
    useState<Client[]>(clientsMock);

  const addClient = (
    data: ClientFormData,
  ) => {
    const newClient: Client = {
      id: Date.now(),
      ...data,
      createdAt: new Date()
        .toISOString()
        .slice(0, 10),
    };

    setClients((current) => [
      ...current,
      newClient,
    ]);

    return newClient;
  };

  const updateClient = (
    id: number,
    data: ClientFormData,
  ) => {
    setClients((current) =>
      current.map((client) =>
        client.id === id
          ? {
              ...client,
              ...data,
            }
          : client,
      ),
    );
  };

  const isPhoneInUse = (
    phone: string,
    excludeClientId?: number,
  ) => {
    const normalizedPhone =
      phone.trim();

    return clients.some(
      (client) =>
        client.phone.trim() ===
          normalizedPhone &&
        client.id !== excludeClientId,
    );
  };

  return (
    <ClientsContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        isPhoneInUse,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(
    ClientsContext,
  );

  if (!context) {
    throw new Error(
      "useClients debe utilizarse dentro de ClientsProvider",
    );
  }

  return context;
};