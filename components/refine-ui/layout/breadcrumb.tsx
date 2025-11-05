"use client";

import { Fragment, useMemo } from "react";
import { Home } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  matchResourceFromRoute,
  useBreadcrumb,
  useResourceParams,
} from "@refinedev/core";
import {
  BreadcrumbSeparator as ShadcnBreadcrumbSeparator,
  BreadcrumbItem as ShadcnBreadcrumbItem,
  BreadcrumbList as ShadcnBreadcrumbList,
  BreadcrumbPage as ShadcnBreadcrumbPage,
  Breadcrumb as ShadcnBreadcrumb,
} from "@/components/ui/breadcrumb";

export function Breadcrumb() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  const { breadcrumbs } = useBreadcrumb();
  const { resources } = useResourceParams();
  const rootRouteResource = matchResourceFromRoute("/", resources);

  const breadCrumbItems = useMemo(() => {
    const list: {
      key: string;
      href: string;
      Component: React.ReactNode;
    }[] = [];

    // Главная страница (Dashboard) с tenant-id
    const homeHref = tenantId ? `/manage/${tenantId}` : (rootRouteResource.matchedRoute ?? "/");
    list.push({
      key: "breadcrumb-item-home",
      href: homeHref,
      Component: (
        <Link href={homeHref}>
          {rootRouteResource?.resource?.meta?.icon ?? (
            <Home className="h-4 w-4" />
          )}
        </Link>
      ),
    });

    // Остальные breadcrumbs с tenant-id
    for (const { label, href } of breadcrumbs) {
      if (!href) {
        list.push({
          key: `breadcrumb-item-${label}`,
          href: "",
          Component: <span>{label}</span>,
        });
        continue;
      }

      // Добавляем tenant-id к пути, если его нет
      let finalHref = href;
      if (tenantId && !href.startsWith(`/manage/${tenantId}`) && !href.startsWith('http') && !href.startsWith('/docs')) {
        finalHref = `/manage/${tenantId}${href.startsWith('/') ? href : `/${href}`}`;
      }

      // Убеждаемся, что href - строка
      if (typeof finalHref !== 'string') {
        finalHref = '';
      }

      list.push({
        key: `breadcrumb-item-${label}`,
        href: finalHref,
        Component: finalHref ? <Link href={finalHref}>{label}</Link> : <span>{label}</span>,
      });
    }

    return list;
  }, [breadcrumbs, tenantId, rootRouteResource]);

  return (
    <ShadcnBreadcrumb>
      <ShadcnBreadcrumbList>
        {breadCrumbItems.map((item, index) => {
          if (index === breadCrumbItems.length - 1) {
            return (
              <ShadcnBreadcrumbPage key={item.key}>
                {item.Component}
              </ShadcnBreadcrumbPage>
            );
          }

          return (
            <Fragment key={item.key}>
              <ShadcnBreadcrumbItem key={item.key}>
                {item.Component}
              </ShadcnBreadcrumbItem>
              <ShadcnBreadcrumbSeparator />
            </Fragment>
          );
        })}
      </ShadcnBreadcrumbList>
    </ShadcnBreadcrumb>
  );
}

Breadcrumb.displayName = "Breadcrumb";
