//jshint esversion: 6
$(document).ready(function (){
    $(".bttn").click(function () { numericInput($(this).attr("value")); });
});

var parts = [];
var currentPart = "";
var currentIsNegative = false;
var currentIsDecimal = false;

function controlValue(v) {
    function reset() {
        currentPart = v = "";
        currentIsNegative = currentIsDecimal = false;
    } // end of reset
    function putParts() {
        parts.push(Number(currentPart), v);
        reset();
        return "";
    } // end of putParts
    switch (true) {
        case v === "=": {
            if (currentPart.match(/[\d.]$/)) {
                parts.push(Number(currentPart));
                reset();
                currentPart = calculate();
                parts = [];
                return "";
            } else { return "";}
            alert(v);
            break;
        } // end of case "="
        case !!(v === "+" || v === "*" || v === "/") : {
            if (currentPart.match(/[\d.]$/)) { putParts(); return ""; } // end of if ends /w number or period
            else return "";
            break;
        } // end of case +*/
        case v === ".": {
            if (currentPart.length == 0) { currentIsDecimal = true; return "0."; }
            if (!currentIsDecimal) { currentIsDecimal = true; return v; }
            else return "";
            break;
        } // end of case .
        case v === "-": {
            if (currentPart.length == 0 && !currentIsNegative) { currentIsNegative = true; return v; }
            if (currentPart.length == 1 && currentIsNegative) {
                currentIsNegative = false;
                currentPart = "";
                return "";
            } // end of if currentPart is negative
            if (currentPart.match(/[\d.]$/)) { putParts(); return ""; } // end of if ends /w number or period
            break;
        } // end of case -
    } // end of switch
} // end of controlValue

function calculate() {
    // operator precedence
    while (parts.indexOf("*") > -1 || parts.indexOf("/") > -1)
    parts.map((e, i, a) => {
      if (e === "*" || e === "/") {
          if (e === "*") a[i] = a[i - 1] * a[i + 1];
          else a[i] = a[i - 1] / a[i + 1];
          parts.splice(i + 1, 1);
          parts.splice(i - 1, 1);
          console.log("CALCULATE" + parts);
      } // end of if * /
    }); // end of map
    while (parts.indexOf("+") > -1 || parts.indexOf("-") > -1)
    parts.map((e, i, a) => {
      if (e === "+" || e === "-") {
          if (e === "+") a[i] = a[i - 1] + a[i + 1];
          else a[i] = a[i - 1] - a[i + 1];
          parts.splice(i + 1, 1);
          parts.splice(i - 1, 1);
          console.log("CALCULATE" + parts);
      } // end of if + -
    }); // end of map
    console.log("RESULT" + parts);
    // prevent too long decimal numbers
    let decimal = "" + parts[0] % 1;
    let whole = parts[0] - decimal;
    if (decimal) {
        if (decimal.toString().length > 5) decimal = decimal.slice(0,6);      
        parts[0] = whole + +decimal;
    } // end of if part is decimal
    return parts;
} // end of calculate

function numericInput(val) {
    if (val == "Del") {                      // reset
      $("#display").html("");
      $("#history").html("");
        val = currentPart = "";
        currentIsNegative = currentIsDecimal = false;
        parts = [];
        return;
    } // end of if del
    if (!val.match(/[0-9]/)) val = controlValue(val);
    if(currentPart.length < 9) currentPart += val;
    if(currentPart.length > 10) { currentPart = ""; $("#history").html("enrty too long"); return; }
    console.log(JSON.stringify(parts) + "\ncurrentPart " + currentPart + " currentIsDecimal " + currentIsDecimal + " currentIsNegative " + currentIsNegative);
    if (!currentPart.length && parts.length)  $("#display").html(parts[parts.length - 1]);
    else $("#display").html(currentPart);
    $("#history").html(parts.join("") + currentPart);
} // end of numericInput
