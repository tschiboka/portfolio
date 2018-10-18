// jshint esversion: 6
$(document).ready(function() {
    buildPlayArea(19, 17);
    $("#quit, #whos_turn").hide();
    $("#comp_pl").click(setComp);
    $("#difficulty").click(setDifficulty);
    $("#x_o").click(setXO);
    // shade the vertical and horizontal lines when hover
    $("td").hover(
        function() {
          $(`.${$(this).attr("title").match(/x\d+/)},
             .${$(this).attr("title").match(/y\d+/)}`)
             .css("background-color","rgba(19, 31, 67, 0.05)");
        }, // end of function mouseIn
        function() {
          $(`.${$(this).attr("title").match(/x\d+/)},
             .${$(this).attr("title").match(/y\d+/)}`)
             .css("background-color","rgba(19, 31, 67, 0)");
        } // end of function mouseOut
    ); // end of hover td
    $("td").click(play);  // start the game w the current settings
    $("#quit").click(() => { $("#quit, #whos_turn").hide(500);
                             $("#comp_pl, #x_o, #difficulty").show(500);
                             clearAreaArr();
                             $("td").html("");
                             finishedGame = false;
    }); // end of click quit
    $("#quit").hover(() => { $("#quit").html("&lt;quit&gt;"); },
                     () => { $("#quit").html("quit"); });
    $("#x_score").html(score[0]);
    $("#o_score").html(score[1]);
}); // end of document ready

// create a grid area
function buildPlayArea(x, y) {
    let tableContent = "";
    for (let i = 0; i < y; i++) {
        tableContent += "<tr>";
        for (let ii = 0; ii < x; ii++){
            tableContent += `<td id="tblx${ii}y${i}"
                                 title="x${ii} y${i}"
                                 class="x${ii} y${i}"
                                 value=""></td>`;
        } // end of for y
        tableContent += "</tr>";
    } // end of for y
    $("#play_area").append(tableContent);
} // end of buildPlayArea

function clearAreaArr() {
    for (let i = 0; i < 17; i++) {
        for (let ii = 0; ii < 19; ii++) {
            areaArr[i][ii] = "";
        } // end of inner for
    } // end of outer for
} // end of clearAreaArr

// set computer or 2Player
function setComp() {
    computer = computer ? false : true;
    if (computer) {
        $("#comp_pl").html(` [Computer] 2-Player<br />`);
        $("#difficulty").html(`&lt;${difficulty}&gt;`);
    }
    else {
        $("#comp_pl").html(` Computer [2-Player]<br />`);
        $("#difficulty").html("");
    } // end pf if computer
} // end of setComp

function setDifficulty() {
    difficulty = difficulty == "easy" ? "hard" : "easy";
    $("#difficulty").html(`&lt;${difficulty}&gt;`);
} // end of setDifficulty

// set if the player1 wants to play w x or y
function setXO() {
    xSign = xSign ? false : true;
    if (xSign) $("#x_o").html("[X] O");
    else $("#x_o").html("X [O]");
} // end of setXO

// global vars
var computer = true,         // default selection against computer
    xSign = true,            // default selection x
    xComing = true,          // determines the next player, start w x
    finishedGame = false;    // no more moves if one wins
    difficulty = "easy";     // def : "easy" / "hard"

const areaArr = (() => {     // create a 2 dimensional array 19 * 17
    let arr = [];
    for (let i = 0; i < 17; i++) {
        arr[i] = new Array(19).fill("");
    } // end of for
    return arr;
})(); // end of areaArr declaration


function play() {
    const x = Number(String($(this).attr("title").match(/x\d+/)).match(/\d+/)), // fetch x and y values from title
          y = Number(String($(this).attr("title").match(/y\d+/)).match(/\d+/));
    if (computer) {
        /*
        Code played against computer comes here
        */
    } // end of if computer
    else {
        if (!finishedGame && !$(`#tblx${x}y${y}`).html()) {
            areaArr[y][x] = xComing ?  "X" : "O";
            xComing = xComing ? false : true;
            $("#whos_turn").html(`<br /> player ${ xComing ? "X" : "O" }&apos;s turn`);
            console.log(x, y, areaArr[y][x] ,"\n", JSON.stringify(areaArr));
        } // end if cell is empty
    } // end of else computer and game still going
    if (!finishedGame) {
        updateArea();
        let result = searchMatches();
        if (result) {
            for (let id of result) {
                $(id).css("color", "green"); // color the winner cells
                finishedGame = true;         // dont allow more moves
                console.log(id);
             } // end of results iteration
        } // end of if searchMatches
        $("#comp_pl, #x_o, #difficulty").hide(500);
        $("#quit, #whos_turn").show(500);
    } // end of if game is still going
} // end of play

function updateArea() {
    areaArr.map((row, ri, ra) => {
        return Array.from(row).map((cell, ci, ca) => {
            if (cell == "X" || cell == "O") {
                $(`#tblx${ci}y${ri}`).css("color",cell == "X" ? "#131F43" : "#f77171");
                $(`#tblx${ci}y${ri}`).html(cell);
            } // end if cell X || O
        }); // end of map row
    }); // end of map areaArr
} // end of updateArea

/* searching algorithm, searches for 5 matches
 * thruthy result returns the ids of table tds */
function searchMatches() {
    // tests the argument (coordinates) if finds winner matches
    function compareFive(ax, ay, bx, by, cx, cy, dx, dy, ex, ey) {
      console.log(ax, ay, bx, by, cx, cy, dx, dy, ex, ey);
      //console.log(a, b, c, d, e);
        let a = areaArr[ax][ay] || "",       // avoid undefined matrix values
            b = areaArr[bx][by] || "",
            c = areaArr[cx][cy] || "",
            d = areaArr[dx][dy] || "",
            e = areaArr[ex][ey] || "";
        return (a == b && b == c && c == d && d == e);
    } // end of iterateFive
    for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 17; x++) {
            if (areaArr[x][y] && compareFive(x, y, x, y + 1, x, y + 2, x, y + 3, x, y + 4))
                 return [`#tblx${x}y${y}`,`#tblx${x}y${y + 1}`,`#tblx${x}y${y + 2}`,`#tblx${x}y${y + 3}`,`#tblx${x}y${y + 4}`];
        /*    if (areaArr[x][y] && compareFive(x, y, x + 1, y, x + 2, y, x + 3, y, x + 4, y))
                 return [`#tblx${x}y${y}`,`#tblx${x + 1}y${y}`,`#tblx${x + 2}y${y}`,`#tblx${x + 3}y${y}`,`#tblx${x + 4}y${y}`];*/
        } // end of inner for
    } // end of outer for
    return false;
} // end of searchMatches




//
