import React from "react";
import { Navigate, Routes } from "react-router-dom";
import PackingQueue from "../packing_queue/PackingQueue";
import ShippingQueue from "../shipping_queue/ShippingQueue";
import { Route } from "react-router-dom";

export const ROUTE_PACKING_SLIP = "/packing-slips";
export const ROUTE_SHIPMENTS = "/shipments";

const Router = () => {
  return (
    <Routes>
      <Route exact path={ROUTE_PACKING_SLIP} element={<PackingQueue />} />
      <Route exact path={ROUTE_SHIPMENTS} element={<ShippingQueue />} />
      <Route path="" element={<Navigate to={ROUTE_PACKING_SLIP} />} />
    </Routes>
  );
};

export default Router;
