"use client";

import React from "react";
import { useParams } from "next/navigation";
import { type BaseKey, useEditButton } from "@refinedev/core";
import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";
import Link from "next/link";

type EditButtonProps = {
  /**
   * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
   * @default Inferred resource name from the route
   */
  resource?: string;
  /**
   * Data item identifier for the actions with the API
   * @default Reads `:id` from the URL
   */
  recordItemId?: BaseKey;
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

export const EditButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  EditButtonProps
>(
  (
    { resource, recordItemId, accessControl, meta, children, onClick, ...rest },
    ref,
  ) => {
    const params = useParams();
    const tenantId = (params?.tenantId as string) || "";
    
    const { hidden, disabled, to, label } = useEditButton({
      resource,
      id: recordItemId,
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
              <Pencil className="h-4 w-4" />
              <span>{label}</span>
            </div>
          )}
        </Link>
      </Button>
    );
  },
);

EditButton.displayName = "EditButton";
