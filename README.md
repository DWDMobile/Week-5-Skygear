# Week 5 Example

Uses the backend service Skygear.io to create a database. This example signs up new users, signs in existing users, gives the user the ability to take a photo within the app and creates a new ‘Entry’ record in the database. Upon signing in, the user is also shown a list of the photos they’ve previously taken with the app.

If you are going to use skybase and are starting with my example, you MUST update the skygear config to reflect your app name and api key:

```skygear.config({
            'endPoint': 'https://{{ YOUR APP NAME }}.skygeario.com/', // trailing slash is required
            'apiKey': '{{ YOUR API KEY }}',`
        }).then(function() {
            console.log('skygear container is now ready for making API calls.');
        }, function(error) {
            console.log(error);
});```

I have posted my credentials in this example, however do not use it to create your app!
