import React, {
	FunctionComponent,
	useState,
	useCallback,
	ChangeEvent,
	useRef,
	useEffect,
} from 'react'
import {
	GoogleMapsProvider,
	useAutocompleteService,
	useGoogleMap,
	usePlacesService,
} from '@ubilabs/google-maps-react-hooks'

import styles from '@/styles/places-autocomplete-service.module.css'
import { BackButton } from '@/components/booking/backButton'
import { PlacesAutocompleteServiceSuggestion } from '@/redux/types'
import { MapCanvas } from '@/components/booking/MapCanvas'
import { DirectionsService } from '@/components/booking/DirectionsService'

// Map initialization parameters
const mapOptions = {
	center: { lat: 1.2988975, lng: 103.7636757 },
	zoom: 17,
	disableDefaultUI: true,
	zoomControl: false,
	clickableIcons: false,
}

const App: FunctionComponent<Record<string, unknown>> = () => {
	const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null)
	const [expandSearch, setExpandSearch] = useState(0)

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
				<div className='search-container'>
					<div className='w-1/12 pl-1'>
						<BackButton
							expandSearch={expandSearch}
							setExpandSearch={setExpandSearch}
						/>
					</div>
					<div className='w-10/12 px-3 pt-3 pb-1'>
						<PlacesAutocompleteService />
						<PlacesAutocompleteService />
					</div>
					<div
						className={`justify-bottom flex w-1/12 items-end pb-4 text-4xl font-thin ${
							expandSearch !== 0 ? 'hidden' : ''
						}`}
					>
						+
					</div>
				</div>
				<DirectionsService />
				<MapCanvas ref={mapRef} />
			</React.StrictMode>
		</GoogleMapsProvider>
	)
}

export default App

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
		<div>
			<input
				ref={inputRef}
				// className={styles.searchInput}
				className='mb-2 rounded-sm border-none bg-zinc-100 py-2 px-3 pl-10 leading-tight shadow-none'
				value={inputValue}
				onChange={handleInputChange}
				autoComplete='off'
				role='combobox'
				aria-autocomplete='list'
				aria-controls='search-suggestions'
				aria-expanded={suggestionsAreVisible}
				id='places-search-autocomplete'
				onBlur={() => setSuggestionsAreVisible(false)}
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
		</div>
	)
}
