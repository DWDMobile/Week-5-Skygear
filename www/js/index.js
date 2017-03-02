var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        // when debugging, make sure this prints to the console to ensure you don't have any js errors
        console.log("javascript works");
    },
    

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        // config your skygear app
        skygear.config({
            'endPoint': 'https://dwdmobile.skygeario.com/', // trailing slash is required
            'apiKey': 'aadebb5d012347deaf08c0667e8491bc',
        }).then(function() {
            console.log('skygear container is now ready for making API calls.');
        }, function(error) {
            console.log(error);
        });


        // click listeners
        $('.sign-up-button').click(function(e) {
            e.preventDefault();
            app.signUpUser();

        });

        $('.sign-in-button').click(function(e) {
            e.preventDefault();
            app.signInUser();
        });

        $('.take-photo').click(function() {
            app.takePhoto();
        });

    },

    signUpUser: function() {
        var email = $('.sign-up .email').val();
        var password = $('.sign-up .password').val();

        skygear.signupWithEmail(email, password).then(function(user) {
          console.log(user); // user object
          app.changePage('#page2');
        }, function (error) {
          console.log(error);
          $('.errors').html(error.error.message);
        });
    },

    signInUser: function() {
        var email = $('.sign-in .email').val();
        var password = $('.sign-in .password').val();

        skygear.loginWithEmail(email, password).then(function (user) {
            app.changePage('#page2');
            $('.hello .email').html('Hi ' + user.email );
            app.currentUser = user;
            app.findEntries();
            console.log(user); // user object
        }, function (error) {
          console.log(error); 
          $('.errors').html(error.error.message);   
        });
    },

    findEntries: function() {
        var Note = skygear.Record.extend('entry');
        var query = new skygear.Query(Note);
        query.equalTo('_owner_id', app.currentUser.id);
        query.limit = 10;

        skygear.publicDB.query(query).then(function(records) {
            for(var i = 0; i < records.length; i++) {
                $('.entries').append('<img src="' + records[i].attachment.url + '" />');
            }            
        }, function (error) {
          console.error(error);
        })

    },

    changePage: function(id) {
        console.log("change page");
        $('.page').each(function() {
            $(this).hide();
        });
        $(id).fadeIn();
    },

    takePhoto: function() {
        navigator.camera.getPicture(this.onPhotoSuccess, this.onPhotoFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    },

    onPhotoSuccess: function(imageData) {
        app.createNewEntry(imageData);
    },

    createNewEntry: function(imageData) {
        var Entry = skygear.Record.extend('entry');

        var picture = new skygear.Asset({
            name: 'image',
            base64: imageData,
            contentType: 'image/jpeg',
        });

        var entry = new Entry({ attachment: picture });
        skygear.publicDB.save(entry) // automatically upload the picture
        .then(function (record) {
          console.log(record.attachment.url); // where you can load the image
          // if configured properly, the url should look like the following
          // <ASSET_STORE_URL_PREFIX>/<asset-id>-<your-asset-name>
        }, function (error) {
          console.log(error.error.message);
        });
    },

    onPhotoFail: function(e) {
        console.log(e);
    }
    
}