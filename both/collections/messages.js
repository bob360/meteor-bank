this.Messages = new Mongo.Collection("messages");

this.Messages.userCanInsert = function(userId, doc) {
	return true;
}

this.Messages.userCanUpdate = function(userId, doc) {
	return true;
}

this.Messages.userCanRemove = function(  mycell, clicell, fields, doc) {
	return true;
}
