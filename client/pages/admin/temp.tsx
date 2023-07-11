import SelectPaymentMethod from '@/components/payment/SelectPaymentMethod'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import BottomNav from '@/components/ui/bottom-nav'
import { getDirections } from '@/server'
import mapStyles from '@/utils/noPoi'
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api'
import { useCallback, useState } from 'react'

const libraries = ['places', 'geometry']

const Notifications = () => {
	const [map, setMap] = useState(/** @type google.maps.Map */ null)
	const [route, setRoute] = useState(null)

	const loadMap = useCallback(async function callback(map) {
		setMap(map)
		mapStyles(map, false)
		await getDirections(
			map,
			{ lat: 1.2929767719001972, lng: 103.85036111494576 },
			{ lat: 1.30383257124474, lng: 103.86183489944777 },
			setRoute,
			setRoute,
			(data) => {
				null
			}
		)
	}, [])

	return (
		<>
			<div className='absolute left-0 top-0 h-full w-full'>
				<LoadScriptNext
					googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
					loadingElement={<LoadingScreen />}
					// @ts-ignore
					libraries={libraries}
				>
					<GoogleMap
						center={{ lat: 1.2952078, lng: 103.773675 }}
						zoom={15}
						mapContainerStyle={{ width: '100%', height: '100%' }}
						options={{
							zoomControl: false,
							streetViewControl: false,
							mapTypeControl: false,
							fullscreenControl: false,
							minZoom: 3,
						}}
						onLoad={loadMap}
					></GoogleMap>
				</LoadScriptNext>
			</div>
			<BottomNav />
		</>
	)
}

export default Notifications


const Notifications2 = () => {
	const [selectedCard, setSelectedCard] = useState('Cash')
	return (
		<div className='relative h-screen w-screen'>
			<div className='responsive w-full lg:w-1/2'>
				<div className='absolute bottom-0 z-50 w-screen rounded-lg border bg-white lg:w-6/12'>
					<div className='accordion-header flex flex-wrap pl-4 pt-4'>
						<label>Text</label>
					</div>
					<div className='accordion-content pb-4 pl-4 pr-4'>
						<SelectPaymentMethod
							set={() => {}}
							selectedCard={selectedCard}
							setSelectedCard={setSelectedCard}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}