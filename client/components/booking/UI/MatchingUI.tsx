import React from 'react';

export const WaitingUI = ({ handleMatched }): React.ReactNode => (
	<>
		<h5>Please wait..</h5>
		<button className='green-button mt-5 w-full' onClick={handleMatched}>
			Skip
		</button>
	</>
);
