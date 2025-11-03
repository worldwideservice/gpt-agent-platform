"use client";

/**
 * Refine Provider компонент
 * Оборачивает приложение для работы с Refine
 */

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { dataProvider } from "@/lib/providers/data-provider";
import { authProvider } from "@/lib/providers/auth-provider";
import { resources } from "./resources";

interface RefineProviderProps {
  children: React.ReactNode;
}

export const RefineProvider = ({ children }: RefineProviderProps) => {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider}
      authProvider={authProvider}
      resources={resources}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      {children}
    </Refine>
  );
};

