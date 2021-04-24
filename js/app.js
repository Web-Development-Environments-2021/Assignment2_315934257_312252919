var context;

var board;
var score;

var start_time;
var time_elapsed;
var interval;
var users = {};


//pacman settings
var pacman = new Object();
var pac_color;
var currentDirection;
var pac_life = 5;

//monsters setting
var move_monsters = 0;
var n_monsters = 4;
var mon_speed = 6;
var monsters;

// game settings
var food_remain = 50;
var food5Color = 'black';
var food15Color = 'red';
var food25Color = 'blue';
var food_arr;

// player settings
var current_logged_in;

// fruit settings
var fruit = new Object();
fruit.img = "mango";
var show_fruit;



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
		//TODO - check whether it should be here.
		$('#registerBar').off('click');
		$('#loginBar').off('click');
		
	}
	return false;
}


initialize = () => {
	user = {
		username: "k",
		password: "k"
	}
	users[user.username] = user;
	$('#mainGamePage').hide();
	$('#registerPage').hide();
	$('#loginPage').hide();
	$('#loginAlert').hide();
	$('#settingsPage').hide();
	closeBtns();
	$('#registerBtn').click(function(){
		$('#welcomePage').toggle();
		$('#registerPage').toggle();
		// part of validation
		addRules();
		validate();
	});
	$('#registerBar').click(function(){
		$('#welcomePage').hide();
		$('#loginPage').hide();
		$('#registerPage').show();

		// part of validation
		addRules();
		validate();
	});
	$('#loginBtn').click(function(){
		$('#welcomePage').toggle();
		$('#loginPage').toggle();
	});
	$('#loginBar').click(function(){
		$('#welcomePage').hide();
		$('#registerPage').hide();
		$('#loginPage').show();
	});
	$('#newgameBtn').click(function(){
		$('#mainGamePage').toggle();
		$('#settingsPage').toggle();
		context = canvas.getContext("2d");
		Start();
	})
	$('#anotherGameBtn').click(function() {
		$('#mainGamePage').toggle();
		$('#settingsPage').toggle();
	})

}



function Start() {
	board = new Array();
	score = 0;
	pac_life = 1;
	food_remain = $('#slider').slider("option", "value");
	pac_color = "yellow";
	var cnt = 100;
	food_arr = [
					['black', Math.round(0.6 * food_remain)],
					['red', Math.round(0.3 * food_remain)],
					['blue', Math.round(0.1 * food_remain)]
				];
	

	var pacman_remain = 1;
	start_time = new Date();

	fruit.x = 4;
	fruit.y = 4;
	show_fruit = true;

	//createMonsters
	buildMonsters();

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
		var emptyCell = findRandomEmptyCell(board);
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
	interval = setInterval(main, 70);
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
	//draw fruit
	if(show_fruit){
		let fruit_img = document.getElementById(fruit.img);
		context.drawImage(fruit_img, fruit.y * 60, fruit.x * 60, 60, 60);
	}


	//draw monsters
	for(let i=0; i<monsters.length; i++){
		let m = monsters[i];
		let img = document.getElementById(m.color);
		context.drawImage(img, m.y * 60, m.x * 60, 60, 60);
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
		// board[x][y];
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
				}
				else{ //down
					if(possibleMove(m.x+1, m.y)){
						m.x++;
					}
				}
			}
			else{
				if(dy > 0){ //left
					if(possibleMove(m.x, m.y-1)){
						m.y--;
					}
				}
				else{ //right
					if(possibleMove(m.x, m.y+1)){
						m.y++;
					}
				}
			}
		}

		//fruit movement
		if(show_fruit){
			let am = {
				0: [fruit.x-1, fruit.y],
				1: [fruit.x, fruit.y + 1],
				2: [fruit.x + 1, fruit.y],
				3: [fruit.x, fruit.y - 1]
				};
		
			let pm = [];
			for(let p in Object.keys(am)){
				if(possibleMove(am[p][0], am[p][1])){
					pm.push(am[p]);
				}
			}

			let r = Math.floor(Math.random() * pm.length);

			fruit.x = pm[r][0];
			fruit.y = pm[r][1];
		}
	}
	
	move_monsters = (move_monsters+1) % mon_speed;

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
	}
	if(pacman.x == fruit.x && pacman.y == fruit.y){
		show_fruit = false;
		fruit.x = -1;
		fruit.y = -1;
		score += 50;
	}
	for(let i=0; i<monsters.length; i++){
		if(monsters[i].x == pacman.x && monsters[i].y == pacman.y){
			gotCaught();
		}
	}
	board[pacman.x][pacman.y] = 2;

	// 
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
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
		window.clearInterval(interval);
		msg = "Loser!";
		gameOver = true;
	}
	else if (time_elapsed >= 100) {
		window.clearInterval(interval);
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
		console.log("Pacman position: [" + pacman.x + ", " + pacman.y + "]");
		console.log("fruit position: [" + fruit.x + ", " + fruit.y + "]");
		for(let i=0;i<monsters.length; i++){
			console.log("monster" + i + "position: [" + monsters[i].x + ", " + monsters[i].y + "]");
		}
		console.log("Game completed");
	}
}