export default function computeFare(
	type: 'regular' | 'plus',
	postcode: string,
	distance: number,
	pickUpTime: number
) {

	// Hours since the start of the day
	let startOfDay = new Date()
	startOfDay.setHours(0, 0, 0, 0)
	const t = (pickUpTime - startOfDay.getTime()) / 1000 / 60 / 60

	// Peak periods are 6:00-9:30 and 18:00-24:00
	const peak = (t > 6 && t < 9.5) || (t > 18 && t < 24)
	const night = t > 0 && t < 6
	const plus = type === 'plus'

	const bookingFee = 2 + (peak ? 2 : night ? 1 : plus ? 2 : 0)
	const baseFee = 2 + (peak ? 2 : plus ? 1 : 0)
	const meteredFee = ((0.25 + (plus ? 0.09 : 0)) * distance) / 400
	const peakFee = meteredFee * (peak ? 0.25 : night ? 0.5 : 0)
	const locationFee = locationSurchageMap[Number(postcode.substring(0, 2))]
	const tempSurchageFee = (0.01 * distance) / 500

	const meteredFare = Math.max(
		bookingFee +
			baseFee +
			meteredFee +
			peakFee +
			tempSurchageFee +
			(locationFee ? locationFee : 0),
		plus ? 7 : 5
	)

	console.log('Fare: $', meteredFare.toFixed(2))
	return meteredFare.toFixed(2)
}

// First 2 digits of postcode denote the region
// https://www.mingproperty.sg/singapore-district-code/
// LTA charges extra for these regions:
const locationSurchageMap: any = {
	1: 3, // Marina Bay, Gardens by the Bay
	2: 3, // Downtown (Raffles, Marina)
	3: 3, // Downtown (Raffles, Marina)
	4: 3, // Downtown (Raffles, Marina)
	5: 3, // Downtown (Raffles, Marina)
	6: 3, // Downtown (Raffles, Marina)
	9: 3, // Sentosa
	20: 3, // Downtown (Little India)
	21: 3, // Downtown (Little India)
	22: 3, // Downtown (Orchard)
	23: 3, // Downtown (Orchard)
	48: 3, // Expo Centre
	49: 3, // Tanah Merah Ferry Terminal
	72: 3, // Mandai Wildlife Reserve
	79: 3, // Seletar Airport
	80: 3, // Seletar Airport
	81: 7, // Changi Airport
}
