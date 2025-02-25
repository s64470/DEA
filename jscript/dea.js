"use strict";

window.addEventListener('load', canvasApp, false);
function canvasApp() {
	if (!document.createElement('canvas').getContext) {
		return;
	}

	/* Initialize Foundation Framework */
	$(document).ready(function() {
		$(document).foundation();
	});

	var theCanvas = document.getElementById('canvas');
	var context = theCanvas.getContext('2d');

	//var y = (canvas.height / 2);

	/* Properties of state circles */
	var radius = 15;
	var radiusSemicircle = 10;
	var radiusEndState = (radius + 4);				// circle of end state
	var lineStrength = 1;
	var color = 'rgb(200, 200, 200)';				// light grey
	var lineColor = color;							// light grey
	//var lineColor = 'rgb(200,200,200)';			// light grey (a few nuances darker)
	var fontColor = 'rgb(0, 0, 0)';					// black
	var colorEndState = 'rgb(0, 0, 0)';				// black
	//var currentStateColor = 'rgb(222, 142, 175)';	// pink
	var currentStateColor = '#7ab9ea';				// light blue
	var stateFont = '10px Arial';					// Canvas char font/-size
	var font = '15px Arial';
	var moveRight = 29;

	var stateCoordinates = [
		[25 + moveRight, 245],				// State: s0
		[100 + moveRight, 122],				// State: s1
		[100 + moveRight, 368],				// State: s2
		[200 + moveRight, 110],				// State: s3
		[200 + moveRight, 375],				// State: s4
		[250 + moveRight, 50],				// State: s5
		[350 + moveRight, 50],				// State: s6
		[250 + moveRight, 180],				// State: s7
		[350 + moveRight, 180],				// State: s8
		[400 + moveRight, 112],				// State: s9
		[500 + moveRight, 122],				// State: s10
		[250 + moveRight, 300],				// State: s11
		[350 + moveRight, 300],				// State: s12
		[250 + moveRight, 430],				// State: s13
		[350 + moveRight, 430],				// State: s14
		[400 + moveRight, 375],				// State: s15
		[525 + moveRight, 368],				// State: s16
		[600 + moveRight, 245],				// State: s17
		[690 + moveRight, 245]				// State: s18
	];

	/* Define the position of the accepted letters */
	var posStateLetters = [
		[20, 245], [70, 190], [70, 320], [180, 100],
		[180, 400], [235, 80], [320, 40], [235, 170],
		[320, 200], [390, ((245) / 2)], [320, 105],
		[480, 100], [235, 350], [320, 290], [250, 475],
		[250, 15], [390, ((245) * 1.5)], [480, 370],
		[595, 330], [595, 195], [245, 225], [245, 265],
		[235, 420], [320, 450], [320, 360], [410, 80],
		[410, 170], [415, 350], [415, 420], [670, 245]
	];

	// Transition characters
	var reberCharset = [
		'B', 'T', 'P', 'B', 'B', 'T', 'X', 'P',
		'V', 'P', 'X', 'E', 'T', 'X', 'S', 'S',
		'P', 'E', 'P', 'T', 'T', 'S', 'P', 'V',
		'X', 'S', 'V', 'S', 'V', 'E'
	];

	var correctReberGrammar = [];											// Array: to push correct reber grammar
	var incorrectReberGrammar = [];											// Array: to push incorrect reber grammar
	var tmp = [];															// Temporary storage

	// Define variables for lines with an arrow head
	// .. > s0
	var p0 = { x: 0 + moveRight, y: 245 };
	var p1 = { x: 8 + moveRight, y: 245 };
	// s0 > s1
	var p2 = { x: 40 + moveRight, y: 245 };
	var p3 = { x: 90 + moveRight, y: 140 };
	// s1 > s3
	var p4 = { x: 115 + moveRight, y: ((245) / 2.1) };
	var p5 = { x: 180 + moveRight, y: ((245) / 2.2) };
	// s0 > s2
	var p6 = { x: 90 + moveRight, y: 348 };
	// s2 > s4
	var p7 = { x: 115 + moveRight, y: 370 };
	var p8 = { x: 180 + moveRight, y: 375 };
	// s3 > s5
	var p9 = { x: 215 + moveRight, y: ((245) / 2.2) };
	var p10 = { x: 235 + moveRight, y: 60 };
	// s5 > s6
	var p11 = { x: 265 + moveRight, y: 50 };
	var p12 = { x: 332 + moveRight, y: 50 };
	// s6 > s9
	var p13 = { x: 365 + moveRight, y: 50 };
	var p14 = { x: 390 + moveRight, y: 95 };
	// s6 > s7
	var p15 = { x: 335 + moveRight, y: 50 };
	var p16 = { x: 260 + moveRight, y: 165 };
	// s7 > s8
	var p17 = { x: 265 + moveRight, y: 180 };
	var p18 = { x: 332 + moveRight, y: 180 };
	// s8 > s6
	var p19 = { x: 350 + moveRight, y: 165 };
	var p20 = { x: 350 + moveRight, y: 70 };
	// s8 > s9
	var p21 = { x: 365 + moveRight, y: 180 };
	var p22 = { x: 390 + moveRight, y: 127 };
	// s9 > s10
	var p23 = { x: 415 + moveRight, y: 112 };
	var p24 = { x: 480 + moveRight, y: 120 };
	// s3 > s7
	var p25 = { x: 215 + moveRight, y: ((245) / 2.2) };
	var p26 = { x: 235 + moveRight, y: 170 };
	// s10 > s17
	var p27 = { x: 515 + moveRight, y: ((245) / 2) };
	var p28 = { x: 585 + moveRight, y: 230 };
	// s17 > ..
	//var p29 = { x: 630 + moveRight, y: (y / 2) };
	//var p30 = { x: 630 + moveRight, y: (y / 2) };
	// s4 > s11
	var p31 = { x: 215 + moveRight, y: ((245) * 1.52) };
	var p32 = { x: 240 + moveRight, y: 315 };
	// s11 > s12
	var p33 = { x: 265 + moveRight, y: 300 };
	var p34 = { x: 332 + moveRight, y: 300 };
	// s4 > s13
	var p35 = { x: 215 + moveRight, y: ((245) * 1.52) };
	var p36 = { x: 240 + moveRight, y: 415 };
	// s13 > s14
	var p37 = { x: 265 + moveRight, y: 430 };
	var p38 = { x: 332 + moveRight, y: 430 };
	// s12 > s15
	var p39 = { x: 365 + moveRight, y: 300 };
	var p40 = { x: 390 + moveRight, y: 360 };
	// s14 > s12
	var p41 = { x: 350 + moveRight, y: 415 };
	var p42 = { x: 350 + moveRight, y: 318 };
	// s12 > s13
	var p43 = { x: 335 + moveRight, y: 300 };
	var p44 = { x: 265 + moveRight, y: 415 };
	// s14 > s15
	var p45 = { x: 365 + moveRight, y: 430 };
	var p46 = { x: 386 + moveRight, y: 390 };
	// s15 > s16
	var p47 = { x: 415 + moveRight, y: 373 };
	var p48 = { x: 505 + moveRight, y: 370 };
	// s16 > s17
	var p49 = { x: 540 + moveRight, y: 368 };
	var p50 = { x: 590 + moveRight, y: 265 };
	// s17 > s18
	var p51 = { x: 615 + moveRight, y: (245) };
	var p52 = { x: 665 + moveRight, y: (245) };

	var size = 5;

	// Call function
	drawCanvas();

	function drawCanvas() {
		// Draw: state circles and set text inside each state circle
		for (var i = 0; i < stateCoordinates.length; i++) {
			context.moveTo(stateCoordinates[i][0], stateCoordinates[i][1]);
			context.beginPath();
			context.arc(stateCoordinates[i][0], stateCoordinates[i][1], radius, 0, (2 * Math.PI), false);
			context.fillText("s" + i, stateCoordinates[i][0], stateCoordinates[i][1]);
			context.font = stateFont;
			//context.globalCompositeOperation = 'destination-over';
			context.lineWidth = lineStrength;
			context.fillStyle = fontColor;
			context.stroke();
		}

		// Draw: 1st. semicircle clockwise
		context.beginPath();
		// context.arc(x, y, radius, startingAngle, endingAngle, (counter)clockwise);
		context.arc(235 + moveRight, 30, radiusSemicircle, (Math.PI + 5), 0, false);
		context.lineWidth = lineStrength;
		context.strokeStyle = lineColor;
		context.stroke();

		// Draw: 2nd. semicircle counterclockwise
		context.beginPath();
		// context.arc(x, y, radius, startingAngle, endingAngle, (counter)clockwise);
		context.arc(235 + moveRight, 450, radiusSemicircle, (Math.PI - 5), 0, true);
		context.lineWidth = lineStrength;
		context.strokeStyle = lineColor;
		context.stroke();

		// Draw: 3rd. semicircle clockwise
		context.beginPath();
		// context.arc(x, y, radius, startingAngle, endingAngle, (counter)clockwise);
		context.arc(235 + moveRight, 280, radiusSemicircle, (Math.PI + 5), 0, false);
		context.lineWidth = lineStrength;
		context.strokeStyle = lineColor;
		context.stroke();

		// Draw: 4th. semicircle counterclockwise
		context.beginPath();
		// context.arc(x, y, radius, startingAngle, endingAngle, (counter)clockwise);
		context.arc(235 + moveRight, 200, radiusSemicircle, (Math.PI - 5), 0, true);
		context.lineWidth = lineStrength;
		context.strokeStyle = lineColor;
		context.stroke();

		// Find the last node in an array and set it visually to the final state
		context.beginPath();

		for (let k = 0; k < stateCoordinates.length; k++) {
			context.arc(stateCoordinates[i - 1][0], stateCoordinates[i - 1][1],
				radiusEndState, 0, (2 * Math.PI), false);
		}

		context.lineWidth = lineStrength;
		context.strokeStyle = colorEndState;
		context.stroke();

		// Call function
		generateReberCharset();

		// Call functions: Draw multiple lines with an arrow head
		drawLineWithArrowhead(p0, p1, size);
		drawLineWithArrowhead(p2, p3, size);
		drawLineWithArrowhead(p4, p5, size);
		drawLineWithArrowhead(p2, p6, size);
		drawLineWithArrowhead(p7, p8, size);
		drawLineWithArrowhead(p9, p10, size);
		drawLineWithArrowhead(p11, p12, size);
		drawLineWithArrowhead(p13, p14, size);
		drawLineWithArrowhead(p15, p16, size);
		drawLineWithArrowhead(p17, p18, size);
		drawLineWithArrowhead(p19, p20, size);
		drawLineWithArrowhead(p21, p22, size);
		drawLineWithArrowhead(p23, p24, size);
		drawLineWithArrowhead(p25, p26, size);
		drawLineWithArrowhead(p27, p28, size);
		//drawLineWithArrowhead(p29, p30, size);
		drawLineWithArrowhead(p31, p32, size);
		drawLineWithArrowhead(p33, p34, size);
		drawLineWithArrowhead(p35, p36, size);
		drawLineWithArrowhead(p37, p38, size);
		drawLineWithArrowhead(p39, p40, size);
		drawLineWithArrowhead(p41, p42, size);
		drawLineWithArrowhead(p43, p44, size);
		drawLineWithArrowhead(p45, p46, size);
		drawLineWithArrowhead(p47, p48, size);
		drawLineWithArrowhead(p49, p50, size);
		drawLineWithArrowhead(p51, p52, size);
	}

	function drawLineWithArrowhead(p0, p1, headLength) {
		var PI = Math.PI;
		var degreesInRadians225 = 225 * PI / 180;
		var degreesInRadians135 = 135 * PI / 180;

		// Calc the angle of the line
		var dx = p1.x - p0.x;
		var dy = p1.y - p0.y;
		var angle = Math.atan2(dy, dx);

		// Calc arrowhead points
		var x225 = p1.x + headLength * Math.cos(angle + degreesInRadians225);
		var y225 = p1.y + headLength * Math.sin(angle + degreesInRadians225);
		var x135 = p1.x + headLength * Math.cos(angle + degreesInRadians135);
		var y135 = p1.y + headLength * Math.sin(angle + degreesInRadians135);

		context.beginPath();
		// draw the line from p0 to p1
		context.moveTo(p0.x, p0.y);
		context.lineTo(p1.x, p1.y);
		// draw partial arrowhead at 225 degrees
		context.moveTo(p1.x, p1.y);
		context.lineTo(x225, y225);
		// draw partial arrowhead at 135 degrees
		context.moveTo(p1.x, p1.y);
		context.lineTo(x135, y135);
		context.lineWidth = lineStrength;
		context.strokeStyle = lineColor;
		context.stroke();
	}

	/* Generate reber charset -> visualise and set transitions */
	function generateReberCharset() {
		context.beginPath();
		context.font = font;
		context.fillStyle = fontColor;

		/* Set position of reber charset */
		for (let p = 0; p < posStateLetters.length; p++) {
			context.fillText(reberCharset[p][0], posStateLetters[p][0], posStateLetters[p][1]);
		}

		// Call function
		visualiseAnimation(reberCharset);
	}

	function visualiseAnimation() {
		// Start DEA animation -> visualise states
		// Finite state machine
		const machine = {
			state: 'initialState',												// Initial state wait for input
			transitions: {
				initialState: {
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'B') {
							this.changeState('s0');								// Update state
							fillColors0();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'B')
							correctReberGrammar.push(textfieldValue.type);		// Push 'B'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('initialState');
							console.log('Current State: ' + this.state);

							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'B')
							tmp.push(textfieldValue.type);						// Push (value != 'B')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s0: {															// State: s0
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'P') {
							this.changeState('s2');								// Update state
							fillColors2();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'P')
							correctReberGrammar.push(textfieldValue.type);		// Push 'P'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'T') {
							this.changeState('s1');								// Update state
							fillColors1();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'T')
							correctReberGrammar.push(textfieldValue.type);		// Push 'T'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s0');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'P' || value != 'T')
							tmp.push(textfieldValue.type);						// Push (value != 'P' || value != 'T')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s1: {															// State: s1
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'B') {
							this.changeState('s3');								// Update state
							fillColors3();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'B')
							correctReberGrammar.push(textfieldValue.type);		// Push 'B'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s1');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'B')
							tmp.push(textfieldValue.type);						// Push (value != 'B')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s2: {															// State: s2
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'B') {
							this.changeState('s4');								// Update state
							fillColors4();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'B')
							correctReberGrammar.push(textfieldValue.type);		// Push 'B'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s2');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'B')
							tmp.push(textfieldValue.type);						// Push (value != 'B')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s3: {															// State: s3
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'T') {
							this.changeState('s5');								// Update state
							fillColors5();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'T')
							correctReberGrammar.push(textfieldValue.type);		// Push 'T'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'P') {
							this.changeState('s7');								// Update state
							fillColors7();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'P')
							correctReberGrammar.push(textfieldValue.type);		// Push 'P'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s3');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'T' || value != 'P')
							tmp.push(textfieldValue.type);						// Push (value != 'T' || value != 'P')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s4: {															// State: s4
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'P') {
							this.changeState('s13');							// Update state
							fillColors13();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'P')
							correctReberGrammar.push(textfieldValue.type);		// Push 'P'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'T') {
							this.changeState('s11');							// Update state
							fillColors11();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'T')
							correctReberGrammar.push(textfieldValue.type);		// Push 'T'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s4');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'P' || value != 'T')
							tmp.push(textfieldValue.type);						// Push (value != 'P' || value != 'T')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s5: {															// State: s5
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'S') {
							this.changeState('s5');								// Update state
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'S')
							correctReberGrammar.push(textfieldValue.type);		// Push 'S'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'X') {
							this.changeState('s6');								// Update state
							fillColors6();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'X')
							correctReberGrammar.push(textfieldValue.type);		// Push 'X'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s5');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'S' || value != 'X')
							tmp.push(textfieldValue.type);						// Push (value != 'S' || value != 'X')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s6: {															// State: s6
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'X') {
							this.changeState('s7');								// Update state
							fillColors7();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'X')
							correctReberGrammar.push(textfieldValue.type);		// Push 'X'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'S') {
							this.changeState('s9');								// Update state
							fillColors9();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'S')
							correctReberGrammar.push(textfieldValue.type);		// Push 'S'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s6');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'X' || value != 'S')
							tmp.push(textfieldValue.type);						// Push (value != 'X' || value != 'S')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s7: {															// State: s7
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'T') {
							this.changeState('s7');								// Update state
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'T')
							correctReberGrammar.push(textfieldValue.type);		// Push 'T'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'V') {
							this.changeState('s8');								// Update state
							fillColors8();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'V')
							correctReberGrammar.push(textfieldValue.type);		// Push 'V'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s7');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'T' || value != 'V')
							tmp.push(textfieldValue.type);						// Push (value != 'T' || value != 'V')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s8: {															// State: s8
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'P') {
							this.changeState('s6');								// Update state
							fillColors6();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'P')
							correctReberGrammar.push(textfieldValue.type);		// Push 'P'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'V') {
							this.changeState('s9');								// Update state
							fillColors9();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'V')
							correctReberGrammar.push(textfieldValue.type);		// Push 'V'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s8');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'P' || value != 'V')
							tmp.push(textfieldValue.type);						// Push (value != 'P' || value != 'V')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s9: {															// State: s9
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'E') {
							this.changeState('s10');							// Update state
							fillColors10();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'E')
							correctReberGrammar.push(textfieldValue.type);		// Push 'E'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s9');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'E')
							tmp.push(textfieldValue.type);						// Push (value != 'E')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s10: {															// State: s10
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'T') {
							this.changeState('s17');							// Update state
							fillColors17();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'T')
							correctReberGrammar.push(textfieldValue.type);		// Push 'T'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s10');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'T')
							tmp.push(textfieldValue.type);						// Push (value != 'T')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s11: {															// State: s11
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'S') {
							this.changeState('s11');							// Update state
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'S')
							correctReberGrammar.push(textfieldValue.type);		// Push 'S'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'X') {
							this.changeState('s12');							// Update state
							fillColors12();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'X')
							correctReberGrammar.push(textfieldValue.type);		// Push 'X'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s11');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'S' || value != 'X')
							tmp.push(textfieldValue.type);						// Push (value != 'S' || value != 'X')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s12: {															// State: s12
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'S') {
							this.changeState('s15');							// Update state
							fillColors15();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'S')
							correctReberGrammar.push(textfieldValue.type);		// Push 'S'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'X') {
							this.changeState('s13');							// Update state
							fillColors13();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'X')
							correctReberGrammar.push(textfieldValue.type);		// Push 'X'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s12');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'S' || value != 'X')
							tmp.push(textfieldValue.type);						// Push (value != 'S' || value != 'X')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s13: {															// State: s13
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'S') {
							this.changeState('s13');							// Update state
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'S')
							correctReberGrammar.push(textfieldValue.type);		// Push 'S'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'V') {
							this.changeState('s14');							// Update state
							fillColors14();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'V')
							correctReberGrammar.push(textfieldValue.type);		// Push 'V'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s13');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'S' || value != 'V')
							tmp.push(textfieldValue.type);						// Push (value != 'S' || value != 'V')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s14: {															// State: s14
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'P') {
							this.changeState('s12');							// Update state
							fillColors12();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'P')
							correctReberGrammar.push(textfieldValue.type);		// Push 'P'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else if (textfieldValue.type === 'V') {
							this.changeState('s15');							// Update state
							fillColors15();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'V')
							correctReberGrammar.push(textfieldValue.type);		// Push 'V'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp.push(textfieldValue.type);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s14');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'P' || value != 'V')
							tmp.push(textfieldValue.type);						// Push (value != 'P' || value != 'V')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s15: {															// State: s15
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'E') {
							this.changeState('s16');							// Update state
							fillColors16();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'E')
							correctReberGrammar.push(textfieldValue.type);		// Push 'E'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s15');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'E')
							tmp.push(textfieldValue.type);						// Push (value != 'E')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s16: {															// State: s16
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'P') {
							this.changeState('s17');							// Update state
							fillColors17();										// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'P')
							correctReberGrammar.push(textfieldValue.type);		// Push 'P'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();
							}
						} else {
							this.changeState('s16');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'P')
							tmp.push(textfieldValue.type);						// Push (value != 'P')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				s17: {															// State: s5
					changeState: function(textfieldValue) {
						if (textfieldValue.type === 'E') {
							this.changeState('finiteState');					// Update state
							fillColorfiniteState();								// Call function fillColor
							console.log('Current State: ' + this.state);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push 'E')
							correctReberGrammar.push(textfieldValue.type);		// Push 'E'

							/* Check if tmp storage is filled with elements */
							/* tmp storage is filled with incorrect elements push correctReberGrammar */
							if (tmp.length > 0) {
								tmp = tmp.concat(correctReberGrammar);

								$('<li>' + tmp + '</li>').insertAfter('#incorrectReberGrammar');
								console.info('tmp storage: ' + tmp);

								/* Delete incorrectReberGrammar && correctReberGrammar array */
								emptyArray();

								activateWarningMessage();
								scrollToBottom();								// Scroll to the bottom of the html page
								disableBtn();									// Disable Buttons
							} else {
								$('<li>' + correctReberGrammar + '</li>').insertAfter('#correctReberGrammar');
								activateWarningMessage();
								scrollToBottom();								// Scroll to the bottom of the html page
								disableBtn();									// Disable Buttons
							}
						} else {
							this.changeState('s17');
							console.log('Current State: ' + this.state);
							tmp = tmp.concat(correctReberGrammar);
							showUserInfo(textfieldValue, this.state);			// Log Info -> (Push value != 'E')
							tmp.push(textfieldValue.type);						// Push (value != 'E')
							console.info('tmp storage: ' + tmp);

							/* Delete incorrectReberGrammar && correctReberGrammar array */
							emptyArray();
						}
					}
				},
				finiteState: {													// State: finite state
					doNothing: function() {
					}
				},
				//errorState: {														// State that applies if a word is not in a language
				//stopState: function() {
				//}
				//}
			},
			dispatch(actionName, ...payload) {
				const action = this.transitions[this.state][actionName];

				if (action) {
					action.apply(machine, ...payload);
				}
			},
			changeState(newState) {
				this.state = newState;
			}
		};

		let currentState = Object.create(machine, {
			name: {
				writable: false,
				enumerable: true,
				value: "currentState"
			}
		});

		console.log('Current State: ' + currentState.state);

		function startAnimation(splittedValue, rangeSliderValue) {
			// Algorithm to jump through different states
			var reberString = splittedValue.pop();
			var loopArray = function(i) {
				if (reberString[i]) {
					console.info('Pop ' + reberString[i]);
					currentState.dispatch('changeState', [{ type: reberString[i] }]);

					setTimeout(function() {
						loopArray(i + 1);
					}, (rangeSliderValue * 1000), console.info("Speed: " + rangeSliderValue + " sec."));
				}
			}
			loopArray(0);
		}

		var textFieldValue;
		var splittedValue = [];
		/* Array list of predefined strings */
		const reberListExample = [
			'BTBPTVVETE',			// 0. Correct string
			'BPBPVPSEPE',			// 1. Correct string
			'BTBTXSETE',			// 2. Correct string

			'BTBPSVVETE',			// 0. Incorrect string
			'BPBPVPXVPSWEPE',		// 1. Incorrect string
		];

		$('#randomBtn').on('click', function() {
			const random = Math.floor(Math.random() * reberListExample.length);		// Pick a random number on the reberListExample

			console.info('Random number -> #randomBtn: ' + random);
			console.info('Random example -> #randomBtn: ' + reberListExample[random]);
			splittedValue.push(reberListExample[random].split(''));					// Read value from array and split string, e.g. [BTSS..] -> [B, T, S, S, ..]
			console.info('Array value: ' + splittedValue);

			var rangeSliderValue = $('#sliderOutput1').val();						// Get range slider value

			startAnimation(splittedValue, rangeSliderValue);

			$('#startBtn').attr('disabled', 'disabled');							// Disable Start Button
			$('#randomBtn').attr('disabled', 'disabled');							// Disable Random Button
			$('.slider').attr('disabled', 'disabled');								// Disable Range slider
			$('#reberTextfield').val(reberListExample[random])
				.attr('disabled', 'disabled');										// Set the randoly chosen string value into the Textfield and disable it
		});

		$('#startBtn').on('click', function() {										// Submit value if start button is clicked
			if ($.trim($('#reberTextfield').val()) != '') {							// Check non empty textfield
				textFieldValue = $('#reberTextfield').val();						// Read value from textfield
				splittedValue.push(textFieldValue.split(''));						// Split string to char and push it to an array
				console.info('Array value: ' + splittedValue);

				var rangeSliderValue = $('#sliderOutput1').val();					// Get range slider value

				startAnimation(splittedValue, rangeSliderValue);					// Start animation
			} else {
				console.info('Textfield is empty');
				$('#reberTextfield').css('background-color', 'rgb(186, 50, 86)');

				/* Change background color to init mode -> Background Color: white */
				setInterval(function() {
					$('#reberTextfield').css('background-color', 'rgb(255, 255, 255)');
				}, 1000);
			}

			$('#reberTextfield').val('');											// Clear input
			$('#reberTextfield').focus();											// Set cursor to textfield
		});

		// Reload/reset application
		$('#restartBtn').on('click', function() {
			// Force to reload browser window, reset array values, set colors to default
			location.reload();
		});

		/* Counter for textinput */
		$('#reberTextfield').keyup(function() {
			var count = $(this).val().length;

			$('#textLimit').html("Verbleibende Zeichen: " + count + "/20");
		});

		/* Show Textfield: console info */
		function showUserInfo(textfieldValue, state) {
			let consoleLog = document.getElementById('log');
			let _option_1 = document.createElement('option');						// Create Element -> Push..
			let _option_2 = document.createElement('option');						// Create Element -> Current state..
			let _option_3 = document.createElement('option');						// Create Element -> Programm Ende
			let _option_4 = document.createElement('option');						// Create Element -> Animation speed value..
			let rangeSliderVal = $('#sliderOutput1').val();

			if (state != 'finiteState') {
				_option_4.text = 'Animation speed > ' + '\'' + rangeSliderVal + '\'' + ' sekunden.';
				_option_1.text = 'Push > ' + '\'' + textfieldValue.type + '\'';
				_option_2.text = ' Current state is > ' + '\'' + state + '\'';
			} else {
				_option_1.text = 'Push > ' + '\'' + textfieldValue.type + '\'';
				_option_2.text = ' Current state is > ' + '\'' + state + '\'';
				_option_3.text = ' Programm beendet';
			}

			/* Add value to console textfield */
			consoleLog.add(_option_4);												// Add animation speed value to DOM strukture
			consoleLog.add(_option_1);												// Add push value to DOM strukture
			consoleLog.add(_option_2);												// Add current state value to DOM strukture

			if ($('option:contains(' + 'finiteState' + ')')) {						// Search for text value %finiteState%
				consoleLog.add(_option_3);											// Add info 'Programm Ende' to DOM strukture
			}

			var $scrollLabelArea = $('#log');
			$scrollLabelArea.scrollTop($scrollLabelArea[0].scrollHeight);			// Scroll Console textarea if a new added list element reaches the bottom
		}

		function activateWarningMessage() {
			// Enable warning message
			// On default: style="display: none;"
			$('#warning').attr('style', 'display: block;');
		}

		// Toggle user help
		$('#activateInfo').on('click', function() {
			$('#helpInfo').attr('style', 'display: block;');
		});

		// Reload window browser window if close button is clicked -> warning message
		$('.close-button').on('click', function() {
			location.reload();
		});

		function emptyArray() {
			/* Clear array values */
			incorrectReberGrammar.length = 0;
			correctReberGrammar.length = 0;
			console.info('Array cleared', incorrectReberGrammar, correctReberGrammar);
		}

		/* Set colors for each state */
		function fillColors0() {
			context.beginPath();
			context.arc(stateCoordinates[0][0], stateCoordinates[0][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors1() {
			context.beginPath();
			context.arc(stateCoordinates[1][0], stateCoordinates[1][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors2() {
			context.beginPath();
			context.arc(stateCoordinates[2][0], stateCoordinates[2][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors3() {
			context.beginPath();
			context.arc(stateCoordinates[3][0], stateCoordinates[3][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors4() {
			context.beginPath();
			context.arc(stateCoordinates[4][0], stateCoordinates[4][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors5() {
			context.beginPath();
			context.arc(stateCoordinates[5][0], stateCoordinates[5][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors6() {
			context.beginPath();
			context.arc(stateCoordinates[6][0], stateCoordinates[6][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors7() {
			context.beginPath();
			context.arc(stateCoordinates[7][0], stateCoordinates[7][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors8() {
			context.beginPath();
			context.arc(stateCoordinates[8][0], stateCoordinates[8][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors9() {
			context.beginPath();
			context.arc(stateCoordinates[9][0], stateCoordinates[9][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors10() {
			context.beginPath();
			context.arc(stateCoordinates[10][0], stateCoordinates[10][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors11() {
			context.beginPath();
			context.arc(stateCoordinates[11][0], stateCoordinates[11][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors12() {
			context.beginPath();
			context.arc(stateCoordinates[12][0], stateCoordinates[12][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors13() {
			context.beginPath();
			context.arc(stateCoordinates[13][0], stateCoordinates[13][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors14() {
			context.beginPath();
			context.arc(stateCoordinates[14][0], stateCoordinates[14][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors15() {
			context.beginPath();
			context.arc(stateCoordinates[15][0], stateCoordinates[15][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors16() {
			context.beginPath();
			context.arc(stateCoordinates[16][0], stateCoordinates[16][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColors17() {
			context.beginPath();
			context.arc(stateCoordinates[17][0], stateCoordinates[17][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		function fillColorfiniteState() {
			context.beginPath();
			context.arc(stateCoordinates[18][0], stateCoordinates[18][1], radius, 0, (2 * Math.PI), false);
			context.globalCompositeOperation = 'darken';
			context.lineWidth = lineStrength;
			context.fillStyle = currentStateColor;
			context.fill();
		}

		/* Scroll to the bottom of the html page */
		var scrollingElement = (document.scrollingElement || document.body);

		function scrollToBottom() {
			scrollingElement.scrollTop = scrollingElement.scrollHeight;
		}

		function disableBtn() {
			$('#startBtn').attr('disabled', 'disabled');							// Disable Start Button
			$('.slider').attr('disabled', 'disabled');								// Disable Range slider
			$('#randomBtn').attr('disabled', 'disabled');							// Disable Random Button
		}
	}
}