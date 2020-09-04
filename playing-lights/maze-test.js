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

let currentPoint;
let previousPoint;


function windowResized() {

    resizeCanvas(windowWidth, windowHeight);
    background(255, 0, 0);
}

function setup() {

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

        newGrid[i].posPoints.open = false;

        // console.log(newGrid[i].posPoints.open);
        if (i < newGrid.length - 1) {

            if (newGrid[i + 1].posPoints.x - newGrid[i].posPoints.x === 100) {

                // push x points from filtered array into horzLines to draw horizontal lines between x's that are 100px appart
                horzLine.push(new LightLine(newGrid[i], newGrid[i + 1]));
            }
        }


        for (let j = 0; j < newGrid.length; j++) {

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
}

function mouseClicked() {

    for (let i = 0; i < horzLine.length; i++) {
        // console.log(newGrid[i].posPoints.open);
        if (mouseX > horzLine[i].origin.x && mouseX < horzLine[i].end.x && mouseY > horzLine[i].origin.y - 10 && mouseY < horzLine[i].origin.y + 10) {
            // console.log("horz line clicked", i, horzLine[i].origin.x, horzLine[i].end.x);
            currentPoint = i;
            if (currentPoint === 0) {
                horzLine[currentPoint].pointOrigin.posPoints.open = true;
                // console.log(horzLine[currentPoint].pointOrigin.posPoints.open);
                horzLine[currentPoint].lineClicked();
                previousPoint = currentPoint;
            } else if (currentPoint !== 0) {
                if (horzLine[currentPoint].origin.x - horzLine[previousPoint].end.x === 0 && horzLine[currentPoint].origin.y - horzLine[previousPoint].end.y === 0) {
                    console.log("horizontal to horizontal going east");
                    horzLine[currentPoint].pointOrigin.posPoints.open = true;
                    horzLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                } else if (horzLine[currentPoint].origin.x - vertLine[previousPoint].end.x === 0 && horzLine[currentPoint].origin.y - vertLine[previousPoint].end.y === 0) {
                    console.log("vertical to horizontal going east");
                    horzLine[currentPoint].pointOrigin.posPoints.open = true;
                    horzLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                } else if (horzLine[currentPoint].end.x - horzLine[previousPoint].origin.x === 0 && horzLine[currentPoint].end.y - horzLine[previousPoint].origin.y === 0) {
                    console.log("horizontal to horizontal going west");
                    horzLine[currentPoint].pointOrigin.posPoints.open = true;
                    horzLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                } else if (horzLine[currentPoint].end.x - vertLine[previousPoint].end.x === 0 && horzLine[currentPoint].end.y - vertLine[previousPoint].end.y === 0) {
                    console.log("vertical to horizontal going west");
                    horzLine[currentPoint].pointOrigin.posPoints.open = true;
                    horzLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                } else if (horzLine[currentPoint].origin.x - vertLine[previousPoint].origin.x === 0 && horzLine[currentPoint].origin.y - vertLine[previousPoint].origin.y === 0) {
                    console.log("vertical from south to horizontal going east");
                    horzLine[currentPoint].pointOrigin.posPoints.open = true;
                    horzLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                } else if (horzLine[currentPoint].end.x - vertLine[previousPoint].origin.x === 0 && horzLine[currentPoint].end.y - vertLine[previousPoint].origin.y === 0) {
                    console.log("vertical from south to horizontal going west");
                    horzLine[currentPoint].pointOrigin.posPoints.open = true;
                    horzLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                }
                // horzLine[currentPoint].pointOrigin.posPoints.open = true;

                // console.log(horzLine[currentPoint].origin.x, horzLine[previousPoint].end.x, ":", horzLine[previousPoint].pointOrigin.posPoints.open, previousPoint);
                // horzLine[currentPoint].lineClicked();
                // previousPoint = currentPoint;
            }
        }
        //     horzLine[currentPoint].origin.x - horzLine[previousPoint].end.x === 0 && horzLine[previousPoint].pointOrigin.posPoints.open === true) { // check if the end point of the previous line is equal to the beginning point of current line
        //     horzLine[currentPoint].lineClicked();
        //     previousPoint = currentPoint;
        // }

    }


    for (let j = 0; j < vertLine.length; j++) {

        if (mouseY > vertLine[j].origin.y && mouseY < vertLine[j].end.y && mouseX > vertLine[j].end.x - 10 && mouseX < vertLine[j].end.x + 10) {
            // console.log("vert line clicked", j, vertLine[j].origin.y, vertLine[j].end.y);
            currentPoint = j;
            if (currentPoint === 0) {
                vertLine[currentPoint].pointOrigin.posPoints.open = true;
                // console.log(horzLine[currentPoint].pointOrigin.posPoints.open);
                vertLine[currentPoint].lineClicked();
                previousPoint = currentPoint;
            } else if (currentPoint !== 0) {
                console.log(currentPoint);
                // console.log(vertLine[currentPoint].origin.x, "hhorisi", horzLine[previousPoint].end.x);
                if (vertLine[currentPoint].origin.y - vertLine[previousPoint].end.y === 0 && vertLine[currentPoint].origin.x - vertLine[previousPoint].end.x === 0) {
                    console.log("vertical to vertical  going south");
                    vertLine[currentPoint].pointOrigin.posPoints.open = true;
                    vertLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                } else if (vertLine[currentPoint].origin.y - horzLine[previousPoint].end.y === 0 && vertLine[currentPoint].origin.x - horzLine[previousPoint].end.x === 0) {
                    console.log("horizontal to vertical going south");
                    vertLine[currentPoint].pointOrigin.posPoints.open = true;
                    vertLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                } else if (vertLine[currentPoint].end.y - vertLine[previousPoint].origin.y === 0 && vertLine[currentPoint].end.x - vertLine[previousPoint].origin.x === 0) {
                    console.log("vertical to vertical  going north");
                    vertLine[currentPoint].pointOrigin.posPoints.open = true;
                    vertLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                } else if (vertLine[currentPoint].end.y - horzLine[previousPoint].end.y === 0 && vertLine[currentPoint].end.x - horzLine[previousPoint].end.x === 0) {
                    console.log("horizontal to vertical going north");
                    vertLine[currentPoint].pointOrigin.posPoints.open = true;
                    vertLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;

                } else if (vertLine[currentPoint].origin.y - horzLine[previousPoint].origin.y === 0 && vertLine[currentPoint].origin.x - horzLine[previousPoint].origin.x === 0) {
                    console.log("horizontal going east to vertical going south");
                    vertLine[currentPoint].pointOrigin.posPoints.open = true;
                    vertLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                } else if (vertLine[currentPoint].end.y - horzLine[previousPoint].origin.y === 0 && vertLine[currentPoint].end.x - horzLine[previousPoint].origin.x === 0) {
                    console.log("horizontal going east to vertical going north");
                    vertLine[currentPoint].pointOrigin.posPoints.open = true;
                    vertLine[currentPoint].lineClicked();
                    previousPoint = currentPoint;
                }

                // vertLine[currentPoint].pointOrigin.posPoints.open = true;

                // console.log(vertLine[currentPoint].origin.x, vertLine[previousPoint].end.x, ":", vertLine[previousPoint].pointOrigin.posPoints.open, previousPoint);
                // vertLine[currentPoint].lineClicked();
                // previousPoint = currentPoint;
                // }
            }
        }
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
        this.open;
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

    }

    lineClicked() {
        // console.log(this.pointOrigin.posPoints.open);
        if (this.pointOrigin.posPoints.open === true) {
            this.lightBool = !this.lightBool;
        }
        console.log(this.pointOrigin.posPoints);
        // console.log(this.lightBool);

    }

    lineDraw() {

        if (this.lightBool) {

            stroke(255);

        } else if (this.lightBool === false) {

            stroke(0);

        }

        strokeWeight(lineWid);

        let path = line(this.pointOrigin.posPoints.x, this.pointOrigin.posPoints.y, this.pointEnd.posPoints.x, this.pointEnd.posPoints.y);

    }

}


/*
function lineAvailable(_lineIndex) {

    horzLineIndex = _lineIndex;

    // if (horzLineIndex === 0) {

    horzLine[horzLineIndex].lineClicked();

    horzLine[horzLineIndex].pointEnd.open = true; // opening origin point

    currentPoint = horzLineIndex; // trying to keep track of which is open // not working - vertical lines being turned on  ??
    console.log(currentPoint);
    // }
}

function mouseClicked() {
    console.log("WASSSSUP");
    let horzLineIndex = 0;
    let vertLineIndex = 0;

    newGrid[previousPoint].open = true;
    console.log(newGrid[previousPoint].open);
    console.log(previousPoint);
    // position checks against mouseX position and horizontal line points : +/- 10 used as tolerance 
    for (let i = 0; i < horzLine.length; i++) {

        if (mouseX > horzLine[i].origin.x && mouseX < horzLine[i].end.x && mouseY > horzLine[i].origin.y - 10 && mouseY < horzLine[i].origin.y + 10) {
            currentPoint = i;
            if (currentPoint === 0) {
                horzLine[currentPoint].lineClicked();
            } else {

                console.log(currentPoint);
                let dist = newGrid[currentPoint].posPoints.x - newGrid[previousPoint].posPoints.x;
                console.log(dist);
                if (dist === 100) {
                    horzLine[currentPoint].lineClicked();
                    newGrid[currentPoint].open = true; // opening origin points  // NOT GOING TO WORK BECAUSE SOME OF THE LINES YOU TRAVEL BACKWARDS ON SO THE END POINT NEEDS TO BE OPEN FIRST
                    // lineAvailable(i);
                    previousPoint = currentPoint;


                }
            }

            // currentPoint++;




            // if (horzLine[lineSelectCounter].pointOrigin.open === true && horzLine[lineSelectCounter].pointEnd.open === true) {
            //     horzLine[horzLineIndex].lineClicked();

            // }
            console.log("horizontal line clicked");


        }

    }

    // position checks against mouseY position and vertical line points : +/- 10 used as tolerance 
    for (let j = 0; j < vertLine.length; j++) {

        if (mouseY > vertLine[j].origin.y && mouseY < vertLine[j].end.y && mouseX > vertLine[j].end.x - 10 && mouseX < vertLine[j].end.x + 10) {

            vertLineIndex = j;
            // if (vertLineIndex === 0) {
            vertLine[vertLineIndex].lineClicked();
            // vertLine[vertLineIndex].pointEnd.open = true; // closing origin point
            // currentPoint = vertLineIndex; // trying to keep track of which is open // not working - vertical lines being turned on  ??
            // console.log(currentPoint);
            // vertLine[vertLineIndex].lineClicked();
            // }

            console.log("vertical line clicked");
            // lineSelectCounter++;

        }

    }
    // console.log(horzlineIndex);

}
*/
