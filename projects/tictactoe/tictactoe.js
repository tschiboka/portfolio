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
          $(`.${$(this).attr("title").match(/cell\d+/)},
             .${$(this).attr("title").match(/row\d+/)}`)
             .css("background-color","rgba(19, 31, 67, 0.1)");
        }, // end of function mouseIn
        function() {
          $(`.${$(this).attr("title").match(/cell\d+/)},
             .${$(this).attr("title").match(/row\d+/)}`)
             .css("background-color","rgba(19, 31, 67, 0)");
        } // end of function mouseOut
    ); // end of hover td
    $("td").click(play);  // start the game w the current settings
    $("#quit").click(() => { $("#quit, #whos_turn").hide(500);
                             $("#comp_pl, #x_o, #difficulty").show(500);
                             clearAreaArr();
                             $("td").html("");
                             finishedGame = false;
                             xTurn = true;
    }); // end of click quit
    $("#quit").hover(() => { $("#quit").html("&lt;quit&gt;"); },
                     () => { $("#quit").html("quit"); });
    $("#x_score").html(score[0]);
    $("#o_score").html(score[1]);
}); // end of document ready

/***********************************
 * The general settings of the game*
 ***********************************/
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

// difficulty : "easy" / "hard"
function setDifficulty() {
    difficulty = difficulty == "easy" ? "hard" : "easy";
    $("#difficulty").html(`&lt;${difficulty}&gt;`);
} // end of setDifficulty

// set if the player1 wants to play w x or y
function setXO() {
    playerWithX = playerWithX ? false : true;
    if (playerWithX) $("#x_o").html("[X] O");
    else $("#x_o").html("X [O]");
} // end of setXO

/*************************************
 * the necessary vaiables, the array,*
 * and the game surface table        *
 *************************************/

// create a grid area
function buildPlayArea(x, y) {
    let tableContent = "";
    for (let i = 0; i < y; i++) {
        tableContent += "<tr>";
        for (let ii = 0; ii < x; ii++){
            tableContent += `<td id="tblrow${i}cell${ii}"
                                 title="row${i} cell${ii}"
                                 class="row${i} cell${ii}"
                                 value=""></td>`;
        } // end of for y
        tableContent += "</tr>";
    } // end of for y
    $("#play_area").append(tableContent);
} // end of buildPlayArea

// global vars
var computer = true,         // default selection against computer
    playerWithX = true,            // if against computer default selection x
    xTurn = true,          // determines the next player, start w x
    finishedGame = false,    // no more moves if one wins
    difficulty = "easy",     // def : "easy" / "hard"
    score = [0, 0];          // X ==> score[0] O ==> score[1]

const table = (() => {     // create a 2 dimensional array 19 * 17
    let arr = [];
    for (let i = 0; i < 17; i++) {
        arr[i] = new Array(19).fill("");
    } // end of for
    return arr;
})(); // end of table declaration

/*****************************************
 * The logical functions to play the game*
 *****************************************/

 function updateArea() {
     table.map((row, ri, ra) => {
         return Array.from(row).map((cell, ci, ca) => {
             if (cell == "X" || cell == "O") {
                 $(`#tblrow${ri}cell${ci}`).css("color",cell == "X" ? "#131F43" : "#f77171");
                 $(`#tblrow${ri}cell${ci}`).html(cell);
             } // end if cell X || O
         }); // end of map row
     }); // end of map table
 } // end of updateArea

 function clearAreaArr() {
     for (let i = 0; i < 17; i++) {
         for (let ii = 0; ii < 19; ii++) {
             table[i][ii] = "";
         } // end of inner for
     } // end of outer for
 } // end of clearAreaArr

