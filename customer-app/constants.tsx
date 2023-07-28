// Routing
export enum HREF {
	ACCOUNT = '/accountSettings',
	SETTINGS = '/settings',
	REWARDS = '/rewardPoints',
	LOCATIONS = '/savedPlaces',
	HISTORY = '/activity',
	BOOKING = '/map',
	HOME = '/home',
	SIGN_IN = '/',
	NOTIFICATIONS = '/notifications',
	REGISTRATION = '/registration',
	MESSAGES = '/messages',
	RATINGS = '/ratings',
	PAYMENT = '/managePayment',
	BOOKINGUI = '/admin/booking',
}

export enum NOTIF {
	ARRIVINGSOON = 'Your ride is arriving soon - please get ready and enjoy the trip!',
	ARRIVEDTOUSER = 'The wait is over! Please make your way to the taxi',
	WAITING = 'Waiting on driver to start moving...',
	ARRIVEDTODEST = 'You have now arrived at your destination. Thank you for riding with Rebu',
}

export enum MARKERS {
	USERLOCATION = 'https://www.svgrepo.com/show/115216/pointer-inside-a-circle.svg',
	HOME = 'https://www.svgrepo.com/show/375801/door.svg',
	WORK = 'https://www.svgrepo.com/show/375762/briefcase.svg',
	SAVED = 'https://www.svgrepo.com/show/375878/ribbon.svg',
	ORIGIN = 'https://www.svgrepo.com/show/375834/location.svg',
	DESTINATION = 'https://www.svgrepo.com/show/375810/flag.svg',
	STAND = 'https://www.svgrepo.com/show/375861/pin2.svg',
	TAXI = 'https://www.svgrepo.com/show/375911/taxi.svg',
}

