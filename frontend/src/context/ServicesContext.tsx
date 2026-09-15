import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "../lib/supabase";

import type {
  Service,
  ServiceFormData,
} from "../types/service";

interface ServicesContextType {
  services: Service[];
  loading: boolean;
  error: string | null;

  getServiceById: (serviceId: number) => Service | undefined;

  createService: (
    serviceData: ServiceFormData,
  ) => Promise<Service>;

  updateService: (
    serviceId: number,
    serviceData: ServiceFormData,
  ) => Promise<Service>;

  toggleServiceStatus: (
    serviceId: number,
  ) => Promise<void>;

  refreshServices: () => Promise<void>;
}

const ServicesContext =
  createContext<ServicesContextType | undefined>(
    undefined,
  );

interface ServicesProviderProps {
  children: ReactNode;
}

export const ServicesProvider = ({
  children,
}: ServicesProviderProps) => {
  const [services, setServices] = useState<Service[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null,
  );

  const mapService = (service: {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
    active: boolean;
    created_at: string;
    updated_at: string;
  }): Service => {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      duration: service.duration_minutes,
      price: service.price,
      active: service.active,
      createdAt: service.created_at,
      updatedAt: service.updated_at,
    };
  };

  const refreshServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name", {
          ascending: true,
        });

      if (error) {
        throw error;
      }

      setServices(
        (data ?? []).map(mapService),
      );
    } catch (error) {
      console.error(
        "Error al obtener servicios:",
        error,
      );

      setError(
        "No se pudieron cargar los servicios.",
      );
    } finally {
      setLoading(false);
    }
  };


  const getServiceById = (
    serviceId: number,
  ) => {
    return services.find(
      (service) => service.id === serviceId,
    );
  };

  const createService = async (
    serviceData: ServiceFormData,
  ): Promise<Service> => {
    const { data, error } = await supabase
      .from("services")
      .insert({
        name: serviceData.name.trim(),
        description:
          serviceData.description?.trim() || null,
        duration_minutes: serviceData.duration,
        price: serviceData.price,
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Error al crear servicio:",
        error,
      );

      throw error;
    }

    const newService = mapService(data);

    setServices((currentServices) =>
      [...currentServices, newService].sort(
        (a, b) =>
          a.name.localeCompare(b.name),
      ),
    );  

    return newService;
  };

  const updateService = async (
    serviceId: number,
    serviceData: ServiceFormData,
  ): Promise<Service> => {
    const { data, error } = await supabase
      .from("services")
      .update({
        name: serviceData.name.trim(),
        description:
          serviceData.description?.trim() || null,
        duration_minutes: serviceData.duration,
        price: serviceData.price,
      })
      .eq("id", serviceId)
      .select()
      .single();

    if (error) {
      console.error(
        "Error al actualizar servicio:",
        error,
      );

      throw error;
    }

    const updatedService = mapService(data);

    setServices((currentServices) =>
      currentServices
        .map((service) =>
          service.id === serviceId
            ? updatedService
            : service,
        )
        .sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
    );

    return updatedService;
  };

  const toggleServiceStatus = async (
    serviceId: number,
  ) => {
    const service =
      services.find(
        (service) =>
          service.id === serviceId,
      );

    if (!service) {
      throw new Error(
        "Servicio no encontrado",
      );
    }

    const { data, error } = await supabase
      .from("services")
      .update({
        active: !service.active,
      })
      .eq("id", serviceId)
      .select()
      .single();

    if (error) {
      console.error(
        "Error al cambiar estado del servicio:",
        error,
      );

      throw error;
    }

    const updatedService = mapService(data);

    setServices((currentServices) =>
      currentServices.map((currentService) =>
        currentService.id === serviceId
          ? updatedService
          : currentService,
      ),
    );
  };

  useEffect(() => {
    void refreshServices();
  }, []);

  return (
    <ServicesContext.Provider
      value={{
        services,
        loading,
        error,
        getServiceById,
        createService,
        updateService,
        toggleServiceStatus,
        refreshServices,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(
    ServicesContext,
  );

  if (!context) {
    throw new Error(
      "useServices debe utilizarse dentro de ServicesProvider",
    );
  }

  return context;
};