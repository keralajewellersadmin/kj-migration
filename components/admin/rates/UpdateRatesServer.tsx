import React from "react";
import { AdminViewServerProps } from "payload";
import { AdminLayoutWrapper } from "../shared/AdminLayoutWrapper";
import UpdateRates from "./UpdateRates";

export default function UpdateRatesServer(props: AdminViewServerProps) {
  return (
    <AdminLayoutWrapper {...props}>
      <UpdateRates />
    </AdminLayoutWrapper>
  );
}