function play() {
    const row  = Number(String($(this).attr("title").match(/row\d+/)).match(/\d+/)), // fetch x and y values from title
          cell = Number(String($(this).attr("title").match(/cell\d+/)).match(/\d+/));

    function checkResult() {
        let result = searchMatches();
        if (result) {
            for (let id of result) {
                $(id).css("color", "rgb(101, 161, 107)"); // color the winner cells
             } // end of results iteration
             finishedGame = true;            // dont allow more moves
             xTurn = xTurn ? false : true;
             $("#whos_turn").html(`${xTurn ? "X" : "O"} is the winner!<br />`);
             if (xTurn) score[0]++; else score[1]++;    // update score
             $("#x_score").html(score[0]); $("#o_score").html(score[1]); // display score
             xTurn = true;
        } // end of if searchMatches
    } // end of checkResult

    if (!finishedGame) {
        if (computer) {
            if ((xTurn && playerWithX) || (!xTurn && !playerWithX)) {
                if (!table[row][cell]) {
                  table[row][cell] = playerWithX ?  "X" : "O";
                  xTurn = xTurn ? false : true;
                  computerMoves();
                  xTurn = xTurn ? false : true;
                }  // end of if cell is empty
            } // end of if players turn
            else {
                computerMoves();
                xTurn = xTurn ? false : true;
            } // end of if computers turn
        } else {
            if (!table[row][cell]) {
                table[row][cell] = xTurn ?  "X" : "O";
                xTurn = xTurn ? false : true;
            } // end of if cell is empty
        } // end of if computer
        $("#whos_turn").html(`<br /> player ${xTurn ? "X" : "O" }&apos;s turn`);
        updateArea();
        checkResult();
        $("#comp_pl, #x_o, #difficulty").hide(500);
        $("#quit, #whos_turn").show(500);
    } // end of if game is still going
} // end of play

/**********************************************
 * searching algorithm, searches for 5 matches*
 * thruthy result returns the ids of table tds*
 **********************************************/
function searchMatches() {
    let match = mapArea("X","X","X","X","X") || mapArea("O","O","O","O","O");
    return match && (() => {
            let x = match.x, y = match.y;
            switch (match.direction) {
                 case "horizontal"  : return [`#tblrow${x}cell${y}`,`#tblrow${x}cell${y + 1}`,`#tblrow${x}cell${y + 2}`,`#tblrow${x}cell${y + 3}`,`#tblrow${x}cell${y + 4}`];
                 case "vertical"    : return [`#tblrow${x}cell${y}`,`#tblrow${x + 1}cell${y}`,`#tblrow${x + 2}cell${y}`,`#tblrow${x + 3}cell${y}`,`#tblrow${x + 4}cell${y}`];
                 case "diagonal_pos": return [`#tblrow${x}cell${y}`,`#tblrow${x + 1}cell${y + 1}`,`#tblrow${x + 2}cell${y + 2}`,`#tblrow${x + 3}cell${y + 3}`,`#tblrow${x + 4}cell${y + 4}`];
                 case "diagonal_neg": return [`#tblrow${x}cell${y}`,`#tblrow${x - 1}cell${y + 1}`,`#tblrow${x - 2}cell${y + 2}`,`#tblrow${x - 3}cell${y + 3}`,`#tblrow${x - 4}cell${y + 4}`];
            } // end of switch
        })(); // end of return lambda
} // end of searchMatches

// general map function checks horizontally,vertically and diagonally returns xcoord, ycoord, direction
function mapArea(...args) {
    function compare(r, c, x, y) {
        var flag = true;
        for (let i = 0; i < args.length; i++) { // still cant figure out how to avoid nested loops
            if (r + (i * x) < 0 || r + (i * x) > 16 || c + (i * y) < 0 || c + (i * y) > 18 ||  // avoid undefined array values by hiding behind short circuit op
                args[i] != table[r + (i * x)][c + (i * y)]) { flag = false; break; }         // avoid unnecessary iteration
        } // end of args iteration
        return flag ? true : false;
    } // end of compare helper
    for (let r = 0; r < 17; r++) {
        for (let c = 0; c < 19; c++) {
            if (!table[r][c] && args[0] != "") continue;  // cut iteration when cell is empty
            switch (true) {
                case compare(r, c, 0, 1): return {x : r, y : c, direction : "horizontal"};
                case compare(r, c, 1, 0): return {x : r, y : c, direction : "vertical"};
                case compare(r, c, 1, 1): return {x : r, y : c, direction : "diagonal_pos"};
                case compare(r, c, -1, 1): return {x : r, y : c, direction : "diagonal_neg"};
            } // end of switch
        } // end of inner for
   } // end of outer for
return false;
} // end of mapArea

