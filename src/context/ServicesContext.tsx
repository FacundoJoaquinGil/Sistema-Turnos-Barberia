import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

import { servicesMock } from "../mocks/servicesMock";

import type {
  Service,
  ServiceFormData,
} from "../types/service";

interface ServicesContextValue {
  services: Service[];

  addService: (
    data: ServiceFormData,
  ) => Service;

  updateService: (
    id: number,
    data: ServiceFormData,
  ) => void;

  toggleServiceStatus: (
    id: number,
  ) => void;

  isServiceNameInUse: (
    name: string,
    excludeServiceId?: number,
  ) => boolean;
}

interface ServicesProviderProps {
  children: ReactNode;
}

const ServicesContext =
  createContext<ServicesContextValue | null>(
    null,
  );

export const ServicesProvider = ({
  children,
}: ServicesProviderProps) => {
  const [services, setServices] =
    useState<Service[]>(servicesMock);

  const addService = (
    data: ServiceFormData,
  ) => {
    const newService: Service = {
      id: Date.now(),
      ...data,
      createdAt: new Date()
        .toISOString()
        .slice(0, 10),
    };

    setServices((current) => [
      ...current,
      newService,
    ]);

    return newService;
  };

  const updateService = (
    id: number,
    data: ServiceFormData,
  ) => {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? {
              ...service,
              ...data,
            }
          : service,
      ),
    );
  };

  const toggleServiceStatus = (
    id: number,
  ) => {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? {
              ...service,
              isActive:
                !service.isActive,
            }
          : service,
      ),
    );
  };

  const isServiceNameInUse = (
    name: string,
    excludeServiceId?: number,
  ) => {
    const normalizedName = name
      .trim()
      .toLowerCase();

    return services.some(
      (service) =>
        service.name
          .trim()
          .toLowerCase() ===
          normalizedName &&
        service.id !==
          excludeServiceId,
    );
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        updateService,
        toggleServiceStatus,
        isServiceNameInUse,
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