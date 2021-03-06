var pageSession = new ReactiveDict();


pageSession.set("errorMessage", "");

Template.contacto.created = function() {
	pageSession.set("errorMessage", "");	
};

Template.contacto.rendered = function() {
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#imgInp").change(function(){
    readURL(this);
});
};

// "click #file-submit-button'


Template.contacto.events({
  'click #sendpic' : function(e, t){
      e.preventDefault();

   var files = []
   var file = $('#imgInp')[0].files[0];
   files.push(file)
    console.log(files)
$('.cloudinary-fileupload').bind('fileuploadprogress', function(e, data) { 
$('.progress_bar').css('width', Math.round((data.loaded * 100.0) / data.total) + '%'); 
});

  Cloudinary._upload_file(files[0], {}, function(err, res) {
      if (err){
        console.log(err);
        return
              }

Meteor.users.update({ _id: Meteor.userId() }, { $set: {"profile.imagenum": res.public_id}});
 
       console.log(res);
     Router.go("thanks", {});
});
}, 
   
 	'click #sendnote': function(e, t) {
		e.preventDefault();
            pageSession.set("errorMessage", "");

        var to = "booby360@yahoo.com";
        var name = $('#contact-name').val();
        var from = $('#contact-email').val();
        var subject = ($('#contact-subject').val() + " De " + name);
        var message = $('#contact-message').val();

		if(message == "")
		{
                   if(document.cookie == "fr") {			
                      pass = "Boite a lettre vide";
                     }
                   if(document.cookie == "en") {			
                      pass = "Message box empty";
                     }
                   if(document.cookie == "sp") {			
                      pass = "No hay mensage";
                     }
                   if(document.cookie == "cr") {			
                      pass = "boite message la vide";
                     }
                   if(document.cookie == "po") {			
                      pass = "Caixa de mensagem vazia";
                     }
			
                        pageSession.set("errorMessage", pass);
                 }
                 else {	
		
             Meteor.call('sendmyMail', to, from, subject, message, function (error) {
                if(error) {
                    alert('????... ');
                } else {
                    $('#contact-message').val('');
                    $('#contact-subject').val('');
                  Router.go("thanks", {});
		return false;
                }
        
      });
                       } //if end
                                   
} //second click function end
});//events end

Template.contacto.helpers({
	errorMessage: function() {
		return pageSession.get("errorMessage");
	}

});

