// light-game End of Year Project. Part of doNOTtouch Experiments. 
// Eleanor Edwards. 2020

let pX;
let py;

let col = 10;
let row = 10;

let lineWid = 10;

let pt;

let grid = [];
let newGrid = [];

let horzLine = [];
let vertLine = [];

let openPoints = [];

let gameWon;

function windowResized() {

    resizeCanvas(windowWidth, windowHeight);
    background(255, 0, 0);
}

function setup() {
    gameWon = false;
    // setup canvas size and position and 0,0
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);

    // set background colour // TODO : add style
    background(255, 0, 0);

    // set start position for light grid arrays
    pX = 100;
    pY = 100;

    currentPoint = 0; // used to track light lines on/off
    previousPoint = 0;


    for (let j = 1; j < col - 3; j++) {
        for (let i = 1; i < row + 4; i++) {

            let posX = pX * i;
            let posY = pY * j;

            // fill grid array with initial points
            // add noise value for filtering grid array

            grid.push(new Points(posX, posY, noise(posX * 0.1, posY * 0.02)));

        }
    }

    // filter grid of points into newGrid using noise

    newGrid = grid.filter(e => e.pointNoise() > 0.2);

    for (let i = 0; i < newGrid.length; i++) {

        newGrid[i].open = false;
        newGrid[i].lightBool = false;
        // console.log(newGrid[i].posPoints.open);
        if (i < newGrid.length - 1) {

            if (newGrid[i + 1].posPoints.x - newGrid[i].posPoints.x === 100) {

                // push x points from filtered array into horzLines to draw horizontal lines between x's that are 100px appart
                horzLine.push(new LightLine(newGrid[i], newGrid[i + 1]));
                // console.log(newGrid[i].open);



            }
        }


        for (let j = 0; j < newGrid.length; j++) {

            newGrid[j].lightBool = false;

            if (j < newGrid.length - 1) {

                if (newGrid[i].posPoints.x - newGrid[j].posPoints.x === 0) {

                    if (newGrid[i].posPoints.y - newGrid[j].posPoints.y === 100) {

                        // push y points from filter array into vertLines to draw vertical lines between y's that are 100px appart and have equal x values
                        vertLine.push(new LightLine(newGrid[j], newGrid[i])); // takes point ref from point object 

                    }
                }
            }

        }

    }
    // newGrid[0].open = true;
    horzLine[0].pointOrigin.open = true;
    horzLine[0].pointEnd.open = true;
    vertLine[0].pointOrigin.open = true;
    vertLine[0].pointEnd.open = true;


}

function mouseClicked() {

    for (let i = 0; i < horzLine.length; i++) {
        if (mouseX > horzLine[i].origin.x && mouseX < horzLine[i].end.x && mouseY > horzLine[i].origin.y - 10 && mouseY < horzLine[i].origin.y + 10) {
            let currentPoint = i;
            isLineOpen(currentPoint, 0);
        }

    }

    for (let j = 0; j < vertLine.length; j++) {

        if (mouseY > vertLine[j].origin.y && mouseY < vertLine[j].end.y && mouseX > vertLine[j].end.x - 10 && mouseX < vertLine[j].end.x + 10) {
            let currentPoint = j;
            isLineOpen(currentPoint, 1);
        }
    }
    gameIsWon();
}

function isLineOpen(_lineIndex, _id) {

    if (_id === 0) { // checks if horz
        horzLine[_lineIndex].lineAvail();
        console.log("horz avialble at index = ", horzLine[_lineIndex].available);

        if (horzLine[_lineIndex].available === true) {

            horzLine[_lineIndex].lineClicked();

            let previousPoint = _lineIndex;

            horzLine[previousPoint].pointOrigin.open = true;
            horzLine[previousPoint].pointEnd.open = true;

            console.log("horz avialble at previous = ", horzLine[previousPoint].available, "point end = ", horzLine[previousPoint].pointEnd.open, "point origin = ", horzLine[previousPoint].pointOrigin.open);
        }
    }
    if (_id === 1) { // checks if vert

        vertLine[_lineIndex].lineAvail();

        console.log("vert avialble at index = ", vertLine[_lineIndex].available);

        if (vertLine[_lineIndex].available === true) {

            vertLine[_lineIndex].lineClicked();

            let previousPoint = _lineIndex;


            vertLine[previousPoint].pointOrigin.open = true;
            vertLine[previousPoint].pointEnd.open = true;

            console.log("vert avialble at previous = ", vertLine[previousPoint].available, "point end = ", vertLine[previousPoint].pointEnd.open, "point origin = ", vertLine[previousPoint].pointOrigin.open);

        }
    }
}


