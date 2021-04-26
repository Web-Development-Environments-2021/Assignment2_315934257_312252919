var context;
var board;
var score;

var start_time;
var time_elapsed;
var interval;
var users = {};


//pacman
var pacman = new Object();
var pac_color;
var currentDirection;
var pac_life;

//monsters
var move_monsters;
var n_monsters;
var mon_speed;
var monsters;


// game settings
var food_remain = 50;
var total_food;
var food5Color = 'black';
var food15Color = 'red';
var food25Color = 'blue';
var totalGameTime;

var food_arr;

// player settings
var current_logged_in;

// mango
var mango = new Object();
mango.x;
mango.y;
mango.img = "mango";
mango.show;

// apple
var apple = new Object();
apple.x;
apple.y;
apple.time_amount;
apple.duration;
apple.is_eaten;

// clock settings
var clock = new Object();
clock.x;
clock.y;
clock.is_eaten;
clock.clock_timer;
clock.start_show;
clock.end_show;
clock.interval;
clock.time_add;
clock.added_time;

/*
user :
{
	username: string,
	password: string,
	full_name: string,
	email: string,
	birth_date: Date,
}
*/

$(document).ready(function() {
	initialize();
	// $("#dialog").dialog();

	// context = canvas.getContext("2d");
	// Start();
});

logginHandle = () => {
	let username = $('#username').val();
	let password = $('#password').val();
	let response = loginValidation(username, password);
	if(response){
		
		current_logged_in = username;
		// //TODO - check whether it should be here.
		// $('#registerBar').off('click');
		// $('#loginBar').off('click');
		
	}
	return false;
}


initialize = () => {
	user = {
		username: "k",
		password: "k"
	}
	users[user.username] = user;
	// toggleAbout();
	closeBtns();

	// form validation
	addRules();
	validate();

	$('#registerBtn').click(function(){
		hideAllDivs();
		$('#registerPage').toggle();
	});
	$('#registerBar').click(function(){
		hideAllDivs();
		endGame();
		current_logged_in = null;
		$('#registerPage').toggle();
	});
	$('#loginBtn').click(function(){
		hideAllDivs();
		$('#loginPage').toggle();
	});
	$('#loginBar').click(function(){
		hideAllDivs();
		endGame();
		current_logged_in = null;
		$('#loginPage').toggle();
	});
	$('#newgameBtn').click(function(){
		hideAllDivs();
		$('#mainGamePage').toggle();
		showGameSettings();
		context = canvas.getContext("2d");
		Start();
		$('#audio').prop("volume", 0.1);
		document.getElementById('audio').play();
	});
	$('#anotherGameBtn').click(function() {
		endGame();
		// context = canvas.getContext("2d");
		// Start();
		hideAllDivs();
		$('#settingsPage').toggle();
	});
	$('#pacmanBar').click(function() {
		hideAllDivs();
		endGame();
		$('#welcomePage').toggle();
		current_logged_in = null;
	});
	$('#aboutMenu').click(function() {
		$("#about-modal").dialog({
			modal: true,
			width: 600,
			height: 200,
			title: "About Us",
			open: function() {
				// let text = "<h3>Jonatan Milver, Guy Zaidman</h3>" + "<p>We used JQuery plugins in several places during this assignment:</p>" +
				// "<ul>" + 
				//   "<li>During implementing the validation of the registration form.</li>" +
				//   "<li>We used several JQuery user interfaces such as datepicker, slider, accordion and spectrum for colors</li>" +
				// "</ul>"
				// $(this).html(text);
				$('.ui-widget-overlay').bind('click', function(){
					$('#about-modal').dialog('close');
				})
				},
		});	
	})

}

function hideAllDivs(){
	$('#welcomePage').hide();
	$('#registerPage').hide();
	$('#loginPage').hide();
	$('#mainGamePage').hide();
	$('#settingsPage').hide();
}



