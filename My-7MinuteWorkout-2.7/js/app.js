(function () {
    "use strict";

    // app module
    angular
        .module("app", ["ngRoute", "7minWorkout"])
        .config(function ($routeProvider, $sceDelegateProvider) {

            $sceDelegateProvider.resourceUrlWhitelist([
                    // Allow same origin resource loads.
                    'self',
                    'http://*.youtube.com/**',
                    'https://vid.me/**']);
                

            $routeProvider.when('/start', {
                templateUrl: 'partials/start.html'
            });

            $routeProvider.when('/workout', {
                templateUrl: 'partials/workout.html',
                controller: 'WorkoutController'
            });

            $routeProvider.when('/finish', {
                templateUrl: 'partials/finish.html'
            });

            $routeProvider.otherwise({
                redirectTo : '/start'
            });

});


// Creating a new module name is 7minWorkout
    angular
        .module("7minWorkout",
            []);

    
    
})();