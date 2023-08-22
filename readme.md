<!-- Template: https://github.com/mvllow/next-pwa-template -->
<!-- Backend: https://www.youtube.com/watch?v=5PdEmeopJVQ -->

# ARTS-REBU

Rebu is a Singapore-based taxi-hailing application used for the exploration of real-time data generation. It includes a rider app, driver app, and an incomplete admin app.

Rebu was created for the National University of Singapore's SWE 5003 (Architecting Real-Time Systems for Data Processing) module.

---

---

### Table of Contents

1. [Overview](#overview)
   <br />1.1 [Technology](#technology)
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

---

---

<a id="overview"></a>

### Overview

<a id="technology"></a>

<details>
  <summary>Technology</summary>

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

The Fleet Management System (FMS) simulates taxi location by pulling from the Singapore Government's open data API for taxi availability. This API returns a list of all available public taxis in the country and updates every 30 seconds

> Maps: **Google Maps API** (v3) <br />
> Fleet Management: **Taxi Availability API** (data.gov.sg)

  <br />

</details>

<a id="architecture"></a>

<details>
  <summary>Architecture</summary>
  
</details>

<a id="datamodel"></a>

<details>
  <summary>Data Modelling</summary>
  
</details>

<br />

---

---

<a id="sourcecode"></a>

<a id="usermanual"></a>

### User Manual

<a id="installation"></a>

<details open>
  <summary>Installation</summary>
  
  * Software Pre-requisites
  * MongoDB
</details>

<a id="fileorganization"></a>

<details>
  <summary>File Organization</summary>
  
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

<br />

---

---

### Source Code

<a id="accounts"></a>

<details>
  <summary>User Accounts</summary>
  
</details>

<a id="booking"></a>

<details>
  <summary>Booking</summary>
  
</details>

<a id="demomanual"></a>

<details>
  <summary>Demo</summary>
  
</details>

<br />

---

---

<a id="issues"></a>

### Issues and Future Work

<br />

---

---
