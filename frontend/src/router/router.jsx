import React from "react";
import { Navigate, Routes } from "react-router-dom";
import PackingQueue from "../packing_queue/PackingQueue";
import { Route } from "react-router-dom";

export const ROUTE_PACKING_SLIP = "/packing-slips";
export const ROUTE_SHIPMENTS = "/shipments";

const Router = () => {
  return (
    <Routes>
      <Route exact path={ROUTE_PACKING_SLIP} element={<PackingQueue />} />
      <Route exact path={ROUTE_SHIPMENTS} element={null} />
      <Route path="" element={<Navigate to={ROUTE_PACKING_SLIP} />} />
    </Routes>
  );
};

export default Router;
