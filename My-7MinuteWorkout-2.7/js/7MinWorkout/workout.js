
(function () {

    "use strict";

    angular
        .module("7minWorkout") // Get existing module
        .controller("WorkoutController", ['$scope','$interval', WorkoutController]);

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
        this.exercises = [];
        this.name = args.name;
        this.title = args.title;
        this.restBetweenExercise = args.restBetweenExercise;
    }


    function WorkoutController($scope, $interval) {

        var restExercise;
        var workoutPlan;


        var startWorkout = function () {
            workoutPlan = createWorkout();
            restExercise = {
                details: new Exercise({
                    name: "rest",
                    title: "Relax!",
                    description: "Relax a bit",
                    image: "img/rest.png"
                }),
                duration: workoutPlan.restBetweenExercise
            };

            startExercise(workoutPlan.exercises.shift());

            console.log("abc");
        };

        var createWorkout = function () {
            var workout = new WorkoutPlan({
                name: "7minWorkout",
                title: "7 minute Workout",
                restBetweenExercise: 10
            });

            workout.exercises.push({
                details: new Exercise({
                    name: "jumpingJacks",
                    title: "Jumping Jacks",
                    description: "Jumping Jacks.",
                    image: "img/JumpingJacks.png",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });

            workout.exercises.push({
                details: new Exercise({
                    name: "wallSit",
                    title: "Wall Sit",
                    description: "A wall sit, also known as a Roman Chair, is an exercise done to strengthen the quadriceps muscles.",
                    image: "img/wallsit.png",
                    videos: ["//www.youtube.com/embed/y-wV4Venusw", "//www.youtube.com/embed/MMV3v4ap4ro"],
                    procedure: "Place your back against a wall with your feet shoulder width apart and a little ways out from the wall.\
                              Then, keeping your back against the wall, lower your hips until your knees form right angles. "
                }),
                duration: 30
            });

            return workout;
        };

        var startExercise = function (exercisePlan) {
            $scope.currentExercise = exercisePlan;
            $scope.currentExerciseDuration = 0;
            $interval(function () {
                ++$scope.currentExerciseDuration;
            }
            , 1000
            , $scope.currentExercise.duration);
        };


        var init = function () {
            startWorkout();
        };

        init();
    }

})();