import React from "react";
import { AdminViewServerProps } from "payload";
import { AdminLayoutWrapper } from "../AdminLayoutWrapper";
import PagesView from "./PagesView";

export default function PagesViewServer(props: AdminViewServerProps) {
  return (
    <AdminLayoutWrapper {...props}>
      <PagesView />
    </AdminLayoutWrapper>
  );
}
