
(function () {

    "use strict";

    angular
        .module("7minWorkout") // Get existing module
        .controller("WorkoutController", ['$scope', '$interval', '$location', WorkoutController]);

    function Exercise(args) {
        this.name = args.name;
        this.title = args.title;
        this.description = args.description;
        this.image = args.image;
        this.related = {};
        this.related.videos = args.videos;
        this.nameSound = args.nameSound;
        this.procedure = args.procedure;
    }

    function WorkoutPlan(args) {
        this.exercises = [];//{details:exercie,duration:30},{details:exercie,duration:30},
        this.name = args.name;
        this.title = args.title;
        this.restBetweenExercise = args.restBetweenExercise;
        this.totalWorkoutDuration = function () {
            if (this.exercises.length == 0) return 0;
            var total = 0;
            angular.forEach(this.exercises, function (exercise) {
                total = total + exercise.duration;
            });
            return this.restBetweenExercise * (this.exercises.length - 1)
            + total;
        }
    }


    function WorkoutController($scope, $interval, $location) {

        var vm = this;
        var restExercise;
       // var workoutPlan;

        // Start workout
        var startWorkout = function () {
            $scope.workoutPlan = createWorkout();
            restExercise = {
                details: new Exercise({
                    name: "rest",
                    title: "Relax!",
                    description: "Relax a bit",
                    image: "img/rest.png"
                }),
                duration: $scope.workoutPlan.restBetweenExercise
            };

            $scope.workoutTimeRemaining = $scope.workoutPlan.totalWorkoutDuration();

            $interval(function(){
                $scope.workoutTimeRemaining = $scope.workoutTimeRemaining -1;
            },1000, $scope.workoutTimeRemaining);

            startExercise($scope.workoutPlan.exercises.shift());


        };

        // Create workout
        var createWorkout = function () {
            var workout = new WorkoutPlan({
                name: "7minWorkout",
                title: "7 minute Workout",
                restBetweenExercise: 2
            });

            workout.exercises.push({
                details: new Exercise({
                    name: "jumpingJacks",
                    title: "Jumping Jacks",
                    description: "Jumping Jacks.",
                    image: "img/JumpingJacks.png",

                    variations: [],

                    videos: ["https://vid.me/SizeMatters", "//www.youtube.com/embed/y-wV4Venusw", "//www.youtube.com/embed/MMV3v4ap4ro"],

                    procedure: "The first up"
                }),
                duration: 5
            });

            workout.exercises.push({
                details: new Exercise({
                    name: "wallSit",
                    title: "Wall Sit",
                    description: "A wall sit, also known as a Roman Chair, is an exercise done to strengthen the quadriceps muscles.",
                    image: "img/wallsit.png",
                    videos: ["https://vid.me/SizeMatters","//www.youtube.com/embed/y-wV4Venusw", "//www.youtube.com/embed/MMV3v4ap4ro"],
                    procedure: "Place your back against a wall with your feet shoulder width apart and a little ways out from the wall.\
                              Then, keeping your back against the wall, lower your hips until your knees form right angles. "
                }),
                duration: 10
            });

            return workout;
        };

        // Start exercise
        var startExercise = function (exercisePlan) {       
            $scope.currentExercise = exercisePlan;
            //$scope.nextExerciseTitle = workoutPlan.exercises.length > 0 ? workoutPlan.exercises[0].details.title : "Completed";
            $scope.currentExerciseDuration = 0;
            $interval(function () {
                ++$scope.currentExerciseDuration;
            }
            , 1000
            , $scope.currentExercise.duration)
            .then(function () {
                var nextExercise = getNextExercise($scope.currentExercise);
                if (nextExercise) {
                    startExercise(nextExercise);
                } else {
                    $location.path('/finish')
                }
            });
        };

        // Get next exercise
        var getNextExercise = function (currentExercise) {
            var nextExercise = null;
            if (currentExercise === restExercise) {
                nextExercise = $scope.workoutPlan.exercises.shift();
            } else {
                if ($scope.workoutPlan.exercises.length > 0) {
                    nextExercise = restExercise;
                }
            }

            return nextExercise;
        };

        // Watch 'currentExerciseDuration'
        //$scope.$watch('currentExerciseDuration', function (nVal) {
        //    console.log(nVal);
        //    if (nVal == $scope.currentExercise.duration) {
        //        var nextExercise = getNextExercise($scope.currentExercise);
        //        if (nextExercise) {
        //            startExercise(nextExercise);
        //        } else {
        //            console.log("Workout complete");
        //        }
        //    }
        //});


        var init = function () {
            startWorkout();
        };

        init();
    }

})();