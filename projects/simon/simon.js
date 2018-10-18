// jshint esversion: 6
$(document).ready(function() {
    $(document).keydown(function(event) {
      event.preventDefault();
      if(on && !computerIsPlaying) {
        const keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == "38") press(1);
        if (keycode == "39") press(2);
        if (keycode == "40") press(3);
        if (keycode == "37") press(4);
      } // end of if on
    });
    $(document).keyup(function(event) {
      if(on) {
        const keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == "38") {$("#key-green").css("border-style","outset");}
        if (keycode == "39") {$("#key-yellow").css("border-style","outset");}
        if (keycode == "37") {$("#key-red").css("border-style","outset");}
        if (keycode == "40") {$("#key-blue").css("border-style","outset");}
      }
    });
    $(".key").click(function () {
          if (on && !computerIsPlaying)
          switch ($(this).attr("id")) {
              case "key-green":  { press(1); break; }
              case "key-yellow": { press(2); break; }
              case "key-blue":   { press(3); break; }
              case "key-red":    { press(4); break; }
          } // end of switch
    });
    $(".key").hover(function() {
                        $(this).css("border-style","inset");
                             },
                    function() {
                        $(this).css("border-style","outset");
                    });
    $("#on-off-button").hover(function() {
                                 $(this).css("color", onHoverColor);
                                 $(this).css("border-style", "inset");
                               },
                              function() {
                                 $(this).css("color","#ccc");
                                 $(this).css("border-style", "outset");
                                 if (on)  {
                                    $(this).css("color", onGreenColor);
                                    $(this).css("border-style", "inset");
                                 }
                              });
    $("#strict-button").hover(function() {
                              $(this).css("border-style", "inset");
                              },
                             function() {
                                $(this).css("border-style", "outset");
                                if (strict)  { $(this).css("border-style", "inset"); }
                             });
    $("#start-button").hover(function() {
                                 $(this).css("border-style","inset");
                                 },
                              function() {
                                 $(this).css("border-style","outset");
                              });
    $("#on-off-button").click(toggleOn);
    $("#strict-button").click(toggleStrict);
    $("#start-button").click(play);
}); // end of document ready

const onGreenColor = "rgb(144, 186, 114";
const onHoverColor = "rgb(230, 235, 145)";
const strictOnColor = "rgba(226, 119, 100, 0.9)";
const strictOffColor = "rgba(226, 119, 100, 0.2)";
const progressbarBackground = "linear-gradient(to right, rgb(235, 163, 120), rgb(221, 90, 90))";
const audio1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
const audio2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
const audio3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
const audio4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
const audioGameOver = new Audio("https://www.soundjay.com/misc/sounds/fail-buzzer-01.mp3");
const audioWin = new Audio("https://audio.code.org/win3.mp3");
var on = false;                     // ON / OFF
var strict = false;                 // strict creates new sequence each time
var sequenceSize = 20;
var score = 0;                      // correct presses
var sequence = createSequence();    // string of numbers [1 - 4]
var computerIsPlaying = false;      // prevents keypresses while computer plays
var pressed = "";                   // individual keypresses
var gamerSequence = "";             // the gamer input sequence
let playTimer, keypressTimer;

function toggleOn() {
    on = on ? false : true;
    let onTxt = on ? "ON" : "OFF";
    $("#on-off-button").html(onTxt);
    if(!on) {
        clearTimeout(keypressTimer);
        clearInterval(playTimer);
        pressed = gamerSequence = ""; score = 0;
    } // end of reset when toggled off
} // end of toggleOn

function toggleStrict() {
    if (on) {
        strict = strict ? false : true;
        if (strict) $("#led").css("background-color", strictOnColor);
        else $("#led").css("background-color", strictOffColor);
    } // end of if
} // end of toggleOn

function press(num) {
    if (num == 1) {$("#key-green").css("border-style","inset");  pressed = "1"; audio1.play();}
    if (num == 2) {$("#key-yellow").css("border-style","inset"); pressed = "2"; audio2.play();}
    if (num == 3) {$("#key-blue").css("border-style","inset");   pressed = "3"; audio3.play();}
    if (num == 4) {$("#key-red").css("border-style","inset");    pressed = "4"; audio4.play();}
  addKeypress();
} // end of press

function createSequence() {
    let s = "";
    for (let i = 0; i < sequenceSize; i++) {
        let random = Math.floor(Math.random() * 4) + 1;
        s += String(random);
    } // end of for
    console.log(s);
    return s;
} // end of createSequence

function gameOver() {
    $(".progress-bar").css("background", "linear-gradient(to right, rgb(175, 47, 47), rgb(97, 38, 38)");
    audioGameOver.play();
    setTimeout(() => {
        $(".progress-bar").css("background", progressbarBackground);  // set back original color
        pressed = gamerSequence = "";   // reset
        play();
    }, 1000); // end of setTimeout when lose
} // end of gameOver

function addKeypress() {
    gamerSequence += pressed;
    pressed = "";
    clearTimeout(keypressTimer);
    let compare = sequence.slice(0, gamerSequence.length);
    if (gamerSequence.length == sequenceSize && compare == gamerSequence) {   // if win
        $(".progress-bar").css("width", "100%");
        $(".progress-bar").css("background", "linear-gradient(to right, rgb(124, 158, 74), rgb(33, 191, 73)");
        audioWin.play();
        setTimeout(() => {
            $(".progress-bar").css("background", progressbarBackground);  // set back original color
            score = 0; pressed = gamerSequence = "";   // reset
            sequence = createSequence();
            play();
        }, 2000); // end of setTimeout when win
    } // end of if win
    else if (gamerSequence.length - 1 == score && compare == gamerSequence) {  // if press correctly subsequent
        score++; gamerSequence = "";
        playSequence(); }
    else {
        if (compare != gamerSequence)  gameOver();
        else waitKeypress();
    } // end of else the right length and content
} // end of addKeypress

function waitKeypress() {
    if (on) { // in case when switched off while playing, won't wait and buzz
        keypressTimer = setTimeout(() => {
            if (!pressed) { clearTimeout(keypressTimer); gameOver(); }
        }, 3000); // end of setTimeout 3s
    } // end of if
} // end of waitKeypress

function playSequence() {
  let i = 0;
  let playTimer = setInterval(() => {
      let note = sequence[i];
      let sound = 0; color = "";
      switch (note) {
          case "1" : { sound = audio1; color = "green";  break; }
          case "2" : { sound = audio2; color = "yellow";  break; }
          case "3" : { sound = audio3; color = "blue";  break; }
          case "4" : { sound = audio4; color = "red";  break; }
      } // end of switch
      $(".progress-bar").css("width", `${(100 / sequenceSize) * score}%`);
      sound.play();
      $(`#key-${color}`).css("border-style","inset");
      // set shorter keypresses
      setTimeout(() => {
          $(".key").css("border-style","outset");
      }, 500); // end of setTimer 0.5s
      if (i >= score) {
          clearInterval(playTimer);
          computerIsPlaying = false;
          waitKeypress();
      } // end of if iteration is over
      i++;
  }, 1000); // end of setInterval 1s
} // end of playSequence

function play() {
    if (on && strict) createSequence();
    if (on && !computerIsPlaying) {
        $(".progress-bar").css("width", `${(100 / sequenceSize) * score}%`);
        computerIsPlaying = true;
        playSequence();
    } // end of if on and not playing
} // end of play
