this.Customers = new Mongo.Collection("customers");

this.Customers.userCanInsert = function(ownerId, userId, doc) {
	return true;
}

this.Customers.userCanUpdate = function( ownerId, controller, userId, fields, doc) {
	return true;//userId && doc.ownerId == userId;
}

this.Customers.userCanRemove = function(userId, doc) {
	return true;
}
