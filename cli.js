#!/usr/bin/env node

// Install dependencies
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

// Create the help text
const args = minimist(process.argv.slice(2));
if (args.h) {
    console.log(
        `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
	`);
    process.exit(0);
}

// Timezone
let timezone = null;
if (args.z) {
    timezone = args.z;
} else {
    timezone = moment.tz.guess();
}

// Latitude and Longitude
let latitude = 0;
if(args.n) {
    latitude = args.n;
} else if (args.s) {
    latitude = args.s * -1;
} else {
    console.log("Latitude must be in range");
    process.exit(0);
}

let longitude = 0;
if(args.e) {
    longitude = args.e;
} else if(args.w) {
    longitude = args.w * -1;
} else {
    console.log("Longitude must be in range");
    process.exit(0);
}

// request URL
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' +
    latitude + '&longitude=' + longitude
    + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);

const data = await response.json();

if (args.j) {
    console.log(data);
    process.exit(0);
}

//  response text
const days = args.d
const dph = data.daily.precipitation_hours[days];

if (days == 0) {
    if(dph == 0) {
        console.log("You probably won't need your galoshes today.")
    } else {
        console.log("You probably need your galoshes today.")
    }
} else if (days > 1) {
    if(dph == 0) {
        console.log("You probably won't need your galoshes in " + days + " days.");
    } else {
        console.log("in " + days + " days.")
    }
} else {
    if(dph == 0){
        console.log("You probably won't need your galoshes tomorrow.");
    } else {
        console.log("You probably need your galoshes tomorrow.");
    }
}

process.exit(0);