// jshint esversion: 6
$(document).ready(() => {
    paintBackground();
    let original = {};
    $("#time_div").html(displayTime(0));
    $("#play_btn").click(() => {
        if (!running) {
            sessionTime.min = $("#session_min").val();
            sessionTime.sec = $("#session_sec").val();
            breakTime.min = $("#break_min").val();
            breakTime.sec = $("#break_sec").val();
            original = { s : Number(sessionTime.min) * 60 + Number(sessionTime.sec), b : Number(breakTime.min * 60) + Number(breakTime.sec) };
            if (isSession && sessionTime.min + sessionTime.sec > 0) {
              $("#session_title").html("&#9656;Session&#9666;");
              running = true; stopTimer = false;
              startTimer(original);
            } // ens of if isSession
            else
            if (!isSession && breakTime.min + breakTime.sec > 0) {
              $("#break_title").html("&#9656;Break&#9666;");
              running = true; stopTimer = false;
              startTimer(original);
            } // ens of if isBreak
        } // end of if running
    }); // end of click play
    $("#pause_btn").click(() => { paused = !paused ? true : false; });
    // stop resets
    $("#stop_btn").click(() => {
        if (running) {
            sessionTime = {min : 0, sec : 0};
            breakTime = {min : 0, sec : 0};
            stopTimer = isSession = true;
            running = paused = false;
            $("#time_div").html(displayTime(0));
            $("#session_title").html("Session");
            $("#break_title").html("Break");
            sessionTime.min = Math.floor(original.s / 60);
            sessionTime.sec = original.s % 60;
            breakTime.min = Math.floor(original.b / 60);
            breakTime.sec = original.b % 60;
            $("#session_min").attr("value",sessionTime.min);
            $("#session_sec").attr("value",sessionTime.sec);
            $("#break_min").attr("value",breakTime.min);
            $("#break_sec").attr("value",breakTime.sec);
            paintBackground();
    } // end of if runing
    }); // end of stop
    $("#session_min_up_btn").click(() => $("#session_min").attr("value", () => { sessionTime.min = Number($("#session_min").val());
                                                                                 return sessionTime.min < 59 && !running ? ++sessionTime.min : $("#session_min").val(); }));
    $("#session_min_down_btn").click(() => $("#session_min").attr("value", () => { sessionTime.min = Number($("#session_min").val());
                                                                                 return sessionTime.min > 0 && !running ? --sessionTime.min : $("#session_min").val(); }));
    $("#session_sec_up_btn").click(() => $("#session_sec").attr("value", () => { sessionTime.sec = Number($("#session_sec").val());
                                                                                 return sessionTime.sec < 59 && !running ? ++sessionTime.sec : $("#session_sec").val(); }));
    $("#session_sec_down_btn").click(() => $("#session_sec").attr("value", () => { sessionTime.sec = Number($("#session_sec").val());
                                                                                 return sessionTime.sec > 0 && !running ? --sessionTime.sec : $("#session_sec").val(); }));
    $("#break_min_up_btn").click(() => $("#break_min").attr("value", () => { breakTime.min = Number($("#break_min").val());
                                                                                 return breakTime.min < 59 && !running ? ++breakTime.min : $("#break_min").val(); }));
    $("#break_min_down_btn").click(() => $("#break_min").attr("value", () => { breakTime.min = Number($("#break_min").val());
                                                                                 return breakTime.min > 0 && !running ? --breakTime.min : $("#break_min").val(); }));
    $("#break_sec_up_btn").click(() => $("#break_sec").attr("value", () => { breakTime.sec = Number($("#break_sec").val());
                                                                                 return breakTime.sec < 59 && !running ? ++breakTime.sec : $("#break_sec").val(); }));
    $("#break_sec_down_btn").click(() => $("#break_sec").attr("value", () => { breakTime.sec = Number($("#break_sec").val());
                                                                                 return breakTime.sec > 0 && !running ? --breakTime.sec : $("#break_sec").val(); }));
    $("#clear_btn").click(() => {
        if (!running) {
            sessionTime = {min : 0, sec : 0};
            breakTime = {min : 0, sec : 0};
            stopTimer = isSession = true;
            running = paused = false;
            $("#time_div").html(displayTime(0));
            sessionTime.min = sessionTime.sec = breakTime.min = breakTime.sec = 0;
            $("#session_min").attr("value",sessionTime.min);
            $("#session_sec").attr("value",sessionTime.sec);
            $("#break_min").attr("value",breakTime.min);
            $("#break_sec").attr("value",breakTime.sec);
        } // end of if not running
    }); // end of clear
    $("#mute_btn").click(() => {
        soundOn = soundOn ? false : true;
        if (soundOn) $("#mute_btn").css("color","rgba(162, 231, 120, 0.8)");
        else $("#mute_btn").css("color","rgba(161, 89, 89, 0.8)");
    }); // end of sound/mute
}); // end of document ready

