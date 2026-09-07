import type { ReactNode } from "react";

import {
  AppointmentsProvider,
  ClientsProvider,
  ServicesProvider,
  AvailabilityProvider,
} from "../context";

interface BarbershopDataProviderProps {
  children: ReactNode;
}

const BarbershopDataProvider = ({
  children,
}: BarbershopDataProviderProps) => {
  return (
    <AppointmentsProvider>
      <ClientsProvider>
        <ServicesProvider>
          <AvailabilityProvider>
            {children}
          </AvailabilityProvider>
        </ServicesProvider>
      </ClientsProvider>
    </AppointmentsProvider>
  );
};

export default BarbershopDataProvider;