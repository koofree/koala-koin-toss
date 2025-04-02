export const floorNumber = (number: number, precision: number = 8) => {
  return Math.floor(number * Math.pow(10, precision)) / Math.pow(10, precision);
};
