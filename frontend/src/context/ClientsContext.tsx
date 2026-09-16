import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "../lib/supabase";

import type { Database } from "../types/database.types";
import type {
  Client,
  ClientFormData,
} from "../types/client";

type ClientRow =
  Database["public"]["Tables"]["clients"]["Row"];

interface ClientsContextValue {
  clients: Client[];
  loading: boolean;
  error: string | null;

  refreshClients: () => Promise<void>;

  getClientById: (
    clientId: number,
  ) => Client | undefined;

  createClient: (
    data: ClientFormData,
  ) => Promise<Client>;

  updateClient: (
    clientId: number,
    data: ClientFormData,
  ) => Promise<Client>;

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

const mapClientRow = (
  row: ClientRow,
): Client => {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt:
      row.updated_at ?? row.created_at,
  };
};

const sortClients = (
  clients: Client[],
) => {
  return [...clients].sort((a, b) =>
    a.name.localeCompare(b.name, "es"),
  );
};

const normalizePhone = (
  phone: string,
) => {
  return phone.replace(/\D/g, "");
};

const getErrorMessage = (
  error: unknown,
) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Ocurrió un error inesperado con los clientes.";
};

export const ClientsProvider = ({
  children,
}: ClientsProviderProps) => {
  const [clients, setClients] =
    useState<Client[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const refreshClients =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      const {
        data,
        error: supabaseError,
      } = await supabase
        .from("clients")
        .select("*")
        .order("name", {
          ascending: true,
        });

      if (supabaseError) {
        setClients([]);
        setError(supabaseError.message);
        setLoading(false);

        return;
      }

      setClients(
        (data ?? []).map(mapClientRow),
      );

      setLoading(false);
    }, []);

  useEffect(() => {
    void refreshClients();
  }, [refreshClients]);

  const getClientById = useCallback(
    (clientId: number) => {
      return clients.find(
        (client) =>
          client.id === clientId,
      );
    },
    [clients],
  );

  const isPhoneInUse = useCallback(
    (
      phone: string,
      excludeClientId?: number,
    ) => {
      const normalizedPhone =
        normalizePhone(phone);

      return clients.some(
        (client) =>
          client.id !==
            excludeClientId &&
          normalizePhone(client.phone) ===
            normalizedPhone,
      );
    },
    [clients],
  );

  const createClient = useCallback(
    async (
      data: ClientFormData,
    ): Promise<Client> => {
      setError(null);

      const name = data.name.trim();
      const phone = data.phone.trim();
      const notes = data.notes.trim();

      if (!name || !phone) {
        throw new Error(
          "El nombre y el teléfono son obligatorios.",
        );
      }

      if (isPhoneInUse(phone)) {
        throw new Error(
          "Ya existe un cliente con ese teléfono.",
        );
      }

      try {
        const {
          data: createdRow,
          error: supabaseError,
        } = await supabase
          .from("clients")
          .insert({
            name,
            phone,
            notes,
          })
          .select("*")
          .single();

        if (supabaseError) {
          const message =
            supabaseError.code ===
            "23505"
              ? "Ya existe un cliente con ese teléfono."
              : supabaseError.message;

          throw new Error(message);
        }

        const createdClient =
          mapClientRow(createdRow);

        setClients((current) =>
          sortClients([
            ...current,
            createdClient,
          ]),
        );

        return createdClient;
      } catch (caughtError) {
        const message =
          getErrorMessage(caughtError);

        setError(message);

        throw new Error(message);
      }
    },
    [isPhoneInUse],
  );

  const updateClient = useCallback(
    async (
      clientId: number,
      data: ClientFormData,
    ): Promise<Client> => {
      setError(null);

      const name = data.name.trim();
      const phone = data.phone.trim();
      const notes = data.notes.trim();

      if (!name || !phone) {
        throw new Error(
          "El nombre y el teléfono son obligatorios.",
        );
      }

      if (
        isPhoneInUse(
          phone,
          clientId,
        )
      ) {
        throw new Error(
          "Ya existe otro cliente con ese teléfono.",
        );
      }

      try {
        const {
          data: updatedRow,
          error: supabaseError,
        } = await supabase
          .from("clients")
          .update({
            name,
            phone,
            notes,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", clientId)
          .select("*")
          .single();

        if (supabaseError) {
          const message =
            supabaseError.code ===
            "23505"
              ? "Ya existe otro cliente con ese teléfono."
              : supabaseError.message;

          throw new Error(message);
        }

        const updatedClient =
          mapClientRow(updatedRow);

        setClients((current) =>
          sortClients(
            current.map((client) =>
              client.id === clientId
                ? updatedClient
                : client,
            ),
          ),
        );

        return updatedClient;
      } catch (caughtError) {
        const message =
          getErrorMessage(caughtError);

        setError(message);

        throw new Error(message);
      }
    },
    [isPhoneInUse],
  );

  const value =
    useMemo<ClientsContextValue>(
      () => ({
        clients,
        loading,
        error,
        refreshClients,
        getClientById,
        createClient,
        updateClient,
        isPhoneInUse,
      }),
      [
        clients,
        loading,
        error,
        refreshClients,
        getClientById,
        createClient,
        updateClient,
        isPhoneInUse,
      ],
    );

  return (
    <ClientsContext.Provider
      value={value}
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
      "useClients debe utilizarse dentro de ClientsProvider.",
    );
  }

  return context;
};