// SVG Strings
export enum icon {
	taxi = 'M6 1a1 1 0 0 0-1 1v1h-.181A2.5 2.5 0 0 0 2.52 4.515l-.792 1.848a.807.807 0 0 1-.38.404c-.5.25-.855.715-.965 1.262L.05 9.708a2.5 2.5 0 0 0-.049.49v.413c0 .814.39 1.543 1 1.997V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.338c1.292.048 2.745.088 4 .088s2.708-.04 4-.088V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.892c.61-.454 1-1.183 1-1.997v-.413c0-.165-.016-.329-.049-.49l-.335-1.68a1.807 1.807 0 0 0-.964-1.261.807.807 0 0 1-.381-.404l-.792-1.848A2.5 2.5 0 0 0 11.181 3H11V2a1 1 0 0 0-1-1H6ZM4.309 4h7.382a.5.5 0 0 1 .447.276l.956 1.913a.51.51 0 0 1-.497.731c-.91-.073-3.35-.17-4.597-.17-1.247 0-3.688.097-4.597.17a.51.51 0 0 1-.497-.731l.956-1.913A.5.5 0 0 1 4.309 4ZM4 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-9 0a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z',
	saved = 'M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z',
	car = 'M14.5 14.5l-4-4m-4 2a6 6 0 110-12 6 6 0 010 12z',
	clock = 'M2.5 12.399l.37-.336-.006-.007-.007-.007-.357.35zm1 1.101v.5H4v-.5h-.5zm3.5.982l.018-.5-.053 1 .035-.5zM7.5 7.5H7a.5.5 0 00.146.354L7.5 7.5zm6.5 0A6.5 6.5 0 017.5 14v1A7.5 7.5 0 0015 7.5h-1zM7.5 1A6.5 6.5 0 0114 7.5h1A7.5 7.5 0 007.5 0v1zm0-1A7.5 7.5 0 000 7.5h1A6.5 6.5 0 017.5 1V0zM2.857 12.049A6.477 6.477 0 011 7.5H0c0 2.043.818 3.897 2.143 5.249l.714-.7zm-.727.686l1 1.101.74-.672-1-1.101-.74.672zM7.5 14a6.62 6.62 0 01-.465-.016l-.07.997c.177.013.355.019.535.019v-1zm.018 0l-.5-.017-.036 1 .5.017.036-1zM7 3v4.5h1V3H7zm.146 4.854l3 3 .708-.708-3-3-.708.708zM0 14h3.5v-1H0v1zm4-.5V10H3v3.5h1z',
	house = 'M7.5.5l.325-.38a.5.5 0 00-.65 0L7.5.5zm-7 6l-.325-.38L0 6.27v.23h.5zm5 8v.5a.5.5 0 00.5-.5h-.5zm4 0H9a.5.5 0 00.5.5v-.5zm5-8h.5v-.23l-.175-.15-.325.38zM1.5 15h4v-1h-4v1zm13.325-8.88l-7-6-.65.76 7 6 .65-.76zm-7.65-6l-7 6 .65.76 7-6-.65-.76zM6 14.5v-3H5v3h1zm3-3v3h1v-3H9zm.5 3.5h4v-1h-4v1zm5.5-1.5v-7h-1v7h1zm-15-7v7h1v-7H0zM7.5 10A1.5 1.5 0 019 11.5h1A2.5 2.5 0 007.5 9v1zm0-1A2.5 2.5 0 005 11.5h1A1.5 1.5 0 017.5 10V9zm6 6a1.5 1.5 0 001.5-1.5h-1a.5.5 0 01-.5.5v1zm-12-1a.5.5 0 01-.5-.5H0A1.5 1.5 0 001.5 15v-1z',
	bell = 'M1 10.5h13m-11.5 0v-5a5 5 0 0110 0v5m-7 1.5v.5a2 2 0 104 0V12',
	gear = 'M5.944.5l-.086.437-.329 1.598a5.52 5.52 0 00-1.434.823L2.487 2.82l-.432-.133-.224.385L.724 4.923.5 5.31l.328.287 1.244 1.058c-.045.277-.103.55-.103.841 0 .291.058.565.103.842L.828 9.395.5 9.682l.224.386 1.107 1.85.224.387.432-.135 1.608-.537c.431.338.908.622 1.434.823l.329 1.598.086.437h3.111l.087-.437.328-1.598a5.524 5.524 0 001.434-.823l1.608.537.432.135.225-.386 1.106-1.851.225-.386-.329-.287-1.244-1.058c.046-.277.103-.55.103-.842 0-.29-.057-.564-.103-.841l1.244-1.058.329-.287-.225-.386-1.106-1.85-.225-.386-.432.134-1.608.537a5.52 5.52 0 00-1.434-.823L9.142.937 9.055.5H5.944z',
	dropdown = 'M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z',
	houseMarker = 'M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z',
	workMarker = 'M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z',
	taxiMarker = 'M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zM434.7 368a48 48 0 1 1 90.5 32 48 48 0 1 1 -90.5-32zM160 336a48 48 0 1 1 0 96 48 48 0 1 1 0-96z',
	crosshairs = 'M256 0c17.7 0 32 14.3 32 32V66.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H445.3C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.3C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H66.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z',
}

// Long Text
export enum Message {
	WELCOME = 'Welcome to Rebu',
	INSTRUCTIONS = "We're glad to have you here! We just need you to fill out a bit more information to complete your profile",
	CREATING_ACCOUNT = 'Creating account...',
	FINISH = 'Finish',
	TOS1 = 'By continuing, you are agreeing to the ',
	TOS2 = 'terms and conditions',
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
	NO_DATA = 'No transactions to date',
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
	HOME = 'Home',
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
export enum polylineTrafficColors {
	NORMAL = '#22c55e',
	SLOW = '#fcd34d',
	TRAFFIC_JAM = '#ef4444',
}
export interface message {
	stream: 'booking' | 'dispatch' | 'taxiLocator'
	message: any
	messageSubmittedTime?: string
	messageReceivedTime?: string
}
