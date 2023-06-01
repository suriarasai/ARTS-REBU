import React from 'react'
import {
	GoogleMap,
	useLoadScript,
	Marker,
	InfoWindow,
	DirectionsRenderer,
	DirectionsService,
} from '@react-google-maps/api'
import usePlacesAutocomplete, {
	getGeocode,
	getLatLng,
} from 'use-places-autocomplete'
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from '@reach/combobox'

import '@reach/combobox/styles.css'
import { useRouter } from 'next/router'
import { SVGFlag } from '@/public/SVG/SVGFlag'
import { SVGLocation } from '@/public/SVG/SVGLocation'
import locationPin from '@/public/images/location-pin.svg'

const libraries = ['places']
const mapContainerStyle = {
	height: '83.333vh',
	width: '100vw',
}
const options = {
	disableDefaultUI: true,
	zoomControl: false,
	keyboardShortcuts: false,
}

export default function App() {
	const router = useRouter()
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		// @ts-ignore
		libraries,
	})
	const [center, setCenter] = React.useState({
		lat: 1.2988975,
		lng: 103.7636757,
	})
	const [markers, setMarkers] = React.useState([])
	const [selected, setSelected] = React.useState(null)
	const [validInput, setValidInput] = React.useState<boolean>(false)
	let count = React.useRef(0)

	const onMapClick = React.useCallback((e) => {
		setMarkers((current) => [
			...current,
			{
				lat: e.latLng.lat(),
				lng: e.latLng.lng(),
				time: new Date(),
			},
		])
	}, [])

	const mapRef = React.useRef(null)
	const onMapLoad = React.useCallback((map) => {
		mapRef.current = map

		// Getting coordinates of current position
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCenter({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				})
			},
			() => null
		)
	}, [])

	const panTo = React.useCallback(({ lat, lng }) => {
		mapRef.current.panTo({ lat, lng })
		mapRef.current.setZoom(17)
	}, [])

	const [response, setResponse] = React.useState(null)

	function directionsCallback(response) {
		if (response !== null && count.current < 2) {
			if (response.status === 'OK') {
				count.current += 1
				setResponse(response)
				console.log(response)
			} else {
				count.current = 0
				console.log('response: ', response)
			}
		}
	}

	const [origin, setOrigin] = React.useState(null)
	const [destination, setDestination] = React.useState(null)

	React.useEffect(() => {
		count.current = 0
	}, [destination, origin])

	if (loadError) return 'Error'
	if (!isLoaded) return 'Loading...'

	return (
		<div className='flex flex-wrap overflow-hidden'>
			<div className='h-2/12 z-20 flex w-screen flex-wrap bg-white shadow-xl'>
				<div className='w-1/12 pl-1 text-2xl'>
					<button
						className='m-3 font-medium'
						onClick={() => router.push('/home')}
					>
						{'🡠'}
					</button>
				</div>
				<div className='w-10/12 px-3 pt-3 pb-1'>
					{/* <Locate panTo={panTo} /> */}
					<Search
						panTo={panTo}
						type='from'
						placeholder='Current location'
						setLocation={setOrigin}
					/>
					<Search
						panTo={panTo}
						type='to'
						placeholder='Where to?'
						setLocation={setDestination}
					/>
				</div>
				<div className='justify-bottom flex w-1/12 items-end pb-4 text-4xl font-thin'>
					+
				</div>
			</div>

			{validInput ? (
				<div className='absolute bottom-0 z-20 flex w-full justify-center p-3 pb-8'>
					<button className='w-full bg-green-600 p-3 uppercase text-white lg:w-1/2'>
						Done
					</button>
				</div>
			) : null}

			<div className='h-10/12 overflow-hidden'>
				<GoogleMap
					id='map'
					mapContainerStyle={mapContainerStyle}
					zoom={16}
					center={center}
					options={options}
					onClick={onMapClick}
					onLoad={onMapLoad}
					mapContainerClassName='w-screen'
				>
					{markers.map((marker) => (
						<Marker
							key={`${marker.lat}-${marker.lng}`}
							position={{ lat: marker.lat, lng: marker.lng }}
							onClick={() => {
								setSelected(marker)
							}}
							icon={{
								url: locationPin,
								origin: new window.google.maps.Point(0, 0),
								anchor: new window.google.maps.Point(15, 15),
								scaledSize: new window.google.maps.Size(30, 30),
							}}
						/>
					))}

					{destination !== '' && origin !== '' && (
						<DirectionsService
							options={{
								destination: destination,
								origin: origin,
								travelMode: google.maps.TravelMode.DRIVING,
							}}
							callback={(e) => directionsCallback(e)}
							onLoad={(directionsService) => {
								console.log(
									'DirectionsService onLoad directionsService: ',
									directionsService
								)
							}}
							// optional
							onUnmount={(directionsService) => {
								console.log(
									'DirectionsService onUnmount directionsService: ',
									directionsService
								)
							}}
						/>
					)}

					{response !== null && (
						<DirectionsRenderer
							options={{
								directions: response,
							}}
							// optional
							onLoad={(directionsRenderer) => {
								console.log(
									'DirectionsRenderer onLoad directionsRenderer: ',
									directionsRenderer
								)
							}}
							// optional
							onUnmount={(directionsRenderer) => {
								console.log(
									'DirectionsRenderer onUnmount directionsRenderer: ',
									directionsRenderer
								)
							}}
						/>
					)}

					{selected ? (
						<InfoWindow
							position={{ lat: selected.lat, lng: selected.lng }}
							onCloseClick={() => {
								setSelected(null)
							}}
						>
							<div>
								<h2>Pin</h2>
								<p>Saved Location</p>
							</div>
						</InfoWindow>
					) : null}
				</GoogleMap>
			</div>
		</div>
	)
}

