import React, { useContext, useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import PackingQueue from "../packing_queue/PackingQueue";
import ShippingQueue from "../shipping_queue/ShippingQueue";
import { CustomThemeContext } from "../themes/customThemeProvider";
import { themes } from "../themes/base";

export const ROUTE_PACKING_SLIP = "/packing-slips";
export const ROUTE_SHIPMENTS = "/shipments";

const Router = () => {
  let location = useLocation();
  const { setTheme } = useContext(CustomThemeContext);

  useEffect(() => {
    switch (location.pathname) {
      case ROUTE_SHIPMENTS:
        setTheme(themes.SHIPMENT);
        break;

      case ROUTE_PACKING_SLIP:
      default:
        setTheme(themes.PACKING);
    }
  }, [location, setTheme]);

  return (
    <Routes>
      <Route exact path={ROUTE_PACKING_SLIP} element={<PackingQueue />} />
      <Route exact path={ROUTE_SHIPMENTS} element={<ShippingQueue />} />
      <Route path="" element={<Navigate to={ROUTE_PACKING_SLIP} />} />
    </Routes>
  );
};

export default Router;
