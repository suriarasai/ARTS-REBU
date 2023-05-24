export type UserContextType = {
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>
}

export type User = {
    id?: number,
    firstName?: string,
    lastName?: string,
    birthday?: string,
    prefix?: string,
    countryCode?: number,
    email?: string,
    password?: string,
    mobileNumber?: string,
    joinedDate?: string,
    rating?: number,
    activity?: any,
    savedLocations?: Array<any>,
    favoriteLocations?: Array<string>,
    rewardPoints?: number,
    rewardHistory?: Array<any>,
    reviewsAboutCustomer?: Array<any>,
    reviewsFromCustomer?: Array<any>,

    temp?: Array<any>,
    tripInfo?: any,
    addr?: String[]
}
