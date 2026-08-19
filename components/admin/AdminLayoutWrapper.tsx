import React from "react";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { AdminViewServerProps } from "payload";

export const AdminLayoutWrapper = ({
  children,
  ...props
}: { children: React.ReactNode } & AdminViewServerProps) => {
  const {
    initPageResult: { req, locale, permissions, visibleEntities },
    params,
    payload,
    searchParams,
  } = props;

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={visibleEntities}
    >
      {children}
    </DefaultTemplate>
  );
};
