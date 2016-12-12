this.Transak = new TAPi18n.Collection("transak");

this.Transak.userCanInsert = function(userId, doc) {
	return true;
}

this.Transak.userCanUpdate = function(userId, doc) {
	return true;
}

this.Transak.userCanRemove = function(userId, doc) {
	return false;
}
