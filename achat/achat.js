var pageSession = new ReactiveDict();
Session.set("allok", false);
Session.set("rapport", false);
Session.set("transac", false);
Session.set("messages", false);
Session.set("menu", false);
Session.set("code", "");


if (Meteor.isClient) {
Meteor.startup(function () { 
   Meteor.subscribe('customers_got'); //, 'onhand', 'debt', 'debtduedate', 'controller', '_id');
   Meteor.subscribe('supers_sup', 'loancollected'); 
   Meteor.subscribe('messages', 'mycell', 'clicell');
  Meteor.subscribe('transak');
});

Template.achatpage.created = function() {
 this.autorun(function() {
  var mesag = Messages.find( { mycell: Session.get("cellu") } ).count();
   if ( mesag >0 ) {
    Session.set("mesajwi", true);
   } else {
    Session.set("mesajwi", false);
    
        }
 var cellu = Meteor.users.findOne({_id: Meteor.userId()}).profile.cell;
    Session.set("cellu", cellu);
 var stat = Meteor.users.findOne({_id: Meteor.userId()}).profile.status;
   Session.set("statu", stat);
 var langage = Meteor.users.findOne({_id: Meteor.userId()}).profile.langage;
  TAPi18n.setLanguage(langage);
Session.set("langage", langage);

});
};

Template.achatpage.rendered = function() {
 var self = this;
  // Subscribe
  self.subscribe("customers_cell", 'onhand', 'controller');
  self.subscribe("super_sup", 'fraisaccu');
  self.subscribe('transak');
  self.subscribe("messages", 'mycell', 'clicell');
  // Do reactive stuff when subscribe is ready
  self.autorun(function() {


    if(! self.subscriptionsReady()) {
      return;
     } else {

    if (Session.get("statu") == "active") {
       Session.set("menu", true);
       Session.set("warning", false);
             } else {
             Session.set("menu", false);
             Session.set("warning", true);
            return;
      }

  
}
});
};

Template.achatpage.events({
'click #form-mescancel': function (e, t) {
          e.preventDefault();
   Meteor.call('removemsg');
  Session.set("messages", false);
   Session.set("menu", true);
       },
  'click #form-messend': function (e, t) {
          e.preventDefault();
                    var msg = "";
		var submit_button = $(t.find(":submit"));
        	var messaj = t.find('#mesmesg').value;
                var mesgercell = t.find('#msgercell').value;
         

if (mesgercell) {
 var cellyes = Customers.findOne({_id: mesgercell})._id;
  if (cellyes) {
 
 Session.set("mesgercell", mesgercell);
   mymsgcount = Messages.find({mycell: Session.get("cellu")}).count();
   partnercount = Messages.find({ mycell: mesgercell}).count(); 
   if (mymsgcount > 7 || partnercount > 7) {
          Meteor.call('removemsg');
       Messages.insert({mycell: mesgercell, msg: messaj, msgdate:moment(new Date()).format("h:mm:ss"), clicell: Session.get("cellu")});
           } else {
       Messages.insert({mycell: mesgercell, msg: messaj, msgdate:moment(new Date()).format("h:mm:ss"), clicell: Session.get("cellu")});
                   }
} else {
                  if(Session.get("langage") == "fr") {			
                      pass = "Client inexistant";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Cell phone not found";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Celule sa a pa existe";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "# de celular inexistante";
                     }
   alert(pass);
   return ; 
} 
 } else {
                  if(Session.get("langage") == "fr") {			
                      pass = "rentrer le portable du client";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "enter the client cellphone";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "rantre nimero celule a";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "por favor digite el celular";
                     }
   alert(pass);
   return;
}
},
 'click #messages': function (e, t) {
		e.preventDefault();
      Session.set("menu", false);
 //     Session.set("mesajwi", false);
       Session.set("messages", true);
},

 'click #transac': function (e, t) {
		e.preventDefault();

   Session.set("transac", true);
   Session.set("menu", false);

},
 'click #report':  function(e, t) {
		e.preventDefault();

     Session.set("rapport", true);
     Meteor.subscribe('transak');
     Session.set("menu", false);
 
},
	'click #paye': function(e, t) {
		e.preventDefault();
             Session.set("menu", false);
        
            if (!Session.get("statu") == "active") { 
                  if(Session.get("langage") == "fr") {			
                      pass = "Inconvenient majeur, passez nous voir dans le plus bref delai";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "Serious problem encounter, please visit us A.S.A.P";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "gin pwoblem, pase we nou rapid rapid";
                     }
            alert(pass);
             return;
             } else {

   Session.set("allok", true);
   Session.set("menu", false);
   Session.set("processpayment", true);

                    }
}
});
Template.achatpage.helpers({
msgcellnum: function () {
 return Session.get("copnum");
},
  messages: function () {
  return Session.get("messages");
},
 mymsg: function () {
   var mseg = Messages.find( {mycell: Session.get("cellu")}, { msgdate: moment(new Date()).format("DD.MM. h:mm"), limit:6, sort: {msgdate: -1}});
      return mseg;
},
//menu: function () {
//   return Session.get("menu");
//},

climsg: function () {
   var climes = Messages.find( {clicell: Session.get("mesgercell") }, { msgdate: moment(new Date()).format("DD.MM. h:mm")});
      return climes;
},
menu: function () {
return Session.get("menu");
},

mesajwi: function () {
    return Session.get("mesajwi");
},
 warning: function () {
  return Session.get("warning");
} 

});
Template.payment.events({
 'click #form-cancel': function (e, t) {
          e.preventDefault();
  Session.set("allok", false);
  Session.set("menu", true);
    return;
       },
 'click #form-payer': function (e, t) {
      //   e.preventDefault();
                     var cell = "";
                     var vend = 0;
                     var pri = 0; 
		var submit_button = $(t.find(":submit"));
        	var cell = t.find('#cellnum').value.toString();
		var pri = parseInt(t.find('#lajan').value);
Customers.find({ ownerId: Meteor.userId()}, { "onhand":1, "controller":1}).map(function(doc) {
  avoir = parseInt(doc.onhand);
  control = doc.controller;

   Session.set("cash", avoir);
   Session.set("control", control);
   Session.set("mycell", mycell);
	
});
   Supers.find({_id: Session.get("control")}, { fields: { "fraisaccu":1, "regtransfees":1 }}).map(function(doc) {
  supreme = parseInt(doc.fraisaccu); 
  regfees = parseInt(doc.regtransfees); 
    Session.set("supreme", supreme);
    Session.set("regfees", regfees);
});
    var cash = Session.get("cash");
   var mycell = Session.get("cellu");
   var control = Session.get("control");
   var supreme = Session.get("supreme");
   var stat = Session.get("statu");
   var reg = Session.get("regfees");
 
   if ( ! Customers.findOne({ _id: cell}) ) { 
                  if(Session.get("langage") == "fr") {			
                      pass = "donnees incompletes, transaction impossible";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "missing data, could not proceed";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "infomaszon pa komplet,tranzaksyon imposib";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "informacion incompleta, transaccion imposible";
                     }
   alert(pass);
 //  Session.set("processpayment", false);
 //  Session.set("menu", true);
  return;
  } else {
 if ( cell == mycell) {
                  if(Session.get("langage") == "fr") {			
                      pass = "impossible de vous vendre vous-meme";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "cannot sell to yourself";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "ou pa ka vann prop tet ou";
                     }
                 if(Session.get("langage") == "sp") {			
                      pass = "no puedes vender a ti mismo";
                     }
  alert(pass);
    Session.set("processpayment", false);
 //  Session.set("menu", true);
   return;
             } 
if (pri >= cash) {
                  if(Session.get("langage") == "fr") {			
                      pass = "cette transaction surpasse vos avoirs";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "not enough money in your account for this transaction";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "ou pa gin kont kob pou transaksyon sa a";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "no tienes suficiente dinero para esa transaccion";
                     }
       alert(pass);
   Session.set("processpayment", false);
//   Session.set("menu", true);
    return;
             }  
 if ( pri < cash) {
 var vend =  Customers.findOne({_id: cell}).onhand;

   var balplus = (parseInt(vend) + pri);

  var balminus = (cash - pri);
// deduct buyer 
  Customers.update({_id: cell}, { $set: { onhand: (balplus - reg)}});
 var moac = moment(new Date().getMonth()).valueOf();
 Transak.insert({mycell: cell, createdAt: moment(new Date()).format('DD.MM. h:mm'), mois: (moac+1), transdate: moment().valueOf(), transyear: moment().year(), val: pri, tipe: "sales", clicell: mycell, i18n: { fr: { tipe: "vente" }, cr: {
tipe: "vant" }, sp: { tipe: "venta" } }});
//increase seller
  var balminus = (cash - pri);
 Customers.update({_id: mycell}, { $set: { onhand: (balminus-reg)}});

 Transak.insert({mycell: mycell, createdAt: moment(new Date()).format('DD.MM. h:mm'), mois: (moac+1), transdate: moment().valueOf(), transyear: moment().year(), val: pri, tipe: "purchase", clicell: cell, i18n: { fr: { tipe: "achat" }, cr: {
tipe: "achat" }, sp: { tipe: "compra" } }});
//update bank transdate: moment(new Date()).format("DD.MM. h:mm")

 Supers.update({_id: control}, { $set: { fraisaccu: (supreme + (reg * 2))}});
                  if(Session.get("langage") == "fr") {			
                      pass = "Votre transaction a ete un succes";
                     }
                  if(Session.get("langage") == "en") {			
                      pass = "transaction registered successfully";
                     }
                  if(Session.get("langage") == "cr") {			
                      pass = "Transaksyonw nan fet san pwoblem";
                     }
                  if(Session.get("langage") == "sp") {			
                      pass = "Tu transaccion se logro sin problema";
                     }
    alert(pass);
     Session.set("allok", false);
  Session.set("menu", true);
}
}
}
});
Template.payment.helpers({
 processpayment: function() {
     return Session.get("allok");
   }

});
Template.rapport.helpers({
 rapport: function() {
     return Session.get("rapport");
   }

});
Template.celltrans.helpers({
  products: function (startDate) {
 var startDate = moment().startOf('day').valueOf();
   var endDate = moment().add(1,'days').toDate(); //toDate();   //add(1,'days').toDate();
    var prod = Transak.find( {mycell: Session.get("cellu"), transdate: { $gte: startDate }}); 
       return prod;
}


});
Template.celltrans.events({
 'click #form-retour': function (e, t) {
          e.preventDefault();
  Session.set("rapport", false);
  Session.set("menu", true);
    return;
       },
});
Template.transacsyon.events({
 'click #form-retounin': function (e, t) {
          e.preventDefault();
  Session.set("transac", false);
  Session.set("menu", true);
    return;
       }
});
Template.transacsyon.helpers({
 transac: function () {
  return Session.get("transac");
},
 zafem : function() {
   return Customers.findOne({_id: Session.get("cellu")}).onhand;
 },
 kredim :function () {
  var kred = Customers.findOne({_id: Session.get("cellu")}).loanpermited;
  var det = Customers.findOne({_id: Session.get("cellu")}).debt;
  if ( kred > 0 && det > 0 ) {
  var nokred = 0
  return nokred;
         }
  if ( kred > 0 && det == 0 ) {
    return kred;
  } 
 if ( kred = 0 && det == 0) {
  return "ou pa gin Kredi";
   }
},
 vesman : function() {
   var ves = Customers.findOne({_id: Session.get("cellu")}).versement;
   var det = Customers.findOne({_id: Session.get("cellu")}).debt;
  if ( ves > 0  && ! det == 0) {
  return ves;
  } else {
  return 0;
       }
  },
 detay : function() {
   var det = Customers.findOne({_id: Session.get("cellu")}).debt;
  if ( det > 0) {
  return det;
  } else {
  return 0;
       }
  },
 datdet: function () {
   var datdet = Customers.findOne({_id: Session.get("cellu")}).debtduedate;
   var det = Customers.findOne({_id: Session.get("cellu")}).debt;
  if ( det > 0 ) {
  return moment(datdet).format("DD.MM. h:mm");
   } else {
   return "/";
        }
},
 celulem: function () {
  return Session.get("cellu");
           
}
});

}