let sessionTime = {min : 0, sec : 0};
let breakTime = {min : 0, sec : 0};
var stopTimer = false;
var paused = false;
var running = false;
var isSession = true;
var soundOn = true;
var audio = new Audio("sound/beep.mp3");

// return the time passed in percentage
function timePassed(c, t) {
    return ((c - t) / c).toFixed(2);
} // end of timeGone

function convertTimeToSec() {
    return isSession ? Number(sessionTime.min) * 60 + Number(sessionTime.sec) : Number(breakTime.min * 60) + Number(breakTime.sec);
} // end of convertTimeToSec

function convertSecToTime(t) {
    if (isSession) {
        sessionTime.min = Math.floor(t / 60);
        sessionTime.sec = t % 60;
    }  else {
        breakTime.min = Math.floor(t / 60);
        breakTime.sec = t % 60;
    } // end of if isSession
} // end of convertSecToTime

function displayTime(t) {
    let x = Math.floor(t / 60); x = x < 10 ? "0" + x : x;
    let y = t % 60; y = y < 10 ? "0" + y : y;
    return `${x}:${y}`;
} // end of displayTime

// start a timer
function startTimer (o) {
    let time = convertTimeToSec(isSession);
    if (time > 0) {
        let interval = setInterval(() => {
            let tp = timePassed(isSession ? o.s : o.b, time);
            console.log(`ENTER time: ${time}, isSession: ${isSession}, tp: ${tp}, o: ${JSON.stringify(o)}, \n --> sessionTime: ${JSON.stringify(sessionTime)}, breakTime: ${JSON.stringify(breakTime)} `);
            timeProgress(tp);
            $("#time_div").html(displayTime(time));
            if (!paused) convertSecToTime(--time);
            if (stopTimer) {
                clearInterval(interval);
                 $("#time_div").html(displayTime(0));
                 paintBackground();
                 running = false; time = undefined;
            } // end of if stopTimer
            if (time < 0) {
                 clearInterval(interval);
                 beep();
                 $("#time_div").html(displayTime(0));
                 paintBackground();
                 isSession = !isSession ? true : false;
                 if (isSession) {
                     $("#session_title").html("&#9656;Session&#9666;");
                     $("#break_title").html("Break");
                 } else {
                     $("#break_title").html("&#9656;Break&#9666;");
                     $("#session_title").html("Session");
                 } // end of if session
                 console.log("change" + isSession);
                 sessionTime.min = $("#session_min").val();
                 sessionTime.sec = $("#session_sec").val();
                 breakTime.min = $("#break_min").val();
                 breakTime.sec = $("#break_sec").val();
                 let o = { s : Number(sessionTime.min) * 60 + Number(sessionTime.sec), b : Number(breakTime.min * 60) + Number(breakTime.sec) };
                 startTimer(o);
            } // end of if time < 0
        } , 1000); // end of setInterval
    } // end of if time > 0
} // end of startTimer

// draws a black circle
function paintBackground() {
  let canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    let ctx = canvas.getContext("2d");
    // background circle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(150, 120, 110, 0.15 * Math.PI, 0.85 * Math.PI, true);
    ctx.strokeStyle = "rgb(31, 29, 32)";
    ctx.lineWidth = 20;
    ctx.lineCap = "butt";
    ctx.stroke();
  } // end of if getContext
  paintStripes();
} // end of paintCanvas

// cut the stripes on the radial progress bar
function paintStripes() {
  let canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    let ctx = canvas.getContext("2d");
    // stripes
    for (let i = 0.14; i > -1.25; i -= 0.05) {
        ctx.beginPath();
        ctx.arc(150 ,120, 110, i * Math.PI, (i + 0.02) * Math.PI);
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 22;
        ctx.stroke();
    } // end of for
    ctx.globalCompositeOperation = "source-over";
  } // end of if getContext
} // end of paintStripes

// draw the percentage gone so far
function timeProgress(pc) {
  let canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    let ctx = canvas.getContext("2d");
    paintStripes();

    // fill percentage
    ctx.beginPath();
    ctx.arc(150, 120, 110, 0.85 * Math.PI, (0.85 + pc * 1.3) * Math.PI);
    let grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grd.addColorStop("0.0", "rgb(145, 231, 146)");
    grd.addColorStop("0.5", "rgb(221, 180, 119)");
    grd.addColorStop("1.0", "rgb(181, 118, 186)");
    ctx.strokeStyle = grd;
    ctx.lineWidth = 20;
    ctx.lineCap = "butt";
    ctx.stroke();

    paintStripes();
  } // end of getContext
} // end of timeProgress

function beep() {
    if (soundOn) audio.play();
} // end of beep
