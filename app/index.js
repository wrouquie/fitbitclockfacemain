import clock from "clock";
import { display } from "display";
import document from "document";
import { preferences } from "user-settings";
import { me } from "appbit";
import * as util from "../common/utils";
import { battery } from "power"; // import battery level (see line 51)
import { HeartRateSensor } from "heart-rate"; // import HR reading from sensor (see line 18)
import userActivity from "user-activity"; //adjusted types (matching the stats that you upload to fitbit.com, as opposed to local types)

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const batteryHandle = document.getElementById("batteryLabel");
const heartrateHandle = document.getElementById("heartrateLabel");
const hrm = new HeartRateSensor();
const stepsHandle = document.getElementById("stepsLabel");
const myMonth = document.getElementById("myMonth");
const myDay = document.getElementById("myDay");

// Update the clock every minute
clock.granularity = "minutes";

hrm.onreading = function() {
heartrateHandle.text = `${hrm.heartRate}`;} // the measured HR is being sent to the heartrateHandle set at line 16
hrm.start();

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let monthnum = today.getMonth();
  let day = today.getDate();
  var month = new Array();
  month[0] = " 1/";
  month[1] = " 2/";
  month[2] = " 3/";
  month[3] = " 4/";
  month[4] = " 5/";
  month[5] = " 6/";  
  month[6] = " 7/";
  month[7] = " 8/";
  month[8] = " 9/";
  month[9] = "10/";
  month[10] = "11/";
  month[11] = "12/";
  let monthname = month[monthnum];
  let hours = today.getHours();
    myMonth.text = `${monthname}`;
  myDay.text = `${day}`; 
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  myLabel.text = `${hours}:${mins}`;
  let batteryValue = battery.chargeLevel; // measure the battery level and send it to the variable batteryValue
    batteryHandle.text = ` ${batteryValue}%`; // the string including the batteryValue is being sent to the batteryHandle set at line 14
  let stepsValue = (userActivity.today.adjusted["steps"] || 0); // steps value measured from fitbit is assigned to the variable stepsValue
  let stepsString = stepsValue + ''; // I concatenate a the stepsValue (line above) with th string ' steps' and assign to a new variable
  stepsHandle.text = stepsString; // the string stepsString is being sent to the stepsHandle set at line 15
}

if (display.aodAvailable && me.permissions.granted("access_aod")) {
  // tell the system we support AOD
  display.aodAllowed = true;

  // respond to display change events
  display.addEventListener("change", () => {
    // Is AOD inactive and the display is on?
    if (!display.aodActive && display.on) {
      clock.granularity = "minutes";
      // Show elements & start sensors
      // someElement.style.display = "inline";
      // hrm.start();
    } else {
      clock.granularity = "minutes";
      hrm.stop();
      // Hide elements & stop sensors
      // someElement.style.display = "none";
      
    }
  });
}