function Start() {
	//general settings
	score = 0;
	pac_life = 5;
	pacman.x = 7;
	pacman.y = 3;
	food_remain = $('#food-slider').slider("option", "value");
	total_food = food_remain;
	pac_color = "yellow";
	var cnt = 100;
	totalGameTime = parseInt(gameTime.value);

	//monster settings
	move_monsters = 0;
	n_monsters = $('#monster-slider').slider("option", "value");
	mon_speed = parseInt(speed.value);
	// mon_speed = 6;
	console.log("Monster Speed:" + mon_speed);

	//mango settings
	mango.x = 4;
	mango.y = 4;
	mango.show = true;

	//apple settings
	apple.x = 2;
	apple.y = 9;
	apple.time_amount = 20;
	apple.duration = 8;
	apple.is_eaten = false;

	// clock settings
	clock.x = 2;
	clock.y = 2;
	clock.is_eaten = false;
	clock.clock_timer = 0;
	clock.start_show = 10;
	clock.end_show = 40;
	clock.interval = 100;
	clock.time_add = 5;
	clock.added_time = 0;

	food_arr = [
					['black', Math.round(0.6 * food_remain)],
					['red', Math.round(0.3 * food_remain)],
					['blue', Math.round(0.1 * food_remain)]
				];
	

	var pacman_remain = 1;
	start_time = new Date();

	//createMonsters
	buildMonsters();
	board = new Array();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2) ||
				(i == 5 && j == 7) ||
				(i == 6 && j == 7) ||
				(i == 7 && j == 7)
			){
				board[i][j] = 4;
			}
			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					let x = chooseFood();
					board[i][j] = x;
				}
				else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					pacman.x = i;
					pacman.y = j;
					pacman_remain--;
					board[i][j] = 2;
					
				}
				else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}

	while (food_remain > 0) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = chooseFood();
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(main, 100);
}

function gotCaught(){
	
	score -= 10;
	pac_life -= 1;

	if(pac_life > 0){
		buildMonsters();
		let emptyCell = findRandomEmptyCell(board);
		board[pacman.x][pacman.y] = 0;
		pacman.x = emptyCell[0];
		pacman.y = emptyCell[1];
		board[pacman.x][pacman.y] = 2;
	}

}

function buildMonsters(){
	monsters = [];
	for(let a=0; a<n_monsters; a++){
		var m = new Object();
		switch(a) {
			case 0:
				m.x = 0;
				m.y = 0;
				m.color = "rm";
				m.type = -1;
				monsters.push(m);
				break;
			case 1:
				m.x = 0;
				m.y = 9;
				m.color = "bm";
				m.type = -2;
				monsters.push(m);
				break;
			case 2:
				m.x = 9;
				m.y = 9;
				m.color = "ym";
				m.type = -3;
				monsters.push(m);
				break;
			case 3:
				m.x = 9;
				m.y = 0;
				m.color = "gm";
				m.type = -4;
				monsters.push(m);
				break;
		}
	}
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function chooseFood(){
	if(food_arr.length == 0 || food_remain == 0){
		return 0;
	}
	let r = Math.floor(Math.random() * food_arr.length);
	let kind = food_arr[r][0];
	let kind_ball = 0;
	
	if(kind == "black"){
		kind_ball = 5;
	}
	else if(kind == "red"){
		kind_ball = 15;
	}
	else{
		kind_ball = 25;
	}

	food_arr[r][1]--;
	if(food_arr[r][1] == 0){
		food_arr.splice(r,1);
	}
	return kind_ball;
}

function GetKeyPressed() {
	if (keysDown[upArrow]) {
		currentDirection = 1;
		return 1;
	}
	if (keysDown[downArrow]) {
		currentDirection = 2;
		return 2;
	}
	if (keysDown[leftArrow]) {
		currentDirection = 3;
		return 3;
	}
	if (keysDown[rightArrow]) {
		currentDirection = 4;
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblname.value = current_logged_in;
	life.value = pac_life;
	food5Color = $('#color-picker1').spectrum('get');
	food15Color = $('#color-picker2').spectrum('get');
	food25Color = $('#color-picker3').spectrum('get');
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = j * 60 + 30;
			center.y = i * 60 + 30;
			
			if (board[i][j] == 2) {
				pacman_draw(center);
			}
			else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = food5Color; //color
				context.fill();
				context.fillStyle = "white";
				context.textAlign = "center";
				context.fillText("5", center.x, center.y + 3);
			}
			else if (board[i][j] == 15) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = food15Color; //color
				context.fill();
				context.fillStyle = "white";
				context.textAlign = "center";
				context.fillText("15", center.x, center.y + 3);
			}
			else if (board[i][j] == 25) {
				context.beginPath();
				context.arc(center.x, center.y, 20, 0, 2 * Math.PI); // circle
				context.fillStyle = food25Color; //color
				context.fill();
				context.fillStyle = "white";
				context.textAlign = "center";
				context.fillText("25", center.x, center.y + 3);
			}
			else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
	//draw mango
	if(mango.show){
		let mango_img = document.getElementById(mango.img);
		context.drawImage(mango_img, mango.y * 60, mango.x * 60, 60, 60);
	}

	//draw apple
	if(!apple.is_eaten){
		let a = document.getElementById("apple");
		context.drawImage(a, apple.y * 60, apple.x * 60, 60, 60);
	}

	//draw monsters
	for(let i=0; i<monsters.length; i++){
		let m = monsters[i];
		let img = document.getElementById(m.color);
		context.drawImage(img, m.y * 60, m.x * 60, 60, 60);
	}

	//draw clock
	if(!clock.is_eaten && clock.clock_timer > clock.start_show && clock.clock_timer < clock.end_show){
		let c = document.getElementById("clock");
		context.drawImage(c, clock.y * 60, clock.x * 60, 60, 60);
	}
	
	
}

