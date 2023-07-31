import { CancelTripButton } from "@/components/Map/Controls/buttons";
import Rating from "@/components/Map/TripScreens/Arrival/Rating";
import { RouteInformation } from "@/components/Map/TripScreens/Dispatch/TripInformation";
import { screenAtom } from "@/state";
import { useState } from "react";
import { FaFileAlt, FaThumbsUp } from "react-icons/fa";
import { useRecoilState } from "recoil";


export function Arrival({ map, polyline }) {
	const [showRatingForm, setShowRatingForm] = useState(false)

	return (
		<>
			{showRatingForm ? (
				<Rating closeModal={() => setShowRatingForm(false)} />
			) : (
				<>
					<label className='mb-0 border-b border-zinc-400 p-4 text-zinc-100'>
						You have arrived
					</label>
					<RouteInformation />
					<ArrivalController
						setShowRatingForm={setShowRatingForm}
						map={map}
						polyline={polyline} />
				</>
			)}
		</>
	)
}

function ArrivalController({ setShowRatingForm, map, polyline }) {
	const [, setScreen] = useRecoilState(screenAtom)
	return (
		<div className='flex items-center space-x-3 p-4 px-6 text-sm'>
			<CancelTripButton map={map} completeTrip={true} polyline={polyline} />
			<button
				className='flex h-10 w-10 items-center justify-center rounded-full bg-green-200 p-2'
				onClick={() => setScreen('receipt')}
			>
				<FaFileAlt />
			</button>
			<button
				className='flex h-10 w-10 items-center justify-center rounded-full bg-green-200 p-2'
				onClick={() => setShowRatingForm(true)}
			>
				<FaThumbsUp />
			</button>
		</div>
	)
}
