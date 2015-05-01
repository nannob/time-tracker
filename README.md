Build a Time Tracker with AngularJS and Data McFly
--------------

Simple Time Tracker using the Angular McFly library


```
bower install angular angular-bootstrap angular-resource bootstrap moment datamcfly angularmcfly
```

Open `scripts/app.js` and edit:

```
.constant('DATAMCFLY_CONFIG',{API_KEY:'your key goes here', DB_NAME:'your app name goes here'})
```

To point to your Data McFly API Key and Your App name.

### Credits

This idea for this tuturial was based on the handy [tutorial](https://scotch.io/tutorials/build-a-time-tracker-with-laravel-5-and-angularjs-part-1) that was built over at Scotch.IO for using Angular.js and Laravel for time tracking. That tutorial is great, but I wanted to showcase how you could build a similar time tracker without needing to build in backend handling.