"use client";

import React from "react";
import { useParams } from "next/navigation";
import { type BaseKey, useCreateButton } from "@refinedev/core";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type CreateButtonProps = {
  /**
   * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
   * @default Inferred resource name from the route
   */
  resource?: BaseKey;
  /**
   * Access Control configuration for the button
   * @default `{ enabled: true, hideIfUnauthorized: false }`
   */
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  /**
   * `meta` property is used when creating the URL for the related action and path.
   */
  meta?: Record<string, unknown>;
  /**
   * Click handler (optional) - для совместимости с Button
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & Omit<React.ComponentProps<typeof Button>, 'onClick'>;

export const CreateButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  CreateButtonProps
>(({ resource, accessControl, meta, children, onClick, ...rest }, ref) => {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  
  const { hidden, disabled, to, label } = useCreateButton({
    resource,
    accessControl,
    meta,
  });

  const isDisabled = disabled || rest.disabled;
  const isHidden = hidden || rest.hidden;

  if (isHidden) return null;

  // Добавляем tenant-id к пути, если он есть
  const href = tenantId && to ? `/manage/${tenantId}${to}` : to;

  return (
    <Button {...rest} ref={ref} disabled={isDisabled} asChild>
      <Link
        href={href || "#"}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            e.preventDefault();
            // Приводим тип события к ожидаемому Button onClick
            onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
          }
        }}
      >
        {children ?? (
          <div className="flex items-center gap-2 font-semibold">
            <Plus className="w-4 h-4" />
            <span>{label ?? "Create"}</span>
          </div>
        )}
      </Link>
    </Button>
  );
});

CreateButton.displayName = "CreateButton";
