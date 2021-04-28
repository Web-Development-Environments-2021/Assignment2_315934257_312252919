loginValidation = (username, password) => {
	/**
	 * validates that the user is registered in the system
	 * and the password provided is associated to the user
	 */
	if(!(username in users) || users[username].password !== password){
		$('#loginAlert').toggle();
		return false;
	}
	$('#welcomePage').hide();
	$('#loginPage').toggle();
	$('#settingsPage').toggle();
	document.getElementById('loginForm').reset();
	return true;
}

closeBtns = () => {
	/* 
	closes error message in login page with pressing the X button
	*/
	let close = document.getElementsByClassName("closebtn");
	let i;

	for (i = 0; i < close.length; i++) {
	close[i].onclick = function(){
		var div = this.parentElement;
		div.style.opacity = "0";
		setTimeout(function(){ div.style.display = "none"; }, 600);
		}
	}
}