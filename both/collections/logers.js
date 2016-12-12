this.Logers = new Mongo.Collection("logers");

this.Logers.userCanInsert = function(userId, doc) {
	return true;
}

this.Logers.userCanUpdate = function(userId, doc) {
	return true;
}

this.Logers.userCanRemove = function( userId, doc) {
	return false;
}