function computerMoves() {
    const CS = xTurn ?  "X" : "O"; // computers sign
    const PS = xTurn ?  "O" : "X"; // players sign
    function put(ax, ay) { if (!table[ax][ay]) table[ax][ay] = CS;}

    // place a move concidering direction return true if obj has direction
    function moveTo(obj, distance) {
        switch (obj.direction) {
                case "horizontal":   { put(obj.x,            obj.y + distance); return true; }
                case "vertical":     { put(obj.x + distance, obj.y);            return true; }
                case "diagonal_pos": { put(obj.x + distance, obj.y + distance); return true; }
                case "diagonal_neg": { put(obj.x - distance, obj.y + distance); return true; }
        } // end of switch direction
    } // end of decideDirection

    function evaluate(obj, distance) {
        function valueOf(ax, ay) {
            if (ax < 0 || ax > 16 || ay < 0 || ay > 18) return false;
            //console.log("value" , ax); console.log(table[ax][10]);
            return table[ax][ay] == CS ? 10 : (table[ax][ay] == "" ? 1 : false);
        } // end of valueOf
        function lookAround(lx, ly) {
            let value = 0;
            for (let i = 1; i <= 4; i++) { if (valueOf(lx, ly + i)) { value += valueOf(lx, ly + i); } else break; }
            for (let i = 1; i <= 4; i++) { if (valueOf(lx, ly - i)) { value += valueOf(lx, ly - i); } else break; }
            for (let i = 1; i <= 4; i++) { if (valueOf(lx + i, ly)) { value += valueOf(lx + i, ly); } else break; }
            for (let i = 1; i <= 4; i++) { if (valueOf(lx - i, ly)) { value += valueOf(lx - i, ly); } else break; }
            for (let i = 1; i <= 4; i++) { if (valueOf(lx + i, ly + i)) { value += valueOf(lx + i, ly + i); } else break; }
            for (let i = 1; i <= 4; i++) { if (valueOf(lx - i, ly + i)) { value += valueOf(lx - i, ly + i); } else break; }
            for (let i = 1; i <= 4; i++) { if (valueOf(lx - i, ly - i)) { value += valueOf(lx - i, ly - i); } else break; }
            for (let i = 1; i <= 4; i++) { if (valueOf(lx + i, ly - i)) { value += valueOf(lx + i, ly - i); } else break; }
            return value;
        } // end of lookAround
        let op1, op2, x1, y1, x2, y2; op1 = op2 = 0; x1 = x2 = obj.x; y1 = y2 = obj.y;
        switch (obj.direction) {
            case "horizontal"  : {  y2 += distance; break; }
            case "vertical"    : {  x2 += distance; break; }
            case "diagonal_pos": {  x2 += distance; y2 += distance; break; }
            case "diagonal_neg": {  x2 -= distance; y2 += distance; break; }
        } // end of switch
        op1 = lookAround(x1, y1);
        op2 = lookAround(x2, y2);
        console.log(`OPTION1 : [${x1},${y1}]=${op1} OPTION2 : [${x2},${y2}]=${op2}`);
        return (op1 > op2) ? [x1,y1] : [x2,y2];
    } // end of function evaluate

    // search for four matches in order of priority
    if(difficulty == "easy") switch(true) {
        case moveTo(mapArea("", CS, CS, CS, CS), 0) || moveTo(mapArea("", PS, PS, PS, PS), 0) : return;
        case moveTo(mapArea(CS, "", CS, CS, CS), 1) || moveTo(mapArea(PS, "", PS, PS, PS), 1) : return;
        case moveTo(mapArea(CS, CS, "", CS, CS), 2) || moveTo(mapArea(PS, PS, "", PS, PS), 2) : return;
        case moveTo(mapArea(CS, CS, CS, "", CS), 3) || moveTo(mapArea(PS, PS, PS, "", PS), 3) : return;
        case moveTo(mapArea(CS, CS, CS, CS, ""), 4) || moveTo(mapArea(PS, PS, PS, PS, ""), 4) : return;
        case moveTo(mapArea("", CS, CS, CS), 0)     || moveTo(mapArea("", PS, PS, PS), 0)     : return;
        case moveTo(mapArea(CS, "", CS, CS), 1)     || moveTo(mapArea(PS, "", PS, PS), 1)     : return;
        case moveTo(mapArea(CS, CS, "", CS), 2)     || moveTo(mapArea(PS, PS, "", PS), 2)     : return;
        case moveTo(mapArea(CS, CS, CS, ""), 3)     || moveTo(mapArea(PS, PS, PS, PS), 3)     : return;
        case moveTo(mapArea("", CS, CS), 0)         || moveTo(mapArea("", PS, PS), 0)         : return;
        case moveTo(mapArea(CS, "", CS), 1)         || moveTo(mapArea(PS, "", PS), 1)         : return;
        case moveTo(mapArea(CS, CS, ""), 2)         || moveTo(mapArea(PS, PS, ""), 2)         : return;
        case moveTo(mapArea("", CS), 0)             || moveTo(mapArea("", PS, PS), 0)         : return;
        case moveTo(mapArea(CS, ""), 1)             || moveTo(mapArea(PS, ""), 1)             : return;
        default: { let x, y;
                       do { x = Math.floor(Math.random() * 16); y = Math.floor(Math.random() * 18); }
                       while (table[x][y]);
                       put(x, y);  return;
                  } // end of default
    } // end of switch moves
    else {
        switch(true) {
        // winner move or avoid losing
            case moveTo(mapArea("", CS, CS, CS, CS), 0) || moveTo(mapArea("", PS, PS, PS, PS), 0) : return;
            case moveTo(mapArea(CS, "", CS, CS, CS), 1) || moveTo(mapArea(PS, "", PS, PS, PS), 1) : return;
            case moveTo(mapArea(CS, CS, "", CS, CS), 2) || moveTo(mapArea(PS, PS, "", PS, PS), 2) : return;
            case moveTo(mapArea(CS, CS, CS, "", CS), 3) || moveTo(mapArea(PS, PS, PS, "", PS), 3) : return;
            case moveTo(mapArea(CS, CS, CS, CS, ""), 4) || moveTo(mapArea(PS, PS, PS, PS, ""), 4) : return;
        } // end of switch
        const XTHREEX = mapArea("", CS, CS, CS, "") || mapArea("", PS, PS, PS, "");
        if (XTHREEX) { let e = evaluate(XTHREEX, 4); put(e[0], e[1]); return;}
        switch(true) {
            case moveTo(mapArea("", CS, CS, CS), 0)     || moveTo(mapArea("", PS, PS, PS), 0)     : return;
            case moveTo(mapArea(CS, "", CS, CS), 1)     || moveTo(mapArea(PS, "", PS, PS), 1)     : return;
            case moveTo(mapArea(CS, CS, "", CS), 2)     || moveTo(mapArea(PS, PS, "", PS), 2)     : return;
            case moveTo(mapArea(CS, CS, CS, ""), 3)     || moveTo(mapArea(PS, PS, PS, PS), 3)     : return;
        } // end of switch
        const XTWOX = mapArea("", CS, CS, "") || mapArea("", PS, PS, "");
        if (XTWOX) { let e = evaluate(XTWOX, 3); put(e[0], e[1]); return;}
        switch(true) {
            case moveTo(mapArea("", CS, CS), 0)         || moveTo(mapArea("", PS, PS), 0)         : return;
            case moveTo(mapArea(CS, "", CS), 1)         || moveTo(mapArea(PS, "", PS), 1)         : return;
            case moveTo(mapArea(CS, CS, ""), 2)         || moveTo(mapArea(PS, PS, ""), 2)         : return;
        } // end of switch
        const XONEX = mapArea("", CS, "") || mapArea("", PS, "");
        if (XONEX) { let e = evaluate(XONEX, 2); put(e[0], e[1]); return;}
        switch(true) {
            case moveTo(mapArea("", CS), 0)             || moveTo(mapArea("", PS, PS), 0)         : return;
            case moveTo(mapArea(CS, ""), 1)             || moveTo(mapArea(PS, ""), 1)             : return;
        } // end of switch
        let x, y;
        do { x = Math.floor(Math.random() * 16); y = Math.floor(Math.random() * 18); }
        while (table[x][y]);
        put(x, y);  return;
    } // end of difficulty hard
} // end of computerMoves
