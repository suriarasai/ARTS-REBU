// Notifications page for informing the user

import React, { useState, useEffect, useRef, useContext } from 'react'

import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '@/redux/reducers'

const Notifications = () => {
	const count = useSelector((state: any) => state.counter.value)
	const dispatch = useDispatch()

	return (
		<Page title='Notifications'>
			<Section>Text</Section>
			<button onClick={() => dispatch(increment())}>Increment</button>
			{count}
		</Page>
	)
}

export default Notifications