function Locate({ panTo }) {
	return (
		<button
			className='locate'
			onClick={() => {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						panTo({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						})
					},
					() => null
				)
			}}
		>
			Center
		</button>
	)
}

function Search({ panTo, type, placeholder, setLocation }) {
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			// @ts-ignore
			location: { lat: () => 1.2988975, lng: () => 103.7636757 },
			radius: 100 * 1000,
			componentRestrictions: { country: 'sg' },
			region: 'sg',
		},
	})

	const handleInput = (e) => {
		setValue(e.target.value)
	}

	const handleSelect = async (address) => {
		setValue(address, false)
		clearSuggestions()

		try {
			const results = await getGeocode({ address })
			const { lat, lng } = await getLatLng(results[0])
			panTo({ lat, lng })
			setLocation({ lat, lng })
		} catch (error) {
			console.log('😱 Error: ', error)
		}
	}

	return (
		<Combobox onSelect={handleSelect}>
			<ComboboxInput
				value={value}
				onChange={handleInput}
				disabled={!ready}
				placeholder={placeholder}
				className='mb-2 rounded-sm border-none bg-zinc-100 py-2 px-3 pl-10 leading-tight shadow-none'
			/>
			{type === 'from' ? <SVGLocation /> : <SVGFlag />}
			<ComboboxPopover className='z-50'>
				<ComboboxList>
					{status === 'OK' &&
						data.map(({ description }, index) => (
							<ComboboxOption key={index} value={description} />
						))}
				</ComboboxList>
			</ComboboxPopover>
		</Combobox>
	)
}

function reverseGeocoder(
	input,
	geocoder: google.maps.Geocoder,
	map: google.maps.Map
) {
	const latlngStr = input.split(',', 2)
	const latlng = {
		lat: parseFloat(latlngStr[0]),
		lng: parseFloat(latlngStr[1]),
	}

	geocoder.geocode({ location: latlng }).then((response) => {
		return response
	})
}