function pacman_draw(center){
	if(currentDirection == 1){
		context.beginPath();
		context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x - 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if(currentDirection == 2){
		context.beginPath();
		context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if(currentDirection == 3){
		context.beginPath();
		context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	else{
		context.beginPath();
		context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
}

function possibleMove(x, y){
	try{
		if(board[x][y] != 4 && (x < 10 && x >= 0) && (y < 10 && y >= 0)){
			for(let i=0; i<monsters.length; i++){
				if(monsters[i].x == x && monsters[i].y == y){
					return false;
				}
			}
		}
		else{
			return false;
		}
		return true;
	}
	catch{
		return false;
	}
}

function findRandomPossibleMove(x, y, remove){
	//remove: 0/2/null - 0 to remove up and down movements from moves,
	//					 2 to remove left and right.
	//					 null to not remove any movements.

	let allMoves = {
		0: [x - 1, y],  //up
		1: [x + 1, y],	//down
		2: [x, y + 1],  //right
		3: [x, y - 1]	//left
		};

	if(remove != null){
		delete allMoves[remove];
		delete allMoves[remove + 1];
	}

	let possibleMoves = [];
	for(const p in allMoves){
		if(possibleMove(allMoves[p][0], allMoves[p][1])){
			possibleMoves.push(allMoves[p]);
		}
	}

	let r = Math.floor(Math.random() * possibleMoves.length);
	return possibleMoves[r]
}

function UpdatePosition() {
	if(move_monsters == 0){

		// monsters movement
		for(let i = 0; i < monsters.length; i++){
			let m = monsters[i];
			let dx = m.x - pacman.x;
			let dy = m.y - pacman.y;
	
			let dir = null;
			Math.abs(dx) > Math.abs(dy) ? dir="x" : dir="y";
	
			if(dir == "x"){
				if(dx > 0){ //up
					if(possibleMove(m.x-1, m.y)){
						m.x--;
					}
					else{
						let move = findRandomPossibleMove(m.x, m.y, 0);
						m.x = move[0];
						m.y = move[1];
					}
				}
				else{ //down
					if(possibleMove(m.x+1, m.y)){
						m.x++;
					}
					else{
						let move = findRandomPossibleMove(m.x, m.y, 0);
						m.x = move[0];
						m.y = move[1];
					}
				}
			}
			else{
				if(dy > 0){ //left
					if(possibleMove(m.x, m.y-1)){
						m.y--;
					}
					else{
						let move = findRandomPossibleMove(m.x, m.y, 2);
						m.x = move[0];
						m.y = move[1];
					}
				}
				else{ //right
					if(possibleMove(m.x, m.y+1)){
						m.y++;
					}
					else{
						let move = findRandomPossibleMove(m.x, m.y, 2);
						m.x = move[0];
						m.y = move[1];
					}
				}
			}
		}

		// mango movement
		if(mango.show){
			let move = findRandomPossibleMove(mango.x, mango.y, null);
			mango.x = move[0];
			mango.y = move[1];
		}

		// clock movement
		let move = findRandomPossibleMove(clock.x, clock.y, null);
		clock.x = move[0];
		clock.y = move[1];
	}
	move_monsters = (move_monsters+1) % mon_speed;

	// console.log(mon_speed)
	if(apple.is_eaten){
		apple.time_amount--;
		if(apple.time_amount == 0){
			mon_speed -= apple.duration;
		}
	}

	// restart clock
	clock.clock_timer = (clock.clock_timer+1) % clock.interval;
	if(clock.clock_timer == 0){
		clock.is_eaten = false;
		let emptyCell = findRandomEmptyCell(board);
		clock.x = emptyCell[0];
		clock.y = emptyCell[1];
	}

	// pacman movement
	var x = GetKeyPressed();
	board[pacman.x][pacman.y] = 0;
	if (x == 1) {
		if (pacman.x > 0 && board[pacman.x - 1][pacman.y] != 4) {
			pacman.x--;
		}

	}
	if (x == 2) {
		if (pacman.x < 9 && board[pacman.x + 1][pacman.y] != 4) {
			pacman.x++;
		}
	}
	if (x == 3) {
		if (pacman.y > 0 && board[pacman.x][pacman.y - 1] != 4) {
			pacman.y--;
		}
	}
	if (x == 4) {
		if (pacman.y < 9 && board[pacman.x][pacman.y + 1] != 4) {
			pacman.y++;
		}
	}

	//update score
	if([5,15,25].includes(board[pacman.x][pacman.y])){
		score+= board[pacman.x][pacman.y];
		total_food -- ;
	}
	if(pacman.x == mango.x && pacman.y == mango.y){
		mango.show = false;
		mango.x = -1;
		mango.y = -1;
		score += 50;
	}
	// slows down monsters and mango
	if(pacman.x == apple.x && pacman.y == apple.y && !apple.is_eaten){
		apple.is_eaten = true;
		mon_speed += apple.duration;
	}

	if(pacman.x == clock.x && pacman.y == clock.y && !clock.is_eaten){
		clock.is_eaten = true;
		clock.added_time += clock.time_add;
	}
	for(let i=0; i<monsters.length; i++){
		if(monsters[i].x == pacman.x && monsters[i].y == pacman.y){
			gotCaught();
		}
	}
	board[pacman.x][pacman.y] = 2;

	// update time
	var currentTime = new Date() - (clock.added_time * 1000);
	time_elapsed = (currentTime - start_time) / 1000;

	// if (score >= 20 && time_elapsed <= 10) {
	// 	pac_color = "green";
	// }
}

function main() {
	UpdatePosition();
	Draw();
	isFinished();
}

function isFinished(){
	let msg = "";
	let gameOver = false;
	if(pac_life == 0){
		endGame();
		msg = "Loser!";
		gameOver = true;
	}
	else if (time_elapsed >= totalGameTime || (total_food == 0 && apple.is_eaten && !mango.show)) {
		endGame();
		gameOver = true;
		if (score >= 100){
			msg = "Winner!"
		}
		else{
			msg = "You are better than " + score + " points!";
		}
	}
	if(gameOver){
		$('<div></div>').dialog({
			modal: true,
			title: "Game Over",
			dialogClass: "no-close",
			open: function() {
				$(this).html(msg);
				},
				buttons: [
				{
				text: "OK",
				click: function() {
					$( this ).dialog( "close" );
					}
				}
				]
		});
	}
}

function endGame(){
	window.clearInterval(interval);
	let audio = document.getElementById('audio');
	audio.pause();
	audio.currentTime = 0;

}