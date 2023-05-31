import React from 'react'
import {
	GoogleMap,
	useLoadScript,
	Marker,
	InfoWindow,
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

const libraries = ['places']
const mapContainerStyle = {
	height: '100vh',
	width: '100vw',
}
const options = {
	disableDefaultUI: true,
	zoomControl: false,
}
const center = {
	lat: 1.2988975,
	lng: 103.7636757,
}

export default function App() {
	const router = useRouter()
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		// @ts-ignore
		libraries,
	})
	const [markers, setMarkers] = React.useState([])
	const [selected, setSelected] = React.useState(null)

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
	}, [])

	const panTo = React.useCallback(({ lat, lng }) => {
		mapRef.current.panTo({ lat, lng })
		mapRef.current.setZoom(17)
	}, [])

	if (loadError) return 'Error'
	if (!isLoaded) return 'Loading...'

	return (
		<div>
			<button
				className='back-button m-3 absolute'
				onClick={() => router.push('/home')}
			>
				{'🡠'}
			</button>
			{/* <Locate panTo={panTo} /> */}
			<Search panTo={panTo} />

			<GoogleMap
				id='map'
				mapContainerStyle={mapContainerStyle}
				zoom={15}
				center={center}
				options={options}
				onClick={onMapClick}
				onLoad={onMapLoad}
				mapContainerClassName='top-0 bottom-0 absolute'
			>
				{markers.map((marker) => (
					<Marker
						key={`${marker.lat}-${marker.lng}`}
						position={{ lat: marker.lat, lng: marker.lng }}
						onClick={() => {
							setSelected(marker)
						}}
						icon={{
							url: `/bear.svg`,
							origin: new window.google.maps.Point(0, 0),
							anchor: new window.google.maps.Point(15, 15),
							scaledSize: new window.google.maps.Size(30, 30),
						}}
					/>
				))}

				{selected ? (
					<InfoWindow
						position={{ lat: selected.lat, lng: selected.lng }}
						onCloseClick={() => {
							setSelected(null)
						}}
					>
						<div>
							<h2>
								<span role='img' aria-label='bear'>
									🐻
								</span>{' '}
								Alert
							</h2>
							<p>Test</p>
						</div>
					</InfoWindow>
				) : null}
			</GoogleMap>
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

function Search({ panTo }) {
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			radius: 100 * 1000,
			componentRestrictions: { country: 'sg' },
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
		} catch (error) {
			console.log('😱 Error: ', error)
		}
	}

	return (
		<div className='absolute z-20 bottom-0 flex flex-col bg-white p-3 w-screen'>
			<Combobox onSelect={handleSelect}>
				<ComboboxInput
					value={value}
					onChange={handleInput}
					disabled={!ready}
					placeholder='Search your location'
				/>
				<ComboboxPopover>
					<ComboboxList>
						{status === 'OK' &&
							data.map(({ description }, index) => (
								<ComboboxOption key={index} value={description} />
							))}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
		</div>
	)
}
