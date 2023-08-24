<!-- Template: https://github.com/mvllow/next-pwa-template -->
<!-- Backend: https://www.youtube.com/watch?v=5PdEmeopJVQ -->

# ARTS-REBU

Rebu is a Singapore-based taxi-hailing application used for the exploration of real-time data generation. It includes a rider app, driver app, and an incomplete admin app.

Rebu was created for the National University of Singapore's SWE 5003 (Architecting Real-Time Systems for Data Processing) module.

---

---

### Table of Contents

1. [Technology](#technology)
   <br />1.1 [Stack and Libraries](#stack)
   <br />1.2 [Architecture and Design](#architecture)
   <br />1.3 [Data Models](#datamodel)

2. [User Manual](#usermanual)
   <br />2.1 [Installation](#installation)
   <br />2.2 [User Accounts](#accounts)
   <br />2.3 [Ride Booking](#booking)
   <br />2.4 [Demo Application](#demomanual)

3. [Source Code](#sourcecode)
   <br />3.1 [File Organization](#fileorganization)
   <br />3.2 [Client Application](#client)
   <br />3.3 [Driver Application](#driver)
   <br />3.4 [Demo Application](#demo)
   <br />3.5 [Backend](#backend)
   <br />3.6 [Internal APIs](#internalapis)
   <br />3.7 [External APIs](#externalapis)
   <br />3.8 [Frontend Concepts](#frontendconcepts)

4. [Issues and Future Work](#issues)
   <br />4.1 [Debugging](#debugging)
   <br />4.2 [Issues](#issues)
   <br />4.3 [Future Work](#futurework)

---

---

### Technology

<a id="stack"></a>

<details>
  <summary>Stack and Libraries</summary>

<br />**Tech Stack and Tools**

> Frontend: **NextJS** (13.4.1) [May 2023] <br />
> Backend: **Spring Boot** (3.0.6) [April 2023] <br />
> Real-Time Data: **Kafka** (3.0.7) [May 2023] <br />
> Batch Data: **MongoDB** <br />

<br />**Frontend Libraries**

Abstraction was generally avoided unless it was necessary or greatly reduced the amount of boilerplate code (for the sake of maintainability). Library selection is based off reputability according to number of installations (refer to the NPM Trends website) and TypeScript support

> Form Validation: `@hookform/resolvers`, `react-hook-form` <br />
> PDF Reports: `@progress/kendo-react-pdf` <br />
> Maps: `@react-gogle-maps/api`, `@googlemaps/markerclusterer` <br />
> Styling: `tailwindcss` <br />
> State Management: `recoil` <br />
> API Routing: `axios` <br />
> Websockets: `sockjs-client`, `stompjs` <br />
> PWA: `next-pwa`

<br />**Backend Libraries**

> Websockets: `spring-boot-starter-websocket`, `sockjs-client`, `stomp-websocket` <br />
> Real-Time Data: `spring-kafka` <br />
> Data Modelling: `lombok` <br />
> JSON Parsing: `gson`

<br />**External APIs**

The Fleet Management System (FMS) simulates taxi location by pulling taxi availability from the Singapore Government's open data API. This API returns a list of all available public taxis in the country and updates every 30 seconds

> Maps: **Google Maps API** (v3) <br />
> Fleet Management: **Taxi Availability API** (data.gov.sg)

  <br />

</details>

<a id="architecture"></a>

<details>
  <summary>Architecture</summary>

The architecture is event-based where each frontend application communicates with the backend through endpoints. The backend relays stream data back to the frontend via web sockets

</details>

<a id="datamodel"></a>

<details>
  <summary>Data Models</summary>

There are 5 MongoDB tables and 4 stream data models:

**MongoDB Models** (Batch Data)

These can be found in the backend through their respective folders

```js
Booking
  bookingID: integer
  messageSubmitedTime: long (ms since epoch)
  messageReceivedTime: long (ms since epoch)
  customerID: integer
  customerName: string
  phoneNumber: integer
  pickUpLocation: Location
  pickUpTime: long (ms since epoch)
  dropLocation: Location
  taxiType: 'regular' | 'plus'
  fareType: 'metered' | 'fixed'
  fare: string
  eta: integer (seconds) (unused)
  status: 'requested' | 'dispatched' | 'cancelled' | 'completed'
  driverID: integer
  sno: integer
  distance: float (meters)
  paymentMethod: string (cash or card number)
  dropTime: long (ms since epoch)
```

```js
Customer
  customerID: integer
  customerName: string
  memberCategory: string (unused)
  age: integer
  gender: string
  amountSpent: double (unused)
  address: string
  city: string (unused)
  countryCode: string (unused)
  contactTitle: string
  phoneNumber: integer
  email: string
  password: string
  phoneCountryCode: integer
  home: Location
  work: Location
  savedLocations: Location[]
  paymentMethods: []
    cardHolder: string
    cardNumber: long
    expiryDate: integer
    cvv: integer
    defaultPaymentMethod: boolean
```

```js
Location (subclass for Customer and Booking)
placeID: string (cachable key from Google Maps API) (unused)
lat: float
lng: float
postcode: string
address: string
placeName: string
```

```js
Driver;
driverID: integer;
driverName: string;
phoneNumber: integer;
rating: double;
```

```js
Review
  reviewID: integer (ID)
  customerID: integer
  driverID: integer
  messageReceivedTime: long (ms since epoch)
  rating: integer (1 to 5)
  reviewBody: string
  areasOfImprovement:
    cleanliness: boolean
    politeness: boolean
    punctuality: boolean
    bookingProcess: boolean
    waitTime: boolean
```

```js
Taxi;
sno: integer(ID);
taxiNumber: string;
taxiType: "plus" | "regular";
tmdtid: string;
taxiFeature: taxiMakeModel: string;
taxiPassengerCapacity: integer;
taxiColor: string;
registeredDrivers: [](unused);
driverID: integer;
driverName: string;
driverPhone: integer;
```

<i>\*sno = serial number; tmdtid may be a better key for auto-incrementing</i>

**Kafka Models** (Stream Data)

These are defined in the Kafka folder under `Kafka/models/`

```js
BookingEvent;
customerID: integer;
customerName: string;
phoneNumber: string;
taxiType: string;
fareType: string;
fare: double;
distance: double;
paymentMethod: string;
eta: double;
pickUpLocation: Location;
dropLocation: Location;
```

```js
DispatchEvent;
customerID: integer;
customerName: string;
customerPhoneNumber: integer;
status: string;
tmdtid: integer;
taxiNumber: string;
taxiPassengerCapacity: integer;
taxiMakeModel: string;
taxiColor: string;
driverID: integer;
driverName: string;
driverPhoneNumber: integer;
sno: integer;
rating: double;
```

```js
TaxiLocatorEvent;
tmdtid: integer;
driverID: integer;
taxiNumber: string;
availabilityStatus: boolean;
currentPosition: lat: float;
lng: float;
```

```js
ChatEvent
  recipientID: string ('d' + driverID or 'c' + customerID)
  type: string
  body: string
```

</details>

<br />

---

---

<a id="sourcecode"></a>

<a id="usermanual"></a>

### User Manual

<a id="installation"></a>

<details>
  <summary>Installation</summary>

This is a brief installation guide - refer to the detailed installation guide for help

**Pre-requisites**

- NPM, Node
- JDK
- VSCode
- Google Maps API Key
- Stub Data for Driver and Taxis

**Quick Guide**

1. Clone the project: `git clone https://github.com/suriarasai/ARTS-REBU.git`
2. Run `npm install` on the `customer-app`, `driver-app`, and `demo-app` (try running `npm run dev` on the `demo-app` to see if it renders)
3. Add `.env.local` into the root directory of each of the above apps and populate it with `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[APIKEY]`
4. Configure the MongoDB connection by creating `.env` at `src/main/resources/.env` with the following:

```java
MONGO_DATABASE="rebu"
MONGO_USER=""
MONGO_PASSWORD=""
MONGO_CLUSTER="localhost:27017"
```

5. Install Kafka and configure the environment variables. Restart the PC if necessary
6. Start the Zookeeper server via PowerShell. Point the following command at where Kafka was installed

```java
zookeeper-server-start.bat D:\\kafka\\config\\zookeeper.properties
```

7. Start the Kafka server in a new PowerShell terminal (mind the path):

```java
kafka-server-start.bat D:\\kafka\\config\\server.properties
```

8. Install MongoDB Community Server with MongoDB Compass
9. Using MongoDB Compass, create a new database, `rebu`, and add 5 empty collections: `Booking`, `Customer`, `Driver`, `Review`, and `Taxi`
10. Import the stub data into the `Driver` and `Taxi` collections
11. Run the main Java method, `src/main/java/com/rebu/RebuApplication.java`, using the play button on the top right
12. Run `npm run dev` on the remaining apps (`customer-app` and `driver-app`) then open `localhost:3000` (and 3001, 3002)
13. Optional: Install the customer application as a PWA using the icon in the browser's search bar

</details>

<a id="accounts"></a>

<details>
  <summary>User Accounts and Personalization</summary>
  
  <br />

**Registration**: The landing screen on startup is sign-in or register screen. Enter a phone number and if it's not recognized, then the user will be routed through the registration process. Bypass the OTP screen by clicking the next button then fill in the account details

\*Note: Do not enter any real passwords as there's no encryption on the passwords - they're stored as-inputted

**Sign In**: Sign in can be completed via phone number or email/password. Upon successfully signing in, the user data is cached in `localstorage` so refreshing the page or closing and re-opening the application will not prompt the user to sign-in again

**Account Settings**: Account settings can be modified through the settings screen by clicking on the user profile at the top. Modify the desired fields and press the save button

**Payment Methods**: Payment methods can be accessed through the settings screen. From here, users can add a card, change the default card, and remove a card

**Saved Locations**: Users can also optionally add saved locations to make searching for locations quicker. It is possible to set a `Home` and `Work` location, as well as a general list of favourited locations. Add a location using the autocomplete search bar at the top of the screen and click on the suggested address to register the change

</details>

<a id="booking"></a>

<details>
  <summary>Booking</summary>
  
<br />

**Map Interface**: Upon landing on the map screen, the user will be able to see markers of saved locations (if applicable), nearby taxi stands, and the user's current location. The 2 buttons on the right side of the screen are used for toggling points of interest, or for panning to the user's location

**Inputting Origin and Destination Locations**: There are 3 options for location input:

1. Entering an address into the autocomplete search bar
2. Clicking on a saved location in the expanded search UI
3. Selecting the 'Choose Location on the Map' option in the expanded search UI

Once the destination address is inputted, a confirmation button will appear to start the booking process. Leaving the origin address blank will default it to the user's current location

**Taxi Selection**: There are 2 taxi types - `regular` and `plus`, which differ in fare and number of seats. Users can view the origin/destination locations, select their desired taxi type, and edit the payment method before confirming the trip.

> *Note: Before confirming the trip, the user should sign into the driver application. Hover over a nearby taxi on the customer application to see the corresponding driver ID and sign into that driver's account then wait on the trips screen before confirming on the customer application. <span style="color:red">This must be done within 30 seconds</span> from the time of confirming the route to confirming the taxi selection. This is because the nearby taxis are computed in real-time and refreshed every 30 seconds (around the <span style="color:red">:15 and :45 second mark</span>). A good way to time it is to open the computer or online clock and start around the :22 or :50 second point to guarentee getting up-to-date information on which drivers are nearby (booking events are only sent to the nearest 6 drivers)

**Matching**: Users will wait at this screen until a nearby driver approves the booking request. Users can cancel at any time using the red button on the top left of the screen

*Note: Clicking on the magnifying glass icon will mock a driver and begin the trip


**Live Trip**: Once a taxi is dispatched, users will be given the taxi/driver information, estimated arrival time (ETA), and projected route the taxi driver will take. There will be 2 notifications when the driver is approaching the pickup location and after they arrive.

Once the taxi arrives at the user location, they will wait and confirm the pickup, then move toward the destination. At this stage, the user is given the option to submit a rating of the trip

\*Note: The chat/call buttons have no functionality

**Arrival**: On arrival, the user is given options to review the receipt and to rate the trip. The receipt may be accessed in the trip history screen, and can be downloaded as a PDF file.

\*Note: The print and share buttons do not have functionality for the receipt

</details>

<a id="demomanual"></a>

<details>
  <summary>Demo</summary>
  
  The demo application is an incomplete work that attempted to create a visual simulation engine that continuously generates stream data and renders it into a map interface. The implemented features are listed:

**(Route) Optimization**: This is a showcase of the Google Maps Routes API which returns a traffic-aware route between 2 locations. Users can drag and drop either of the origin/destination markers to re-compute the route. A traffic layer is also available to show country-wide traffic conditions. The top left panel displays the trip distance and time.

**(Fare) Calculation**: This is a quote engine that estimates the fare based on the time, origin, destination, and taxi type. It shows a fare breakdown upon computation

**(Matching) Visualizer**: This tool features a mocked user marker that can be dragged around the map. Upon releasing the marker at a desired location, the system will compute the nearest taxis and which ones are matched to the rider. The different marker colors indicate the taxi type and the large red circle represents the search radius. Clicking on any of the markers will open it with information on its coordinates, distance, and ETA

**(Trips) Generator**: This tool generates booking requests every second. Requested trips are randomly dispatched with a 50% chance, and dispatched trips are randomly completed (and removed) with a 20% chance, every second

**(Simulation) Interface**: This shows the location of all the taxis in Singapore through various tools such as sparse/dense clustering, heatmaps, and a traffic layer. There is also an incomplete geo-fencing tool that renders a reshapable square onto the map. This is intended to be used to filter the data streams based on the coordinates contained inside the shape. Hovering over any of the individual taxi markers will generate an infowindow on the taxi/driver information (this requires the server to be running)

</details>

<br />

---

---

### Source Code

<a id="fileorganization"></a>

<details>
  <summary>File Organization</summary>
  
**High-level overview**

```
| customer-app/ (Rider app frontend)
| data-models/ (Documentation on API I/O)
| demo-app/ (Demo app frontend w/WIP Simulator)
| driver-app/ (Driver app frontend)
| src/ (Backend)
```

**General Frontend Setup**

```
| api/ (API configuration)
| components/ (Components that render onto the pages)
| pages/ (Pages to be routed to)
| styles/
| - globals.css (Global styling)
| - maps.json (Styling for Google Maps interface)
| constants.tsx (Constant values)
| server.tsx (API router)
| state.tsx (Global state accessors via Recoil)
| types.tsx (Custom types for TypeScript)
```

**Backend Setup**

The backend code is primarily data classes for storing data in MongoDB. The `resources/` folder also contains configuration for the MongoDB and Kafka connections

```
src/main/java/com/rebu
| Booking/
| config/ (Web socket configuration)
| Customer/
| Driver/
| Kafka/
| - Models/ (Stream data models)
| Review/
| Taxi/
| RebuApplication.java
```

Each data class follows the MVC (Model, View, Controller) structure. For example, the `Customer` folder:

```
Customer
| Customer.java (Main data class)
| CustomerController.java (API routing)
| CustomerRepository.java (Custom queries)
| CustomerService.java (Data processing)
| HelperClasses.java (Custom data objects that comprise Customer.java)
```

</details>

<a id="client"></a>

<details>
  <summary>Rider Application</summary>

This section will go overview each of the functional requirements. Optional features (section 3.4) were not implemented

```
customer-app/pages/
| accountSettings.tsx (Account Settings)
| activity.tsx (Trip History)
| home.tsx (Home Screen after sign-in)
| index.tsx (Sign In)
| managePayment.tsx (Payment Methods)
| map.tsx (Map Interface)
| notifications.tsx (Placeholder screen)
| registration.tsx (Registration)
| rewardPoints.tsx (Placeholder screen)
| savedPlaces.tsx (Manage Saved Places)
| settings.tsx (Settings)
```

```
customer-app/components/
| account/ (Account-related components, ex. forms)
| Map/ (Booking components)
| payment/ (Payment components)
| ui/ (Re-used components, ex. nav bar, buffer screens)
```

**3.3.1-2 User Registration and Login**

- `pages/index.tsx`
- `pages/registration`
- `components/account/`

The UI component consists of the login screen (by phone or by email) and the registration screen. Below is the general process:

1. User inputs their phone number. If the number is recognized, they will be signed in, otherwise the user will be routed to the registration process. Form validation will be covered in the [frontend concepts](#frontendconcepts) section
2. (Skip the OTP screen by pressing the next button)

<br />

**3.3.3 Display Profile**

- `pages/settings.tsx`
- `pages/accountSettings.tsx`

Account settings re-use the registration form components to modify account information. Except, since the user information is already known, the `accountSettings` page is able to pre-populate the form elements so that users can directly change the field they want rather than update the entire form.

**3.3.4 Book Taxi**

- `pages/map.tsx`
- `components/Map/TripScreens/`

The booking process follows:

1. **Location input** (via search, saved location, or map click): Once the destination location is inputted, a button will appear to confirm the trip. A blank origin location will default to the user's current location
2. **Taxi selection and payment method**: Several processes occur at this screen:

- 6 nearby taxis are rendered and this data comes from the Singapore Government's Taxi Availability API
- Taxi ETA for each taxi type is calculated based on the nearby taxis in range
- A traffic-aware, optimized route is rendered from the origin to destination locations. This API also returns the trip duration/distance
- Fare calculation for each taxi type

3. **Matching**: Waiting for a nearby driver to accept the booking request. <span style="color: red">For demonstration purposes, it is possible to bypass the matching process by clicking on the magnifying glass icon</span>
4. **Live trip**: Step-by-step:

- Driver approves the trip and is dispatched. Driver, taxi, and ETA information are sent to the customer
- Driver streams their location to the customer throughout the journey. This causes the taxi marker to move based on the taxi locator stream events
- Taxi ETA is updated every minute. At 1 and 0 minutes remaining, there are proximity notifications reminding clients to get ready or board the taxi
- On arrival to the customer's location, the pickup is confirmed by the driver and the taxi starts moving toward the destination. The customer is given the option to rate the trip

5. **Arrival**: After the driver confirms the dropoff, the trip is considered complete and the customer can view the trip receipt (and download it) and rate the trip before returning to the main booking screen

**3.3.5 Make a Payment**

- `pages/managePayment.tsx`
- `components/payment/`

The default payment method is cash, but users may add payment cards through the manage payments screen. There are also options to remove payment methods and change the default payment method

**3.3.6 <del>Route Choices</del>**

There are no route choices, but the customer is provided a traffic-optimized route and is able to track the taxi throughout the journey

**3.3.7 View Trip History**

- `pages/activity.tsx`

This feature queries booking events by the user's ID and renders by time and trip status (ex. completed/cancelled)

**3.3.8 Places of Interest**

- Frontend: `components/Map/Controls/buttons.tsx (TogglePOI)`
- Styling: `styles/maps.json`
- Logic: `components/Map/utils/poi.tsx`

Places of interest are toggled by updating the map's `styles` property.

**3.3.9 Print Receipts**

- `components/Map/TripScreens/Arrival/Receipt.tsx`

Receipts are shown upon ride completion or by clicking on a trip in the trip history UI. The inputs to this function is the bookingID, which is used to get trip, driver, and taxi information

The receipt can be downloaded as a PDF. This is done via the `@progress/kendo-react-pdf` library which reads the DOM to generate a PDF

**3.3.10 Driver Review**

- `components/Map/TripScreens/Arrival/Rating.tsx`

The rating form appears during the live trip and arrival screens. Users can rate the driver (1-5) and offer suggestions from a multi-select list of common criticisms and/or text field.

The form submission is sent to the MongoDB database in the `Reviews` table. The driverID is automatically reported but the submitted rating does not update the driver's overall rating

**3.3.11 <del>Notifications Feature</del>**

The notifications are limited to the taxi proximity notifications that trigger based on the estimated arrival time to the customer's location.

**3.4.1 <del>In-app Chat and Calling</del>**

**3.4.2 <del>Emergency SOS</del>**

**3.4.3 <del>Share Ride</del>**

**3.4.4 <del>Interactive Map</del>**

**3.4.5 <del>Track Driver</del>**

**3.4.6 <del>View Proposed Fare Table</del>**

</details>

<a id="driver"></a>

<details>
  <summary>Driver Application</summary>
  
  The `driver-app` is a very simple application for producing/consuming stream events

**Sign In**: The sign-in page is the first page and the only required field is the driverID. Enter an integer from 1 to 3000. The selected driver will correspond with the index in the stub data

Driver information can be viewed at the settings screen, as well as the option to sign out. It is impossible to modify the driver data from within the application.

Note: Unlike the customer application, the driver data is not actively cached and restored on page refresh. Therefore, refreshing the application at any point may cause the application to crash, at which point the best solution is to either reopen the app or sign out and sign in again

**Internationalization**: A unique trait of the driver application is language support, or internationalization. There is language support for English (default), Chinese, and Japanese. These can be toggled using the Earth icon on the bottom right corner of the sign in screen. Notice how the URL gets the localization appended (ie. `/zh`, `/ja`)

Internationalization is done through a NextJS configuration at `next.config.js` and dictionaries (ex. `locales/zh`).

```js
driver-app/next.config.js

module.exports = withPWA({
...
  i18n: {
    locales: ["en", "zh", "jp"],
    defaultLocale: "en",
  },
});
```

The user's language preference is set in the main screen and accessed by the `router`

```js
const router = useRouter();
const { locale } = router;
const lang = locale === "en" ? en : locale === "zh" ? zh : ja;
```

This is a simple solution and appropriate for smaller applications, but the NextJS documentation offers an alternate solution using [middleware](https://nextjs.org/docs/app/building-your-application/routing/internationalization). 


**Trips**: The booking lifecycle is as follows:

1. The driver waits at the `Trips` screen for a booking request (they only listen to nearby requests). Once a request appears, they can view the booking information and approve the request (thereby sending a dispatch event to the customer that contains the driver/taxi information)
2. The driver is routed to the `Maps` screen where the routes to the user and destination are calculated
3. After pressing the confirm route button, the driver will start moving toward the client and continuously stream their location
4. On arrival, the driver will send an arrival event (via the chat stream), pause and wait for the customer to board
5. Once boarded, the driver will confirm the pickup and proceed toward the destination
6. Once at the destination, the driver will confirm the dropoff via another message on the chat stream, then stop sharing their location
* At any time, if the customer cancels, the driver will receive a cancellation event through the chat stream which will cease their movement and remove the route polylines from the map

</details>

<a id="demo"></a>

<details>
  <summary>Demo Application</summary>

The purpose of the demo application is to serve as a playground to demonstrate backend processes and attempt to simulate driver-customer interactions. It runs independently and does not require the backend to be operating

<br />**(Fare) Fare Calculator**

This tool computes the fixed fare between 2 locations. The inputs are:

- Taxi Type (regular/plus)
- Pickup Time (regular/peak/night)
- Origin Location Postcode
- Destination Location Postcode
- Distance (auto-calculated)

The fare calculation, `components/fareCalculator/computeFare.tsx`, is based on [LTA's](https://www.lta.gov.sg/content/ltagov/en/getting_around/taxis_private_hire_cars/taxi_fares_payment_methods.html) and considers the following:

|                          | Base           | Plus Type       | Peak Period       | Night Time        |
| ------------------------ | -------------- | --------------- | ----------------- | ----------------- |
| Base Fare                | $2             | +$1             | +$2               |
| Minimum Fare             | $5             | +$2             |
| Distance-based Unit Fare | $0.25 per 400m | +$0.09 per 400m |
| Peak Periods             |                |                 | +25% metered fare | +50% metered fare |
| Location Surcharge\*     | $3 to $7       |
| Temporary Surcharge      | $0.02 per km   |
| Booking Fee              | $2.3           | +$1.2           | +$2.3             | +$2               |
| Cancellation Fee         | $2             | +$2             | +$4               | +$1               |

<i>\*Location surcharge is based on both origin and destination postcodes. Rates are stored in the `locationSurchageMap` variable, in the same file as the calculator</i>

<br />**(Routes) Route Optimization**

Google Maps offers an [advanced route API](https://developers.google.com/maps/documentation/routes/overview) that returns a traffic-aware route (ie. list of coordinates), trip distance, and trip duration.

How to Use: Drag and drop either of the origin/destination markers around the map

Note: This API is fairly expensive at [$0.015 USD per request](https://developers.google.com/maps/documentation/routes/usage-and-billing) because it returns traffic conditions

<br />**(Matching) Matching and Taxi ETA**

This tool helps visualize the matching process:

1. Retrieve the locations of all available taxis in Singapore (ie. a list of coordinates)
2. Assign driver IDs (and taxi IDs, assuming they're the same) to each taxi according to the index at which they're returned
3. Compute which ones are closest to the customer via straight-line lat/lng difference
4. Simulation: While rendering the nearby taxi markers, randomly assign 50% of the markers to be red (ie. plus type) or yellow (ie. regular type). In the customer application, each taxiID is querried to determine the taxi type, but this step is mocked for the demo app
5. Click on any of the taxi markers to view the straight line distance and estimated arrival time. The distance in meters is approximated by multiplying the lat/lng difference by 111190. ETA is also estimated by multiplying the distance by a certain factor
* Taxi ETA for a certain taxi type is computed as the average ETA of that specific taxi type within the 6 nearest taxis

How to use: Drag and drop the user marker to anywhere on the map (including the ocean!). The nearby taxis are re-calculated to determine the new matching

<br />**(Simulation) Visualization Tools**: This map interface demonstrates several tools offered by the Google Maps API:

* K-Means clustering (sparse, dense, none): groups taxis together and show the cluster sizes. Note that the 'none' option is very taxing because it's rendering around 1500-3000 markers onto the map. The total number of taxis can be found by zooming out (until the entire country is visible) as the cluster count changes based on zoom level
* Traffic layer: shows traffic conditions 
* Heat map: Similar to clustering but uses a color scale to measure taxi density rather than clusters and numbers
* Geo-fencing: 

Hovering over any taxi marker will create an infoWindow that shows the taxi/driver information (again, assuming the driverID and taxiID are equal). This is the only database dependency that the demo-app has - all other features will run properly without the Kafka, Mongo, or Spring Boot servers

<br />**(Trips) Data Generator**

</details>

<a id="backend"></a>

<details open>
  <summary>Backend</summary>

- 3.5.1 Taxi Booking System (TBS)
- 3.5.2 Fleet Management System (FMS)
- 3.5.3 <del>Geographical Positioning System (GPS)</del>
- 3.5.4 <del>Customer Relationship Management System (CRM)</del>
- 3.5.5 <del>Messaging Gateway</del>
- 3.5.6 <del>Financial System (FS)</del>
- 3.5.7 <del>Payment Gateway</del>

</details>

<a id="internalapis"></a>

<details open>
<summary>Internal APIs</summary>

Test

</details>

<a id="externalapis"></a>

<details open>
<summary>External APIs</summary>

Test

</details>

<a id="frontendconcepts"></a>

<details open>
  <summary>Frontend Concepts</summary>
  
  * Form Validation and Exception Handling
  * State Management
  * Internationalization
  * Progressive Web Application (PWA)
  * Reports (PDF)
  * API Routers
  * Routing

</details>

<br />

---

---

<a id="issues"></a>

### Issues and Future Work

<a id="debugging"></a>

<details>
  <summary>Debugging</summary>
  Remember to check the terminal or do inspect element on the webpage!

  <br />
  
  **First Aid**: 
  
  * Refresh the page using `Ctrl+R`. This clears all the state variables, including global ones, but does not clear cached values in `localstorage`
  * Close and re-open the app
  * Kill the terminals and restart them (backend, frontend, Kafka)
  
  **Frontend**:
  
  * Markers/components are not rendering: Refresh the page and inspect element for errors. This may happen because actions were performed that caused a re-render before the map finished loading 
  * `Google is not defined`: This happens when trying to access the google namespace (ex. google.maps.Map) before the JS loader has finished loading google. It's the same as trying to access an object before declaring it so this process must be somehow delayed. For example, declaring it as null and assigning its value in a callback function after the map is loaded
  * `Socket connection has not been closed`: This happens mostly in development when a page is refreshed while the socket is active. Ensure there's a listener in the socket's useEffect connection for cleanup (ie. disconnection) and refresh the screen
  * Google Maps API not loading: The API key may expire or not have the user's IP/domain whitelisted. Confirm with the administrator that the API key is up to date and configured properly
  * Google Maps API crashing: If a directions/routes/geocoding/autocomplete API request fails, it may be because either of the inputted locations are invalid. Check the detailed response object via inspect element and choose a new location input to see if this resolves the issue

**Backend**: Since the majority of the logic is contaied in the frontend, the backend tends to crash infrequently. Most of the time, it's because data being sent to the backend is in an incorrect format and in this case, it will be helpful to use Postman to test the endpoints

</details>

<a id="issues"></a>

<details>
  <summary>Issues</summary>

  <br />

**Retrieving Place Names from Google Maps**: The autocomplete search bar currently returns the address of a location rather than the place name. This is because not every location on Google Maps has a corresponding place name, so the response data model is inconsistent. For example, setting a location by map click would return the address at that specific coordinate rather than search for the nearest point of interest.

**Isolating Logic to Backend**: A major issue is that Rebu's logic is primarily stored on the frontend (ie. presentation layer). For example, the fare calculation and external API calls to Google Maps. In production, this is a security risk as frontend code is not as secure as the backend code

**Error Handling**: Rebu's event-based architecture is heavily reliant on API calls, which implies a demand for error handling. For example, using NextJS's [Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) custom hook or even simple `try... catch...` statements.

**TypeScript: Type-hinting**: Using `any` types is generally a bad practice as it defeats the purpose of type hinting. However, it may also be difficult to identify a variable's type, especially if it comes from an external library. For example, a Google Map interface has the `google.maps.Map` type while a React useState setter uses `React.Dispatch<React.SetStateAction<[Type]>>`. Therefore, it is important to ensure the frontend libraries are TypeScript-compatible (which is normally indicated by a `@types/[library]` package in the `package.json` file)

</details>

<a id="futurework"></a>

<details>
  <summary>Future Work</summary>

  <br />

**Unit/Integration Testing**: Tying in with the need for error handling, unit testing is an important part of development for catching errors in development. This is especially applicable for Rebu which has scaled in size and become convoluted with 3 frontend applications. For example, changing a single key name in the backend (ex. tmdtid) can lead to crashes in another application or component rather than the intended target.

**TypeScript: OOP**: TypeScript provides tools for object-orientated programming. Rebu uses this in the demo app to represent booking objects, but this concept can be extended to all custom objects like booking, dispatch, chat, and taxi locator events to reduce redundant code

**Simulation**: The current simulation is incomplete as the event generator and map interface are still separate. More work must also be done on the event generator as drivers are randomly matched to customers. Instead, only nearby drivers should be considered for matching

**Analytics**: The demo application provides an interface for creating dashboards of the stream data. One tool of interest is the `Simulation` UI's `Geofencing` tool which generates a draggable and adjustable rectangle on the map. [This example](https://developers.google.com/maps/documentation/javascript/examples/poly-containsLocation) shows how shapes can be used for geofencing via the `containsLocation([latLng])` method, to detect whether a coordinate is contained within the geofenced region. This can be used to filter the data stream and gather analytics in a specific area

**Driver App - Reading Streams from Beginning**: Currently driver application only reads messages when they are waiting on the trip UI. If they leave the screen, they will lose access to the pending booking requests. Instead, the WebSocket should be open for as long as the driver's status is 'available' - or rather, as soon as they log in, so that the driver can see all available booking requests

**KafkaJS**: Kafka has several npm libraries that can integrate with Kafka to produce/consume events. [KafkaJS](https://www.npmjs.com/package/kafkajs#getting-started) is one of the more popular examples. Incorporating this library would require using a NodeJS backend but eliminates the need for a WebSocket between NextJS and the existing Spring Boot backend

**kSQL**: Kafka has a real-time database known as [kSQL](https://www.confluent.io/blog/ksql-streaming-sql-for-apache-kafka/) which is very helpful for filtering stream data. This is particularly useful for private communication between a matched driver and their client, and for removing booking stream events once a driver accepts (to prevent double bookings)

**MongoDB Connector**: Kafka has a [connector](https://www.mongodb.com/docs/kafka-connector/current/) to MongoDB where stream data can be written to MongoDB. This may be useful for analytics or a better visualization of the data streams

**Buffer Screens**: Certain screens take longer to load, in particular, the map interface. Rebu does use loading screens in many of such pages, but buffer screens can also be implemented for components. For example, the taxi selection component also takes a long time to load so a loading element can be applied to this specific component. NextJS provides a [Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) component for this purpose

**Chat Stream**: Chat channels between customers and drivers are another application of real-time data. The frontend has icons in the live trip UI as well as an existing chat stream to facilitate this feature. However, the current chat stream is used for sending trip details such as driver arrival and customer trip cancellation so it may need to be remodelled

</details>

<br />

---

---
