Startups = new Mongo.Collection("startups");



if (Meteor.isClient) {
    Meteor.subscribe("startups");
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Template.list.helpers({
        startups: function() {
            return Startups.find({}, {
                sort: {
                    createdAt: -1
                }
            });
        }
    });

    Template.startup.helpers({
        isOwner: function() {
            if (Meteor.userId() === this.owner) {
                return true;
            } else {
                return false;
            }
        },
        hasInstagram: function() {
            if (Startups.findOne(this).instagram != "") {
                return true;
            }
        },
        hasFacebook: function() {
            if (Startups.findOne(this).facebook != "") {
                return true;
            }
        },
        hasTwitter: function() {
            if (Startups.findOne(this).twitter != "") {
                return true;
            }
        },
        hasEmail: function() {
            if (Startups.findOne(this).email != "") {
                return true;
            }
        }
    });


    //counter
    Template.counter.helpers({
        count: function() {
            return Startups.find().count();
        }
    });

    Template.startup.events({
        "click .delete": function() {
            Meteor.call("deleteStartup", this._id);
        }
    })

    Template.body.events({
        'submit': function() {


            var name = event.target.name.value;
            var website = event.target.website.value;
            var email = event.target.email.value;
            var twitter = event.target.twitter.value;
            var facebook = event.target.facebook.value;
            var instagram = event.target.instagram.value;
            var info = event.target.info.value;
            if (name === "" && website === "" && email === "" && twitter === "" && facebook === "" && instagram === "" && info === "") {
                alert("Add some info to submit!");
                console.log("Form not submitted");
                event.preventDefault();
                return false;

            } else {
                Meteor.call("addStartup", name, website, twitter, facebook, instagram, email, info);

                event.target.name.value = "";
                event.target.website.value = "";
                event.target.email.value = "";
                event.target.twitter.value = "";
                event.target.facebook.value = "";
                event.target.instagram.value = "";
                event.target.info.value = "";

                console.log("Form submitted");
                event.preventDefault();
                return false;

            }
        }
    });
}

Meteor.methods({
    addStartup: function(name, website, twitter, facebook, instagram, email, info) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorised");
        }
        Startups.insert({
            "name": name,
            "website": website,
            "twitter": twitter,
            "facebook": facebook,
            "instagram": instagram,
            "email": email,
            "info": info,
            "createdAt": new Date(), // current time
            "owner": Meteor.userId(), // _id of logged in user
            "username": Meteor.user().username // username of logged in user
        });
    },
    deleteStartup: function(startupId) {
        Startups.remove(startupId);
    }
});


if (Meteor.isServer) {
    Meteor.publish("startups", function() {
        return Startups.find();
    });
}