function isLineClosed() {

}

function gameIsWon() {

    let endPoint = newGrid.length;
    console.log(endPoint);

    if (newGrid[endPoint - 1].posPoints.open === true) {
        gameWon = true;
        console.log("GAMEWON");
    }
}

function draw() {

    // draw horizontal and vertical lines 
    for (let i = 0; i < horzLine.length; i++) {
        push();
        horzLine[i].lineDraw();
        pop();
    }
    for (let j = 0; j < vertLine.length; j++) {
        push();
        vertLine[j].lineDraw();
        pop();
    }

    // draw points to highlight the connection points 
    for (let p = 0; p < newGrid.length; p++) {
        let _pointCol = color(255);
        let _pointSize = lineWid;
        let endGoal = newGrid.length;

        // draw start point flashing
        if (p === 0) {
            _pointCol = color(160, random(0, 255), 0);
            _pointSize = 20;
        }

        // draw end point flashing
        if (p === endGoal - 1) {
            _pointCol = color(160, random(0, 255), 0);
            _pointSize = 20;
        }
        push();
        newGrid[p].pointDraw(_pointCol, _pointSize);
        pop();
    }
}



class Points {
    constructor(_pX, _pY, _nVal) {

        this.posPoints = createVector(_pX, _pY);
        this.nVal = _nVal;
        this.pointCol;
        this.pointSize;
        this.open = false;
    }

    pointDraw(pointCol, pointSize) {

        this.pointSize = pointSize;
        this.pointCol = pointCol;

        stroke(this.pointCol);
        strokeWeight(this.pointSize);

        point(this.posPoints.x, this.posPoints.y);
    }


    pointNoise() {

        return this.nVal;

    }

}

class LightLine {
    constructor(_origin, _end) {

        this.pointOrigin = _origin; // takes point ref from point object 
        this.pointEnd = _end;
        this.origin = createVector(this.pointOrigin.posPoints.x, this.pointOrigin.posPoints.y);
        this.end = createVector(this.pointEnd.posPoints.x, this.pointEnd.posPoints.y);
        this.lightBool = false;
        this.available = false;

    }

    lineClicked() {

        // if (this.pointOrigin.posPoints.open === true || this.pointEnd.posPoints.end === true) {
        // console.log("lights lights");
        // this.pointOrigin.open = !this.pointOrigin.open;
        // this.pointEnd.open = !this.pointEnd.open;
        this.lightBool = !this.lightBool;
        // }

    }

    lineAvail() {

        console.log("origin at line availble = ", this.pointOrigin.open);
        console.log("end at line availble = ", this.pointEnd.open);

        console.log("lightbool availble = ", this.lightBool);
        if (this.pointOrigin.open === true || this.pointEnd.open === true) {
            this.available = true;
        }
        if (this.pointOrigin.open === false && this.pointEnd.open === false) {
            if (this.lightBool === true) { // lightBool is always false when lineAvail is called 
                this.available = true;
            }
        }

        // }
    }

    lineDraw() {

        if (this.lightBool === true) {

            stroke(255);

        } else if (this.lightBool === false) {

            // this.pointOrigin.open = false;
            // this.pointEnd.open = false;
            stroke(0);

        }

        strokeWeight(lineWid);

        let path = line(this.pointOrigin.posPoints.x, this.pointOrigin.posPoints.y, this.pointEnd.posPoints.x, this.pointEnd.posPoints.y);

    }

}