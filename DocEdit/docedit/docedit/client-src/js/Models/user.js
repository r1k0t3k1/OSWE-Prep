export default class User {

	constructor(data) {
	  this.firstName = data.firstName;
	  this.lastName = data.lastName;
	  this.token = data.token;
	}
  
	sayHi() {
	  alert(this.name);
	}
  
}