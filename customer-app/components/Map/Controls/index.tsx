import { TogglePOI, PanToCurrentLocation } from './buttons';


export function MapControls({ map }) {
	return (
		<div className='absolute bottom-0 right-0 m-8 mb-28 space-y-5'>
			<TogglePOI map={map} />
			<PanToCurrentLocation map={map} />
		</div>
	)
}
