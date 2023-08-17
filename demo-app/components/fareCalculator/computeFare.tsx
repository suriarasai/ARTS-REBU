export default function computeFare(
  type: string,
  postcodeFrom: string,
  postcodeTo: string,
  distance: number,
  pickUpTime: string
) {
  // Peak periods are 6:00-9:30 and 18:00-24:00
  const peak = pickUpTime === "peak";
  const night = pickUpTime === "night";
  const plus = type === "plus";

  const bookingFee = 2 + (peak ? 2 : night ? 1 : plus ? 2 : 0);
  const baseFee = 2 + (peak ? 2 : plus ? 1 : 0);
  const meteredFee = ((0.25 + (plus ? 0.09 : 0)) * distance) / 0.4;
  const peakFee = meteredFee * (peak ? 0.25 : night ? 0.5 : 0);
  const locationFee =
    locationSurchageMap[Number(postcodeFrom.substring(0, 2))] +
    locationSurchageMap[Number(postcodeTo.substring(0, 2))];
  const tempSurchageFee = (0.01 * distance) / 0.5;

  const meteredFare = Math.max(
    bookingFee +
      baseFee +
      meteredFee +
      peakFee +
      tempSurchageFee +
      (locationFee ? locationFee : 0),
    plus ? 7 : 5
  );

  console.log("Fare: $", meteredFare.toFixed(2));
  return meteredFare.toFixed(2);
}

// First 2 digits of postcode denote the region
// https://www.mingproperty.sg/singapore-district-code/
// LTA charges extra for these regions:
const locationSurchageMap: any = {
  1: 3,
  2: 3,
  3: 3,
  4: 3,
  5: 3,
  6: 3,
  9: 3,
  20: 3,
  21: 3,
  22: 3,
  23: 3,
  48: 3,
  49: 3,
  72: 3,
  79: 3,
  80: 3,
  81: 7, // Changi Airport
};
