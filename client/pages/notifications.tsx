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

const mapContainerStyle = {
	height: '100vh',
	width: '100vw',
	position: 'absolute',
	top: '0',
	left: '0'
}
const options = {
	disableDefaultUI: true,
	zoomControl: true,
}
const center = {
	lat: 1.2981255,
	lng: 103.7729178,
}

export default function App() {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
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

	const mapRef = React.useRef()
	const onMapLoad = React.useCallback((map) => {
		mapRef.current = map
	}, [])

	const panTo = React.useCallback(({ lat, lng }) => {
		mapRef.current.panTo({ lat, lng })
		mapRef.current.setZoom(14)
	}, [])

	if (loadError) return 'Error'
	if (!isLoaded) return 'Loading...'

	return (
		<div>
			<Locate panTo={panTo} />
			<Search panTo={panTo} />

			<GoogleMap
				id='map'
				mapContainerStyle={mapContainerStyle}
				zoom={8}
				center={center}
				options={options}
				onClick={onMapClick}
				onLoad={onMapLoad}
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
							<p>Text goes here</p>
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
			<svg
				viewBox='0 0 15 15'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				width='23'
				height='23'
			>
				<path
					clipRule='evenodd'
					d='M7.5 8.495a2 2 0 002-1.999 2 2 0 00-4 0 2 2 0 002 1.999z'
					stroke='currentColor'
					strokeLinecap='square'
				></path>
				<path
					clipRule='evenodd'
					d='M13.5 6.496c0 4.997-5 7.995-6 7.995s-6-2.998-6-7.995A5.999 5.999 0 017.5.5c3.313 0 6 2.685 6 5.996z'
					stroke='currentColor'
					strokeLinecap='square'
				></path>
			</svg>
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
			location: { lat: () => 1.2981255, lng: () => 103.7729178 },
			radius: 100 * 1000,
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
			console.log('Error: ', error)
		}
	}

	return (
		<div className='search'>
			<Combobox onSelect={handleSelect} className='absolute z-50 w-full'>
				<ComboboxInput
					value={value}
					onChange={handleInput}
					disabled={!ready}
					placeholder='Search your location'
				/>
				<ComboboxPopover>
					<ComboboxList>
						{status === 'OK' &&
							data.map(({ id, description }) => (
								<ComboboxOption key={id} value={description} />
							))}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
		</div>
	)
}
