export const checkCostError = (shippingInfo) => {
  return !/^\d+(?:\.?\d{0,2})$/.test(shippingInfo.cost)
    ? "Enter valid cost amount"
    : undefined;
};
