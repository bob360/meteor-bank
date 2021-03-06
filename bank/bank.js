
//var pageSession = new ReactiveDict();
Session.set("viewon", false);
Session.set("rapport", false);
Session.set("depot", false);
Session.set("transfer", false);
Session.set("procpaydet", false);
Session.set("procpretbank", false);
Session.set("geo", "off");
if (Meteor.isClient) {

  Meteor.startup(function() {//
   GoogleMaps.load();
 Meteor.subscribe('customers_got');

});
Template.banktrans.helpers({
geoloc: function () {
   return Session.get("geo");
},
 warning: function () {
 return Session.get("warning");
},
viewon: function () {
return Session.get("viewon");
},
fees: function () {
   return Session.get("fees");
}

});
Template.banktrans.created = function() {
// Meteor.subscribe('customers_got'); //, "onhand", "debt", "loanpermited", "interest", "versement", "showme", "controller", "_id");
 Meteor.subscribe('supers_sup', 'taxaccu', 'loanpermitted', 'loanaccu', 'interestaccu', 'fraisaccu', 'fraisfix', 'regtransfees');
 this.autorun(function() {
      cellu = Meteor.users.findOne({_id: Meteor.userId()}).profile.cell;
    Session.set("cellu", cellu);
 var stat = Meteor.users.findOne({_id: Meteor.userId()}).profile.status;
   Session.set("statu", stat);

});
};
Template.banktrans.rendered = function() {
 var langage = Meteor.users.findOne({_id: Meteor.userId()}).profile.langage;
  TAPi18n.setLanguage(langage);
  Session.set("langage", langage);
 Meteor.subscribe('customers_got');
 var self = this;
  // Subscribe
  self.subscribe("customers_got", "onhand", "debt", "loanpermited", "interest", "versement", "showme", "controller", "_id");
  self.subscribe("super_sup", 'fraisaccu', 'regtransfees', 'loancollected', 'loanaccu', 'fraisfix', 'taxaccu', 'loanpermited', 'interestaccu');
  self.subscribe('transak');
  self.subscribe("messages", 'mycell', 'clicell');
  // Do reactive stuff when subscribe is ready
  self.autorun(function() {
    if(! self.subscriptionsReady()) {
      return;
     } else {

  if ( Session.get("statu") == "off") {
     Session.set("viewon", false);
     Session.set("warning", true);
      return;
              }
    if (Session.get("statu") == "active") {
      Session.set("rapport", false);
      Session.set("depot", false);
      Session.set("transfer", false);
      Session.set("procpaydet", false);
      Session.set("procpretbank", false);
      Session.set("showmap", false);
      Session.set("warning", false);
      Session.set("viewon", true);
Customers.find({ _id: Session.get("cellu")}, { "onhand":1, "debt":1, "loanpermited":1, "interest":1, "versement":1, "showme":1, "controller":1, "_id":1}).map(function(doc) {
  avoir = parseInt(doc.onhand);
  loanper = parseInt(doc.loanpermited);
  intera = parseInt(doc.interest);
  dwe = parseInt(doc.debt);
  verse = parseInt(doc.versement);
  sellercell = doc._id;
  control = doc.controller;
  show = doc.showme;
  Session.set("loanper", loanper);
   Session.set("interate", intera);
   Session.set("avoir", avoir);
   Session.set("control", control);
   Session.set("selcell", sellercell);
   Session.set("dette", dwe);
   Session.set("verse", verse);
   Session.set("geo", show);	
});
   Supers.find({_id: Session.get("control")}, { fields: { "loanaccu":1, "loancollected":1, "regtransfees":1, "interestaccu":1, "fraisfix":1, "fraisaccu":1, "taxaccu":1 }}).map(function(doc) {
  loancol = parseInt(doc.loancollected);
  fraisx = parseInt(doc.fraisfix);
  fraisac = parseInt(doc.fraisaccu);
  taxac = parseInt(doc.taxaccu);
  interac = parseInt(doc.interestaccu);
  loanac = parseInt(doc.loanaccu);
  regtrans = parseInt(doc.regtransfees);
    Session.set("supreme", loancol);
    Session.set("ffx", fraisx);
    Session.set("fraisac", fraisac);
    Session.set("taxac", taxac);
    Session.set("interac", interac);
    Session.set("loanac", loanac);
    Session.set("fees", regtrans);
});
   var debtdate = Session.get("dettedue");
   var det = Session.get("dette");
   var dateC = moment(new Date());
   var dateD = moment(debtdate);
   var cash = Session.get("avoir");
   var cell = Session.get("cellu");
   var control = Session.get("control");
   var supreme = Session.get("supreme");
 
         } 
}
});
};

Template.banktrans.events({
"click #prete": function(e, t) {
		e.preventDefault();
         Session.set("viewon", false);
      var loan = Session.get("loanper");
      var inte = Session.get("interate");
      var fees = Session.get("ffx");
      var det = Session.get('dette');

  if ( loan == 0 ) {
                  if(Session.get("langage") == "fr") {			
                      pass = "Pas de credit disponible pour le moment,\nrendez-nous visite pour y remedier.";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "No credit available for you now,\nbut pay us a visit\ntogether we will sure find a solution.";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Pa gin credit etabli pou wou,\n min pase we nou ,\nansamb na jwenn yon solisyon";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "No hay un credito para Usted por ahora,\n pero visitenos,juntos encontraremos una solucion";
                     }
            alert(pass);

     Session.set("viewon", true);
      return;
                  }
     if (det > 0) {
                  if(Session.get("langage") == "fr") {			
                      pass = "Vous avez deja une dette non payee completement";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "You already have a debt,not paid in full yet.";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Ou deja gin yon ti det ki poko finn paye";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Ya tienes una deuda que no se pago completo";
                     }
            alert(pass); 
         Session.set("viewon", true);
        return;
                  } 
   if ( det == 0 && loan > 0 ) {
     var frais = Math.round((loan*inte)/100);
      Session.set("interet", frais);
      
      Session.set("balance", (loan-(frais+fees)));
    
             Session.set("procpretbank", true);
                            }
                                
},
	"click #paydet": function(e, t) {
		e.preventDefault();
        var det = Session.get("dette");      
    if ( det == 0 ) {
                  if(Session.get("langage") == "fr") {			
                      pass = "Vous n'avez pas de dette";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "You have no debt";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Ou pa gin det zanmi";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "No tienes deuda.";
                     }
            alert(pass); 
 
      return;
              } else {
         Session.set("viewon", false);
         Session.set("procpaydet", true);
             }
},
	"click #transfer": function(e, t) {
		e.preventDefault();
         Session.set("viewon", false);
         Session.set("transfer", true);
},
	"click #depot": function(e, t) {
		e.preventDefault();
         Session.set("viewon", false);
         Session.set("depot", true);
},
	"click #bank": function(e, t) {
		e.preventDefault();
         Session.set("viewon", false);
         Router.go('showmap', {});
},
	"click #sevis": function(e, t) {
		e.preventDefault();
 setTimeout(function() {
  //code for initializing the google map
}, 1000);
 navigator.geolocation.getCurrentPosition(function(position) {
  latLng =[position.coords.latitude, position.coords.longitude];
  var lat = position.coords.latitude;
 var long = position.coords.longitude;
         if (Session.get("geo") == "off") {
  Customers.update({ _id: Session.get("cellu")}, { $set: { showme: "on", location: { type: 'Point', coordinates: [ latLng[0], latLng[1] ] }}});
                 if(Session.get("langage") == "fr") {			
                      pass = "Vos coordonnes geographiques sont visibles,comme etant une banque";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "You Geolocation is set now on a map as a bank";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "ou sou kat la kom mounn kap bay sevis bank";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Su location es visible ahora\ncomo quien da servicio de banco";
                     }
            alert(pass); 
         Session.set("geo", "on");
      } else {
  Customers.update({ _id: Session.get("cellu")}, { $set: { showme: "off"}});
                 if(Session.get("langage") == "fr") {			
                      pass = "Vos coordonnes geographiques ne sont plus visibles,comme etant une banque";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "You Geolocation is now off, as someone giving bank services";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "ou pa sou kat la anko kom mounn kap bay sevis bank";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Ya no esta visible como banco";
                     }
            alert(pass); 
         Session.set("geo", "off");
    }
});              
},
	"click #retrait": function(e, t) {
		e.preventDefault();
         Session.set("viewon", false);
         Session.set("retrait", true);
},
	"click #offmap": function(e, t) {
		e.preventDefault();
         Session.set("viewon", true);
         Session.set("viewmap", false);
},
	"click #onmap": function(e, t) {
		e.preventDefault();
         Session.set("viewon", false);
         Session.set("viewmap", true);
}
			
});


Template.pretbank.rendered = function() {

};
Template.pretbank.events({

	"click #form-nonmesi": function(e, t) {
		e.preventDefault();
         Session.set("viewon", true);
         Session.set("procpretbank", false);
},

"click #form-dako": function(e, t) {
		e.preventDefault();
  navigator.geolocation.getCurrentPosition(function(position) {
  latLng =[position.coords.latitude, position.coords.longitude];
  var lat = position.coords.latitude;
 var long = position.coords.longitude;
 if (latLng[0]) {
 Customers.update({ _id: Session.get("cellu")}, { $set: { showme: "yes", location: { type: 'Point', coordinates: [ latLng[0], latLng[1] ] }}});
         var debtdate = moment().add(moment.duration(30, 'days')).valueOf();
         var bal = Session.get("balance");
         var cash = Session.get("avoir");
         var taxi = (Session.get("ffx") / 3);
         var myfees = ((Session.get("ffx") / 3) + 2);
          var moac = moment(new Date().getMonth()).valueOf();
   console.log('debtdate', debtdate);
   Customers.update({_id: Session.get("cellu")}, { $set: { debt: bal, onhand: (bal + cash), debtduedate: debtdate}});
    Supers.update({_id: Session.get("control")}, { $set: { fraisaccu: (Session.get("fraisac") + myfees), taxaccu: (Session.get("taxac") + taxi), interestaccu: (Session.get("interac") + Session.get("interet")), loanaccu: (Session.get("loanac") + bal)}});
 Transak.insert({mycell: Session.get("cellu"), createdAt: moment(new Date()).format("DD.MM. h:mm"), transdate: moment().valueOf(), transyear: moment().year(), mois: (moac+1), val: bal, tipe: "loan", i18n: { fr: { tipe: "pret" }, cr: {tipe: "kob prete" }, sp: { tipe: "prestamo" } }});
                  if(Session.get("langage") == "fr") {			
                      pass = "Le pret est deja disponible sur votre compte\nPayer a temps pour ne pas\naffecter votre credit";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "The loan is available on your account\nTo not affect your\ncredit ,pay on time";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "lajan an deja depoze sou kont ou\npaye a tan pou krediw ka toujou bon";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "se deposito el valor en tu cuenta,\npage a tiempo para que tu credito\nsea siempre en un alto nivel.";
                     }
            alert(pass); 
                        
         Session.set("viewon", true);
         Session.set("procpretbank", false);
          } else {
                  if(Session.get("langage") == "fr") {			
                      pass = "Attention !Transfert non realise";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Warning ! transfer unsuccessfull";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Atansyon! transfer apa fet";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Cuidado esta tranferencia no se logro! ";
                     }
            alert(pass); 

         Session.set("viewon", true);
         Session.set("procpretbank", false);
}
});	
}
});
Template.pretbank.helpers({

procpretbank: function () {
 return Session.get("procpretbank");
},
loanper: function () {
return Session.get("loanper");
},
interest: function  () {
return Session.get("interet");
},
service: function () {
return Session.get("ffx");
},
balance: function () {
return Session.get("balance");
}			
});

Template.paydet.events({
'click #form-noversement': function () {
   Session.set("procpaydet", false);
   Session.set("viewon", true);

},

'click #form-versement': function (e, t) {
		e.preventDefault();
                    var cell = "";
                     var paie = 0;
		var submit_button = $(t.find(":submit"));
		var paie = parseInt(t.find('#detver').value);
   var det = Session.get("dette");
   var cash = Session.get("avoir");
   var micelu = Session.get("cellu");
   var verse = Session.get("verse");
   var supreme = Session.get("supreme");
   var control = Session.get("control");
 var moac = moment(new Date().getMonth()).valueOf();
  if (paie == 0) {
                  if(Session.get("langage") == "fr") {			
                      pass = "Omission du montant du versemnt";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Insert the amount please";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "ou pa rantre kantite kob la";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Digite el monto por favor";
                     }
            alert(pass); 

     return;
                  }
  if (paie > det) {
                  if(Session.get("langage") == "fr") {			
                      pass = "Votre dette est moindre";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "You dont owe that much money";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "ou pa dwe tout kob saa zanmi";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "no debes tanto dinero!";
                     }
            alert(pass); 

     return;
                  }
  if ( paie <= det && paie > cash) {
                  if(Session.get("langage") == "fr") {			
                      pass = "Pas assez d'argent sur votre compte pour cette transaction";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Not enough money on your account for this transaction";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Ou pa gin kont kob pou transaksyon sa a";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Hace falta dinero para esta transaccion";
                     }
            alert(pass); 

     return;
         }
  if (paie < det && paie == cash) {
          Customers.update({ _id: micelu}, { $set: { onhand: 0, versement: (verse+paie), debt: (det-paie)}});
      Supers.update({_id: control}, { $set: { loancollected: (supreme + paie) }});
      Transak.insert({mycell: micelu , createdAt: moment(new Date()).format('DD.MM. h:mm'), transdate: moment().valueOf(), transyear: moment().year(), mois: (moac+1), val: paie, tipe: "payment", i18n: { fr: { tipe: "paiement" }, cr: {tipe: "vesman" }, sp: { tipe: "pago" } }});
                  if(Session.get("langage") == "fr") {			
                      pass = "Succes avec votre versement!";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Payment succesfully uploaded! ";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Vesmanw nan fet sans pwoblem";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Su pago ha sido un exito.";
                     }
            alert(pass); 
    }
  if ( paie < cash) {
     if (paie == det) {
       Customers.update({ _id: micelu}, { $set: { onhand: (cash - paie), versement: 0, debt: 0}});
      Supers.update({_id: control}, { $set: { loancollected: (supreme + paie) }});
      Transak.insert({mycell: micelu , createdAt: moment(new Date()).format('DD.MM. h:mm'), transdate: moment().valueOf(), transyear: moment().year(), mois: (moac+1), val: paie, tipe: "payment", i18n: { fr: { tipe: "paiement" }, cr: {tipe: "vesman" }, sp: { tipe: "pago" } }});
                  if(Session.get("langage") == "fr") {			
                      pass = "Compliments! Plus de dette";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Congrats! Debt paid in full";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Konpliman , ou fini ak det la";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Felicidades ,terminaste con la deuda";
                     }
            alert(pass); 
        }
  if (paie < det ) {
       Customers.update({ _id: micelu}, { $set: { onhand: (cash - paie), versement: (verse+paie), debt: (det-paie)}});
      Supers.update({_id: control}, { $set: { loancollected: (supreme + paie) }});
      Transak.insert({mycell: micelu , createdAt: moment(new Date()).format('DD.MM. h:mm'), transdate: moment().valueOf(), transyear: moment().year(), mois: (moac+1), val: paie, tipe: "payment", i18n: { fr: { tipe: "paiement" }, cr: {tipe: "vesman" }, sp: { tipe: "pago" } }});
                  if(Session.get("langage") == "fr") {			
                      pass = "Votre versement a ete un succes";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "your payment has been successfull";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "vesmanw nan fet sans pwoblem";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Tu pago ha sido un exito";
                     }
            alert(pass); 

        }
    }
    if (paie == det && paie == cash) {//
      Customers.update({ _id: micelu}, { $set: { onhand: 0, versement: 0, debt: 0}});

      Supers.update({_id: control}, { $set: { loancollected: (supreme + cash) }});

      Transak.insert({mycell: micelu , createdAt: moment(new Date()).format('DD.MM. h:mm'), transdate: moment().valueOf(), transyear: moment().year(), mois: (moac+1), val: paie, tipe: "payment", i18n: { fr: { tipe: "versement" }, cr: {tipe: "vesman" }, sp: { tipe: "pago" } }});
                  if(Session.get("langage") == "fr") {			
                      pass = "Votre versement a ete un succes";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "your payment has been successfull";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "vesmanw nan fet sans pwoblem";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Tu pago ha sido un exito";
                     }
            alert(pass); 

                  }//
   
   Session.set("procpaydet", false);
   Session.set("viewon", true);	
}

});

Template.paydet.helpers({
procpaydet:function () {
return Session.get("procpaydet");
},
detactual: function() {
return Session.get("dette");
}		
});

Template.depot.events({
 "click #form-kitesa": function (e, t) {
		e.preventDefault();
      Session.set("viewon", true);
      Session.set("depot", false);
},
	"click #form-depot": function(e, t) {
		e.preventDefault();
                    var cell = "";
                     var vend = 0;
		var submit_button = $(t.find(":submit"));
        	var cell = t.find('#cellnum').value;
		var pri = parseInt(t.find('#lajandepot').value);
              
        if (! Customers.find({ _id: cell}, { $exists: true}) ) { 
                  if(Session.get("langage") == "fr") {			
                      pass = "Le" + cell + "n'existe pas dans le systeme";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "The" + cell + "is not in the system";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = cell +' '+ "pa existe nan system nan";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = cell +' '+ "no existe en el systema";
                     }
            alert(pass);    
  return;
    } else {
 var vend =  Customers.findOne({_id: (cell)}).onhand;

  if (vend > pri) {
                  if(Session.get("langage") == "fr") {			
                      pass = "Aucun probleme pour ce montant de " + pri + "3 Gdes de frais seront deduits";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "No problem for this amount off" + pri + "fees of 3 Gdes will be applied";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = pri +' '+ "pa gin pwoblem pou deposel mwap gin 3 gdes frais";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = pri +' '+ "no hay problema para hacer este deposito\nte cobran para este servicio";
                     }
            alert(pass);    

     } else {
                  if(Session.get("langage") == "fr") {			
                      pass = "Chercher une autre banque";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "We suggest you look for another Bank";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Zanmi ,chache yon lot bank";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Es Mejor de buscar a otro banco\npara este valor";
                     }
            alert(pass);    
       return;
           }
       }
         Session.set("viewon", true);
         Session.set("depot", false);
}	
});

Template.depot.helpers({
depot: function () {
return Session.get("depot");
}			
});
Template.transfer.events({
	"click #form-cancel-retrait": function(e, t) {
		e.preventDefault();
           Session.set("viewon", true);
           Session.set("transfer", false);
},
	"click #form-retrait": function(e, t) {
		e.preventDefault();
                    var cell = "";
                     var vend = 0;
		var submit_button = $(t.find(":submit"));
        	var cell = t.find('#cellnum').value;
		var pri = parseInt(t.find('#lajan').value);
              
       var mycell = Session.get("cellu");
      var dispo = (Session.get("avoir") - Session.get("dette"));
      var moac = moment(new Date().getMonth()).valueOf();
      var supreme = Session.get("fraisac");
      var fees = Session.get("fees");

 if ( cell == mycell ) {
                  if(Session.get("langage") == "fr") {			
                      pass = "Transaction pour soi ,impossible";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Cant do it for yourself sorry";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "ou pa fe retrait pou prop tet ou";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Tu no puedes retirar dinero para ti mismo";
                     }
            alert(pass);    

   return;
   } else {
 if (pri > dispo) {
                  if(Session.get("langage") == "fr") {			
                      pass = "Pas assez d'argent pour cette transaction";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Not enough money for this transaction";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "pa gin kont kob pou transaksyon sa a";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Hace falta dinero para esta transaccion";
                     }
            alert(pass);    

    return;
   }  else {
 if ( ! Customers.findOne({ _id: cell}) ) { 
                  if(Session.get("langage") == "fr") {			
                      pass = "Le" + cell + "n'existe pas dans le systeme";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "The" + cell + "is not in the system";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = cell +' '+ "pa existe nan system nan";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = cell +' '+ "no existe en el systema";
                     }
            alert(pass);  
 
  return;
    } else {
 var vend =  Customers.findOne({_id: cell}).onhand;
   var balplus = (parseInt(vend) + pri);
  Customers.update({_id: cell}, { $set: { onhand: (balplus-fees)}});

 Transak.insert({mycell: cell, createdAt: moment(new Date()).format('DD.MM. h:mm'), transdate: moment().valueOf(), transyear: moment().year(), mois: (moac+1), val: pri, tipe: "depot", clicell: mycell, i18n: { fr: { tipe: "depot" }, cr: {tipe: "depo" }, sp: { tipe: "deposito" } }});

// insert transaction for buyer
  var balminus = (Session.get("avoir") - pri);

 Customers.update({_id: mycell}, { $set: { onhand: (balminus-fees)}});
 Transak.insert({mycell: mycell, createdAt: moment(new Date()).format('DD.MM. h:mm'), transdate: moment().valueOf(), transyear: moment().year(), mois: (moac+1), val: pri, tipe: "transfer", clicell: cell, i18n: { fr: { tipe: "transfert" }, cr: {tipe: "transfe" }, sp: { tipe: "transferencia" } }});

 Supers.update({_id: Session.get("control")}, { $set: { fraisaccu: (supreme+fees)}});
                  if(Session.get("langage") == "fr") {			
                      pass = "Transfert succes";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Transfer succeed";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Transfer reussi";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Esta transferencia se logro con exito";
                     }
            alert(pass);   
 
         Session.set("viewon", true);
         Session.set("transfer", false);
}
}
}
}	
});

Template.transfer.helpers({
 transfer: function () {
return Session.get("transfer");
}			
});

}
