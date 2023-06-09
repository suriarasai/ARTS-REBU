// Common file for handling API calls, behaves like a state manager (ex. Redux)

import React, { useContext } from 'react'
import api from '@/api/axiosConfig'
import { UserContext } from '@/components/context/UserContext'

const Data = (props: any) => {
    const { user, setUser } = useContext(UserContext)
    

    return (
        user
    )
}

export default Data