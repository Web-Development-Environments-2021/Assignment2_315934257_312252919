addRules = () => {
	
	// password check
	jQuery.validator.addMethod("pwcheck", function(value) {
		// return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
		return /^[A-Za-z0-9]*$/.test(value) // consists of only these
			&& /\d/.test(value) // has a digit
			&& /[A-Za-z]/.test(value) // has a character
	 });

	 // letters only for full name check
	jQuery.validator.addMethod("lettersonly", function(value, element) 
	{ return this.optional(element) || /^[A-Za-z ]+$/i.test(value);});
}

registration = () => {
	if($('#regForm').valid()){
		let username = $('#userNameIn').val();
		let password = $('#passwordIn').val();
		let fName = $('#fullName').val();
		let email = $('#emailIn').val();
		let bdString = $('#datepicker').val();
		let bDate = new Date(bdString);

		let user = {
			username: username,
			password: password,
			full_name: fName,
			email: email,
			birth_date: bDate
		}
		users[user.username] = user;

		console.log(users[username])
		$('#registerPage').toggle();
		$('#loginPage').toggle();
	}
	return false;
}

validate = () => $(function() {
	// Initialize form validation on the registration form.
	// It has the name attribute "regForm"
	$("form[name='regForm']").validate({
	  // Specify validation rules
	  rules: {
		// The key name on the left side is the name attribute
		// of an input field. Validation rules are defined
		// on the right side
		userNameIn: "required",
		passwordIn: {
			required: true,
			minlength: 6,
			pwcheck: true
		},
		fullName: {
			required: true,
			lettersonly: true,
		},
		emailIn: {
		  required: true,
		  // Specify that email should be validated
		  // by the built-in "email" rule
		  email: true
		},
		datepicker: "required",
	  },
	  // Specify validation error messages
	  messages: {
		userNameIn: "User name is required",
		passwordIn: {
			required: "Please provide a password",
			minlength: "Your password must be at least 6 characters long",
			pwcheck: "Your password should have at least one digit and one character"
	  	},
		fullName: {
			required: "Please enter your name",
			lettersonly: "Full name should have letters only"
		},
		
		emailIn: {
			required: "Please enter your email",
			email: "Please enter a vaild email address"
		},
		datepicker: "Please enter your birth date"
	  },
	  // Make sure the form is submitted to the destination defined
	  // in the "action" attribute of the form when valid
	//   submitHandler: function(form) {
	// 	form.submit();
	//   }
	});
  });