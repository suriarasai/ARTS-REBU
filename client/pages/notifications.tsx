import {
	FaCrosshairs,
	FaFontAwesomeFlag,
	FaLocationArrow,
	FaPlusCircle,
	FaPlusSquare,
	FaTimes,
} from 'react-icons/fa'

import {
	useJsApiLoader,
	GoogleMap,
	Marker,
	Autocomplete,
	DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'
import { BackButton } from '@/components/booking/backButton'

const center = { lat: 1.2952078, lng: 103.773675 }
var directionsDisplay;

function App() {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		libraries: ['places'],
	})

	const [map, setMap] = useState(/** @type google.maps.Map */ null)
	const [directionsResponse, setDirectionsResponse] = useState(null)
	const [distance, setDistance] = useState('')
	const [duration, setDuration] = useState('')

	const [expandSearch, setExpandSearch] = useState(0)

	/** @type React.MutableRefObject<HTMLinputElement> */
	const originRef = useRef(null)
	/** @type React.MutableRefObject<HTMLinputElement> */
	const destinationRef = useRef(null)

	if (!isLoaded) {
		return 'loading'
	}

	async function calculateRoute() {
		if (originRef.current.value === '' || destinationRef.current.value === '') {
			return
		}
		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService()
		
		if (directionsDisplay != null) {
			directionsDisplay.set('directions', null)
			directionsDisplay.setMap(null)
			directionsDisplay = null
		}

		directionsDisplay = new google.maps.DirectionsRenderer()

		const results = await directionsService.route({
			origin: originRef.current.value,
			destination: destinationRef.current.value,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		})
		setDirectionsResponse(results)
		setDistance(results.routes[0].legs[0].distance.text)
		setDuration(results.routes[0].legs[0].duration.text)

		directionsDisplay.setMap(map)
		directionsDisplay.setDirections(results)
	}

	function clearRoute() {
		setDirectionsResponse(null)
		setDistance('')
		setDuration('')
		originRef.current.value = ''
		destinationRef.current.value = ''
	}

	return (
		<div className='relative h-screen w-screen'>
			<div className='absolute left-0 top-0 h-full w-full'>
				{/* Google Map div */}
				<GoogleMap
					center={center}
					zoom={15}
					mapContainerStyle={{ width: '100%', height: '100%' }}
					options={{
						zoomControl: false,
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: false,
					}}
					onLoad={(map) => setMap(map)}
				>
					<Marker position={center} />
					{/* {directionsResponse && (
						<DirectionsRenderer directions={directionsResponse} />
					)} */}
				</GoogleMap>
			</div>
			<div className='h-2/12 absolute z-20 flex w-screen flex-wrap bg-white p-2 shadow-xl'>
				<div className='w-1/12'>
					<BackButton
						expandSearch={expandSearch}
						setExpandSearch={setExpandSearch}
					/>
				</div>
				<div className='w-10/12'>
					<Autocomplete>
						<input
							type='text'
							className='mb-2 rounded-sm border-none bg-zinc-100 py-2 px-3 pl-10 leading-tight shadow-none'
							placeholder='Origin'
							ref={originRef}
						/>
					</Autocomplete>
					<FaCrosshairs className='absolute -mt-9 ml-2 text-xl text-green-500' />
					<Autocomplete>
						<input
							type='text'
							className='mb-2 rounded-sm border-none bg-zinc-100 py-2 px-3 pl-10 leading-tight shadow-none'
							placeholder='Destination'
							ref={destinationRef}
						/>
					</Autocomplete>
					<FaFontAwesomeFlag className='absolute -mt-9 ml-2 text-xl text-green-500' />
				</div>
				<div className='justify-bottom flex w-1/12 items-end p-3 pb-4 text-2xl text-green-500'>
					<FaPlusSquare />
				</div>
			</div>
			<div className='absolute bottom-0 z-50 flex w-full justify-center py-5'>
				<button
					className='w-10/12 rounded bg-green-500 py-2 px-4 text-white'
					type='submit'
					onClick={calculateRoute}
				>
					Calculate Route
				</button>
				<div aria-label='center back' onClick={clearRoute}>
					{<FaTimes />}
				</div>
			</div>
			{/* <div className='justify-space m-4'>
				<p>Distance: {distance} </p>
				<p>Duration: {duration} </p>
				<div
					aria-label='center back'
					onClick={() => {
						map.panTo(center)
						map.setZoom(15)
					}}
				>
					<FaLocationArrow />
				</div>
			</div> */}
		</div>
	)
}

export default App
