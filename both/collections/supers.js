this.Supers = new Mongo.Collection("supers");

this.Supers.userCanInsert = function(userId, doc) {
	return true;
}

this.Supers.userCanUpdate = function(userId, doc, fields) {
	return true;
}

this.Supers.userCanRemove = function(userId, doc) {
	return false;
}



