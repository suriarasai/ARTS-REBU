// Routing
export enum HREF {
    ACCOUNT = '/settings/accountSettings',
    SETTINGS = '/settings',
    REWARDS = '/settings/rewardPoints',
    LOCATIONS = '/settings/savedPlaces',
    HISTORY = '/activity',
    BOOKING = '/booking',
    HOME = '/home',
    SIGN_IN = '/',
    NOTIFICATIONS = '/notifications',
    REGISTRATION = '/registration',
    MESSAGES = '/messages',
    RATINGS = '/ratings',
    PAYMENT = '/settings/managePayment',
}

// SVG Strings
export enum icon {
	taxi = 'M6 1a1 1 0 0 0-1 1v1h-.181A2.5 2.5 0 0 0 2.52 4.515l-.792 1.848a.807.807 0 0 1-.38.404c-.5.25-.855.715-.965 1.262L.05 9.708a2.5 2.5 0 0 0-.049.49v.413c0 .814.39 1.543 1 1.997V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.338c1.292.048 2.745.088 4 .088s2.708-.04 4-.088V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.892c.61-.454 1-1.183 1-1.997v-.413c0-.165-.016-.329-.049-.49l-.335-1.68a1.807 1.807 0 0 0-.964-1.261.807.807 0 0 1-.381-.404l-.792-1.848A2.5 2.5 0 0 0 11.181 3H11V2a1 1 0 0 0-1-1H6ZM4.309 4h7.382a.5.5 0 0 1 .447.276l.956 1.913a.51.51 0 0 1-.497.731c-.91-.073-3.35-.17-4.597-.17-1.247 0-3.688.097-4.597.17a.51.51 0 0 1-.497-.731l.956-1.913A.5.5 0 0 1 4.309 4ZM4 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-9 0a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z',
	savedLocation = 'M8 12l-4.7023 2.4721.898-5.236L.3916 5.5279l5.2574-.764L8 0l2.3511 4.764 5.2574.7639-3.8043 3.7082.898 5.236z',
    car = 'M14.5 6.497h.5v-.139l-.071-.119-.429.258zm-14 0l-.429-.258L0 6.36v.138h.5zm2.126-3.541l-.429-.258.429.258zm9.748 0l.429-.258-.429.258zM3.5 11.5V11H3v.5h.5zm8 0h.5V11h-.5v.5zM14 6.497V12.5h1V6.497h-1zM.929 6.754l2.126-3.54-.858-.516L.071 6.24l.858.515zM5.198 2h4.604V1H5.198v1zm6.747 1.213l2.126 3.541.858-.515-2.126-3.54-.858.514zM2.5 13h-1v1h1v-1zm.5-1.5v1h1v-1H3zM13.5 13h-1v1h1v-1zm-1.5-.5v-1h-1v1h1zm-.5-1.5h-8v1h8v-1zM1 12.5V6.497H0V12.5h1zm11.5.5a.5.5 0 01-.5-.5h-1a1.5 1.5 0 001.5 1.5v-1zm-10 1A1.5 1.5 0 004 12.5H3a.5.5 0 01-.5.5v1zm-1-1a.5.5 0 01-.5-.5H0A1.5 1.5 0 001.5 14v-1zM9.802 2a2.5 2.5 0 012.143 1.213l.858-.515A3.5 3.5 0 009.802 1v1zM3.055 3.213A2.5 2.5 0 015.198 2V1a3.5 3.5 0 00-3 1.698l.857.515zM14 12.5a.5.5 0 01-.5.5v1a1.5 1.5 0 001.5-1.5h-1zM2 10h3V9H2v1zm11-1h-3v1h3V9zM3 7h9V6H3v1z',
    clock = 'M2.5 12.399l.37-.336-.006-.007-.007-.007-.357.35zm1 1.101v.5H4v-.5h-.5zm3.5.982l.018-.5-.053 1 .035-.5zM7.5 7.5H7a.5.5 0 00.146.354L7.5 7.5zm6.5 0A6.5 6.5 0 017.5 14v1A7.5 7.5 0 0015 7.5h-1zM7.5 1A6.5 6.5 0 0114 7.5h1A7.5 7.5 0 007.5 0v1zm0-1A7.5 7.5 0 000 7.5h1A6.5 6.5 0 017.5 1V0zM2.857 12.049A6.477 6.477 0 011 7.5H0c0 2.043.818 3.897 2.143 5.249l.714-.7zm-.727.686l1 1.101.74-.672-1-1.101-.74.672zM7.5 14a6.62 6.62 0 01-.465-.016l-.07.997c.177.013.355.019.535.019v-1zm.018 0l-.5-.017-.036 1 .5.017.036-1zM7 3v4.5h1V3H7zm.146 4.854l3 3 .708-.708-3-3-.708.708zM0 14h3.5v-1H0v1zm4-.5V10H3v3.5h1z',
    house = 'M7.5.5l.325-.38a.5.5 0 00-.65 0L7.5.5zm-7 6l-.325-.38L0 6.27v.23h.5zm5 8v.5a.5.5 0 00.5-.5h-.5zm4 0H9a.5.5 0 00.5.5v-.5zm5-8h.5v-.23l-.175-.15-.325.38zM1.5 15h4v-1h-4v1zm13.325-8.88l-7-6-.65.76 7 6 .65-.76zm-7.65-6l-7 6 .65.76 7-6-.65-.76zM6 14.5v-3H5v3h1zm3-3v3h1v-3H9zm.5 3.5h4v-1h-4v1zm5.5-1.5v-7h-1v7h1zm-15-7v7h1v-7H0zM7.5 10A1.5 1.5 0 019 11.5h1A2.5 2.5 0 007.5 9v1zm0-1A2.5 2.5 0 005 11.5h1A1.5 1.5 0 017.5 10V9zm6 6a1.5 1.5 0 001.5-1.5h-1a.5.5 0 01-.5.5v1zm-12-1a.5.5 0 01-.5-.5H0A1.5 1.5 0 001.5 15v-1z',
    bell = 'M1 10.5h13m-11.5 0v-5a5 5 0 0110 0v5m-7 1.5v.5a2 2 0 104 0V12',
    gear = 'M5.944.5l-.086.437-.329 1.598a5.52 5.52 0 00-1.434.823L2.487 2.82l-.432-.133-.224.385L.724 4.923.5 5.31l.328.287 1.244 1.058c-.045.277-.103.55-.103.841 0 .291.058.565.103.842L.828 9.395.5 9.682l.224.386 1.107 1.85.224.387.432-.135 1.608-.537c.431.338.908.622 1.434.823l.329 1.598.086.437h3.111l.087-.437.328-1.598a5.524 5.524 0 001.434-.823l1.608.537.432.135.225-.386 1.106-1.851.225-.386-.329-.287-1.244-1.058c.046-.277.103-.55.103-.842 0-.29-.057-.564-.103-.841l1.244-1.058.329-.287-.225-.386-1.106-1.85-.225-.386-.432.134-1.608.537a5.52 5.52 0 00-1.434-.823L9.142.937 9.055.5H5.944z',
    dropdown = 'M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'

}

