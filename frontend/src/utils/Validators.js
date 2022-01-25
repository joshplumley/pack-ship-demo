export const checkCostError = (shippingInfo) => {
  return !/^\d+(?:\.?\d{0,2})$/.test(shippingInfo.cost)
    ? "Enter valid cost amount"
    : undefined;
};

export const isShippingInfoValid = (shippingInfo) => {
  return (
    isCarrierValid(shippingInfo?.carrier) &&
    isDeliverySpeedValid(shippingInfo?.deliverySpeed)
  );
};

export const isCarrierValid = (carrier) => {
  return carrier && carrier !== "-----";
};

export const isDeliverySpeedValid = (deliverySpeed) => {
  return deliverySpeed && deliverySpeed !== "";
};
