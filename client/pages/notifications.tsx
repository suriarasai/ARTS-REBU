import React, {
	FunctionComponent,
	useState,
	useCallback,
	ChangeEvent,
	forwardRef,
	useRef,
	useEffect,
} from 'react'
import {
	GoogleMapsProvider,
	useDirectionsService,
	useAutocompleteService,
	useGoogleMap,
	usePlacesService,
} from '@ubilabs/google-maps-react-hooks'

import styles from '@/styles/places-autocomplete-service.module.css'

// Map initialization parameters
const mapOptions = {
	center: { lat: 1.2988975, lng: 103.7636757 },
	zoom: 17,
	disableDefaultUI: true,
	zoomControl: false,
	clickableIcons: false,
}

const DirectionsService = () => {
	const directionsOptions = {
		renderOnMap: true,
		renderOptions: {
			suppressMarkers: true,
			polylineOptions: { strokeColor: '#FB2576', strokeWeight: 4 },
		},
	}

	// Render the path between 2 points
	const { findAndRenderRoute, directionsRenderer } =
		useDirectionsService(directionsOptions)

	useEffect(() => {
		if (!findAndRenderRoute) {
			return () => {}
		}

		const request = {
			travelMode: google.maps.TravelMode.DRIVING,
			origin: { lat: 1.292203, lng: 103.7663002 },
			destination: { lat: 1.2979853, lng: 103.7668717 },
			drivingOptions: {
				departureTime: new Date(),
				trafficModel: google.maps.TrafficModel.BEST_GUESS,
			},
		}

		findAndRenderRoute(request)
			.then((result: google.maps.DirectionsResult) => {
				// eslint-disable-next-line no-console
				console.log(result)
			})
			.catch((errorStatus: google.maps.DirectionsStatus) => {
				console.error(errorStatus)
			})

		return () => {
			if (directionsRenderer) {
				directionsRenderer.setMap(null)
			}
		}
	}, [directionsRenderer, findAndRenderRoute])

	return null
}

const App: FunctionComponent<Record<string, unknown>> = () => {
	const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null)

	const mapRef = useCallback(
		(node: React.SetStateAction<HTMLDivElement | null>) => {
			node && setMapContainer(node)
		},
		[]
	)

	return (
		<GoogleMapsProvider
			googleMapsAPIKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
			mapContainer={mapContainer}
			mapOptions={mapOptions}
			libraries={['places']}
		>
			<React.StrictMode>
				<div id='container'>
					<MapCanvas ref={mapRef} />
					<DirectionsService />
					<PlacesAutocompleteService />
				</div>
			</React.StrictMode>
		</GoogleMapsProvider>
	)
}

export default App

const MapCanvas = forwardRef<HTMLDivElement, Record<string, unknown>>(
	(_, ref) => <div className='h-screen w-screen' ref={ref} />
)

MapCanvas.displayName = 'MapCanvas'

export interface PlacesAutocompleteServiceSuggestion {
	id: string
	label: string
}

const maxNumberOfSuggestions = 5

const PlacesAutocompleteService: FunctionComponent<
	Record<string, unknown>
> = () => {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const timeout = useRef<NodeJS.Timeout | null>(null)

	const [inputValue, setInputValue] = useState<string>('')
	const [suggestions, setSuggestions] = useState<
		Array<PlacesAutocompleteServiceSuggestion>
	>([])
	const [suggestionsAreVisible, setSuggestionsAreVisible] =
		useState<boolean>(false)

	const map = useGoogleMap()
	const autocompleteService = useAutocompleteService()
	const placesService = usePlacesService()

	// Update the user input value
	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)

		if (timeout.current) {
			clearTimeout(timeout.current)
		}

		// Show dropdown with a little delay
		timeout.current = setTimeout(() => {
			setSuggestionsAreVisible(true)
		}, 300)
	}

	// Handle suggestion selection
	const selectSuggestion = (
		suggestion: PlacesAutocompleteServiceSuggestion
	) => {
		inputRef.current?.focus()
		setInputValue(suggestion.label)

		// Close dropdown
		setSuggestionsAreVisible(false)

		// Get the location from Places Service of the selected place and zoom to it
		placesService?.getDetails(
			{ placeId: suggestion.id },
			(
				placeResult: google.maps.places.PlaceResult | null,
				status: google.maps.places.PlacesServiceStatus
			) => {
				if (
					status !== google.maps.places.PlacesServiceStatus.OK ||
					!placeResult
				) {
					return
				}

				// Get position of the suggestion to move map
				const position = placeResult.geometry?.location

				if (map && position) {
					map.setZoom(14)
					map.panTo(position)
				}
			}
		)
	}

	// Update suggestions and get autocomplete place suggestions
	useEffect(() => {
		if (inputValue.length >= 2) {
			autocompleteService?.getPlacePredictions(
				{
					input: inputValue,
				},
				(
					predictions: google.maps.places.AutocompletePrediction[] | null,
					status: google.maps.places.PlacesServiceStatus
				) => {
					if (
						status !== google.maps.places.PlacesServiceStatus.OK ||
						!predictions
					) {
						return
					}

					const autocompleteSuggestions = predictions
						.slice(0, maxNumberOfSuggestions)
						.map((prediction) => ({
							id: prediction.place_id,
							label: prediction.description,
						}))

					// Update suggestions for dropdown suggestions list
					setSuggestions(autocompleteSuggestions)
				}
			)
		} else {
			setSuggestions([])
		}
	}, [autocompleteService, inputValue])

	return (
		<>
			<label htmlFor='places-search-autocomplete'>Search for a location:</label>
			<input
				ref={inputRef}
				className={styles.searchInput}
				value={inputValue}
				onChange={handleInputChange}
				autoComplete='off'
				role='combobox'
				aria-autocomplete='list'
				aria-controls='search-suggestions'
				aria-expanded={suggestionsAreVisible}
				id='places-search-autocomplete'
			/>

			{suggestionsAreVisible && (
				<ul
					className={styles.suggestions}
					id='search-suggestions'
					role='listbox'
					aria-label='Suggested locations:'
				>
					{suggestions.map((suggestion) => (
						<li
							key={suggestion.id}
							onClick={() => selectSuggestion(suggestion)}
							id={suggestion.id}
							role='option'
							aria-selected
						>
							<span>{suggestion.label}</span>
						</li>
					))}
				</ul>
			)}
		</>
	)
}