// Long Text
export enum Message {
	WELCOME = 'Welcome to Rebu',
	INSTRUCTIONS = "We're glad to have you here! We just need you to fill out a bit more information to complete your profile",
	CREATING_ACCOUNT = 'Creating account...',
	FINISH = 'Finish',
	TOS1 = 'By continuing, you are agreeing to the ',
	TOS2 = 'terms and conditions',
	NO_NUMBER = "Don't have access to your number?",
	CONTINUE_WITH_EMAIL = 'Continue with email instead',
    SET_LOCATION = 'Set Location',
    SET_LOCATION_ON_MAP = 'Set Location on Map',
    SAVED_LOCATIONS = 'Saved Locations',
    NO_SAVED_LOCATIONS = 'No saved locations',

}

export enum Rewards {
    REDEEM_POINTS = 'Redeem Reward Points',
    POINTS = 'Total Reward Points',
    POINTS_WORTH = 'Points Worth',
    MAXIMUM = 'The maximum you can redeem is ',
    HISTORY = 'Reward History',
    NO_DATA = 'No transactions to date'
}

// Button Text
export enum Button {
	SET_LOCATION = 'Set Location',
	SIGNING_IN = 'Signing in...',
	SIGN_IN = 'Continue ᐳ',
    CONTINUE = 'Continue ᐳ',
    SAVE_CHANGES = 'Save Changes',
    CHANGES_SAVED = 'Changes Saved!',
}

// Page and Section Titles
export enum Title {
	NOTIFICATIONS = 'Notifications',
    ACTIVITY = 'Trips',
    LOCATIONS = 'Saved Locations',
    REWARDS = 'Reward Points',
    SETTINGS = 'Settings',
    PAYMENT = 'Manage Payment Options',
    ACCOUNT = 'Edit Account Information',
    BOOKING = 'Booking',
    HOME = 'Home'
}

// Helper Text
export enum Sub {
    BOOKING = 'Book a Ride',
    REWARDS = 'Your Reward Points',
    LOCATIONS = 'Saved Places',
    HISTORY = 'Trip History',
    RATINGS = 'Your Ratings',
    MESSAGES = 'Messages',
}

// Placeholder Text
export enum Input {
    ADDRESS = 'Enter a new address',
    PLACE = 'Add a place',
    DESTINATION = 'Destination',
    ORIGIN = 'Origin',
}