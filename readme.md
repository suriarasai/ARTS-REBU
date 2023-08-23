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

**Matching**: Users will wait at this screen until a nearby driver approves the booking request. Users can cancel at any time using the red button on the top left of the screen

\*Note: Clicking on the magnifying glass icon will mock a driver and begin the trip

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

<details open>
  <summary>Rider Application</summary>

- 3.3.1 User Registration
- 3.3.2 Login
- 3.3.3 Display Profile
- 3.3.4 Book Taxi
- 3.3.5 Make a Payment
- 3.3.6 Route Choices
- 3.3.7 View Trip History
- 3.3.8 Places of Interest
- 3.3.9 Print Receipts
- 3.3.10 Driver Review
- 3.3.11 Notifications Feature
- 3.4.1 <del>In-app Chat and Calling</del>
- 3.4.2 <del>Emergency SOS</del>
- 3.4.3 <del>Share Ride</del>
- 3.4.4 <del>Interactive Map</del>
- 3.4.5 <del>Track Driver</del>
- 3.4.6 <del>View Proposed Fare Table</del>

</details>

<a id="driver"></a>

<details open>
  <summary>Driver Application</summary>
  
</details>

<a id="demo"></a>

<details open>
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

<br />**(Matching) Matching and Taxi ETA**

<br />**(Simulation) Visualization Tools**

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

<details>
<summary>Internal APIs</summary>

Test

</details>

<a id="externalapis"></a>

<details>
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

</details>

<br />

---

---

<a id="issues"></a>

### Issues and Future Work

<a id="debugging"></a>

<details open>
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

  **Backend**:
  
</details>

<a id="issues"></a>

<details>
  <summary>Issues</summary>
  
</details>

<a id="futurework"></a>

<details>
  <summary>Future Work</summary>
  
</details>

<br />

---

---
