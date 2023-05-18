import React, { useEffect, useState } from 'react'

export const AuthContext = React.createContext<any | undefined>(undefined)

// Context manager for user authentication
// Updates the state whenever the user signs in or out
const AuthDetails = ({ children }) => {
	const [authUser, setAuthUser] = useState(null)

	useEffect(() => {
		// onAuthStateChanged(auth, (user) => {
		// 	if (user) {
		// 		setAuthUser(user)
		// 	} else {
		// 		setAuthUser(null)
		// 	}
		// })
	}, [])

	return (
		<AuthContext.Provider
			value={{
				authUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthDetails
