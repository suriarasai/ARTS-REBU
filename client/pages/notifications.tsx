import React, { useEffect, useRef } from 'react'
import {
	GoogleMap,
	useLoadScript,
	Marker,
	InfoWindow,
	DirectionsRenderer,
	Polyline,
	DirectionsService,
} from '@react-google-maps/api'
import {Loader} from '@googlemaps/js-api-loader';
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
import locationPin from '@/public/images/location-pin.svg'
import SearchLocations from '@/components/booking/searchLocations'
import ExpandSearch from '@/components/booking/expandSearch'

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
	const [expandSearch, setExpandSearch] = React.useState<number>(0)
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

	// function directionsCallback(response) {
	// 	if (response !== null && count.current < 2) {
	// 		if (response.status === 'OK') {
	// 			count.current += 1
	// 			setResponse(response.routes[0].overview_path)
	// 			setValidInput(true)
	// 		} else {
	// 			count.current = 0
	// 		}
	// 	}
	// }

	const [origin, setOrigin] = React.useState('')
	const [destination, setDestination] = React.useState('')

	function handleCallback() {
		setResponse(null)
		CalculateRoute()
	}

	React.useEffect(() => {
		count.current = 0
	}, [destination, origin])

	async function CalculateRoute() {
		if (destination !== '' && origin !== '') {
			// eslint-disable-next-line no-undef
			const directionsService = new google.maps.DirectionsService()
			const results = await directionsService.route({
				origin: origin,
				destination: destination,
				// eslint-disable-next-line no-undef
				travelMode: google.maps.TravelMode.DRIVING,
			})
			setResponse(results.routes[0].overview_path)
		}
	}

	if (loadError) return 'Error'
	if (!isLoaded) return 'Loading...'

	return (
		<div className='flex flex-wrap overflow-hidden'>
			<div className='h-2/12 z-20 flex w-screen flex-wrap bg-white shadow-xl'>
				<div className='w-1/12 pl-1 text-2xl'>
					<button
						className='m-3 font-medium'
						onClick={() =>
							expandSearch !== 0 ? setExpandSearch(0) : router.push('/home')
						}
					>
						{'🡠'}
					</button>
				</div>
				<div className='w-10/12 px-3 pt-3 pb-1'>
					{/* <Locate panTo={panTo} /> */}
					<div className={expandSearch === 2 && 'hidden'}>
						<Search
							panTo={panTo}
							type='from'
							placeholder='Current location'
							setLocation={setOrigin}
							expandSearch={expandSearch}
							setExpandSearch={setExpandSearch}
							callback={() => handleCallback()}
						/>
					</div>
					<div className={expandSearch === 1 && 'hidden'}>
						<Search
							panTo={panTo}
							type='to'
							placeholder='Where to?'
							setLocation={setDestination}
							expandSearch={expandSearch}
							setExpandSearch={setExpandSearch}
							callback={() => handleCallback()}
						/>
					</div>
				</div>
				<div
					className={`justify-bottom flex w-1/12 items-end pb-4 text-4xl font-thin ${
						expandSearch !== 0 ? 'hidden' : ''
					}`}
					onClick={() => {
						setResponse(null)
						setDestination(null)
						setOrigin(null)
					}}
				>
					+
				</div>
			</div>

			{validInput ? (
				<div
					className={`absolute bottom-0 z-20 flex w-full justify-center p-3 pb-8 ${
						expandSearch !== 0 ? 'hidden' : ''
					}`}
				>
					<button className='w-full bg-green-600 p-3 uppercase text-white lg:w-1/2'>
						Done
					</button>
				</div>
			) : null}

			<div
				className={`h-10/12 overflow-hidden ${
					expandSearch !== 0 ? 'hidden' : ''
				}`}
			>
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

					{response !== null && (
						<Polyline
							path={response}
							options={{
								strokeColor: '#38B44F',
								strokeOpacity: 1,
								strokeWeight: 4,
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

function Search({
	panTo,
	type,
	placeholder,
	setLocation,
	expandSearch,
	setExpandSearch,
	callback
}) {
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
		setExpandSearch(0)
		callback()

		try {
			const results = await getGeocode({ address })
			const { lat, lng } = await getLatLng(results[0])
			panTo({ lat, lng })
			setLocation({ lat, lng })
		} catch (error) {
			console.log('Error: ', error)
		}
	}

	return (
		<div>
			<Combobox onSelect={handleSelect}>
				<ComboboxInput
					value={value}
					onChange={handleInput}
					disabled={!ready}
					placeholder={placeholder}
					className='mb-2 rounded-sm border-none bg-zinc-100 py-2 px-3 pl-10 leading-tight shadow-none'
					onClick={() => setExpandSearch(type === 'from' ? 1 : 2)}
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
			{expandSearch !== 0 && (
				<ExpandSearch
					panTo={panTo}
					setLocation={setLocation}
					setExpandSearch={setExpandSearch}
					setValue={setValue}
				/>
			)}
		</div>
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

const SVGLocation = () => (
	<svg
		viewBox='0 0 15 15'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		width='18'
		height='18'
		className='absolute -mt-9 ml-2 text-green-700'
	>
		<path
			d='M6 6.496a1.5 1.5 0 013 0 1.5 1.5 0 01-3 0z'
			fill='currentColor'
		></path>
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M1 6.496A6.499 6.499 0 017.5 0C11.089 0 14 2.909 14 6.496c0 2.674-1.338 4.793-2.772 6.225a10.865 10.865 0 01-2.115 1.654c-.322.19-.623.34-.885.442-.247.098-.506.174-.728.174-.222 0-.481-.076-.728-.174a6.453 6.453 0 01-.885-.442 10.868 10.868 0 01-2.115-1.654C2.338 11.289 1 9.17 1 6.496zm6.5-2.499a2.5 2.5 0 00-2.5 2.5 2.5 2.5 0 005 0 2.5 2.5 0 00-2.5-2.5z'
			fill='currentColor'
		></path>
	</svg>
)

const SVGFlag = () => (
	<svg
		viewBox='0 0 15 15'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		width='19'
		height='19'
		className='absolute -mt-9 ml-2 text-green-700'
	>
		<path
			d='M2.254.065a.5.5 0 01.503.006l10 6a.5.5 0 01-.033.876L3 11.81V15H2V.5a.5.5 0 01.254-.435z'
			fill='currentColor'
		></path>
	</svg>
)
