
(function () {

    "use strict";

    angular
        .module("7minWorkout") // Get existing module
        .controller("WorkoutController", ['$scope', '$interval', '$location', 'workoutHistoryTracker', WorkoutController]);
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

    function WorkoutController($scope, $interval, $location, workoutHistoryTracker) {

        var vm = this;
        var restExercise;
        // var workoutPlan;

        var exerciseIntervalPromise;

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

            // Not need now
            //$interval(function () {
            //    $scope.workoutTimeRemaining = $scope.workoutTimeRemaining - 1;
            //}, 1000, $scope.workoutTimeRemaining);

            workoutHistoryTracker.startTracking();
            $scope.currentExerciseIndex = -1;
            startExercise($scope.workoutPlan.exercises.shift());
        };

        // Create workout
        var createWorkout = function () {
            var workout = new WorkoutPlan({
                name: "7minWorkout",
                title: "7 minute Workout",
                restBetweenExercise: 5
            });

            workout.exercises.push({
                details: new Exercise({
                    name: "jumpingJacks",
                    title: "Jumping Jacks",
                    description: "Jumping Jacks.",
                    image: "img/JumpingJacks.png",
                    nameSound: "content/jumpingjacks.wav",
                    variations: [],
                    videos: ["//www.youtube.com/embed/y-wV4Venusw", "//www.youtube.com/embed/MMV3v4ap4ro"],
                    procedure: "The first up"
                }),
                duration: 6
            });

            workout.exercises.push({
                details: new Exercise({
                    name: "wallSit",
                    title: "Wall Sit",
                    description: "A wall sit, also known as a Roman Chair, is an exercise done to strengthen the quadriceps muscles.",
                    image: "img/wallsit.png",
                    nameSound: "content/wallsit.wav",
                    videos: ["//www.youtube.com/embed/y-wV4Venusw", "//www.youtube.com/embed/MMV3v4ap4ro"],
                    procedure: "Place your back against a wall with your feet shoulder width apart and <br /> a little ways out from the wall.\
                              Then, keeping your back against the wall, lower your hips until your knees form right angles. "
                }),
                duration: 6
            });

            workout.exercises.push({
                details: new Exercise({
                    name: "plank",
                    title: "Plank",
                    description: "A wall sit, also known as a Roman Chair, is an exercise done to strengthen the quadriceps muscles.",
                    image: "img/Plank.png",
                    nameSound: "content/plank.wav",
                    videos: ["//www.youtube.com/embed/y-wV4Venusw", "//www.youtube.com/embed/MMV3v4ap4ro"],
                    procedure: "Place your back against a wall with your feet shoulder width apart and <br /> a little ways out from the wall.\
                              Then, keeping your back against the wall, lower your hips until your knees form right angles. "
                }),
                duration: 6
            });

            workout.exercises.push({
                details: new Exercise({
                    name: "lunge",
                    title: "Lunge",
                    description: "A wall sit, also known as a Roman Chair, is an exercise done to strengthen the quadriceps muscles.",
                    image: "img/lunges.png",
                    nameSound: "content/lunge.wav",
                    videos: ["//www.youtube.com/embed/y-wV4Venusw", "//www.youtube.com/embed/MMV3v4ap4ro"],
                    procedure: "Place your back against a wall with your feet shoulder width apart and <br /> a little ways out from the wall.\
                              Then, keeping your back against the wall, lower your hips until your knees form right angles. "
                }),
                duration: 6
            });

            return workout;
        };

        // Start exercise
        var startExercise = function (exercisePlan) {
            $scope.currentExercise = exercisePlan;
            //$scope.nextExerciseTitle = workoutPlan.exercises.length > 0 ? workoutPlan.exercises[0].details.title : "Completed";
            $scope.currentExerciseDuration = 0;

            if (exercisePlan.details.name != 'rest') {
                $scope.currentExerciseIndex++;
            }

            //$interval(function () {
            //    ++$scope.currentExerciseDuration;
            //}
            //, 1000
            //, $scope.currentExercise.duration)
            //.then(function () {
            //    var nextExercise = getNextExercise($scope.currentExercise);
            //    if (nextExercise) {
            //        startExercise(nextExercise);
            //    } else {
            //        $location.path('/finish');
            //    }
            //});

            exerciseIntervalPromise = startExerciseTimeTracking();
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

        var startExerciseTimeTracking = function () {
            var promise = $interval(function () {
                ++$scope.currentExerciseDuration;
                --$scope.workoutTimeRemaining;
            }, 1000, $scope.currentExercise.duration - $scope.currentExerciseDuration);

            promise.then(function () {
                var next = getNextExercise($scope.currentExercise);
                if (next) {
                    startExercise(next);
                } else {
                    workoutComplete();
                    
                }
            });

            return promise;
        };

        var workoutComplete = function () {
            workoutHistoryTracker.endTracking(true);
            $location.path('/finish');
        }

        $scope.pauseWorkout = function () {
            $interval.cancel(exerciseIntervalPromise);
            $scope.workoutPaused = true;
           
        };

        $scope.resumeWorkout = function () {
            exerciseIntervalPromise = startExerciseTimeTracking();
            $scope.workoutPaused = false;
        }

        $scope.$watch('workoutPaused', function (newValue, oldValue) {
            if (newValue) {
                $scope.ticksAudio.pause();
            }
        });

        $scope.pauseResumeToggle = function () {
            if ($scope.workoutPaused) {
                $scope.resumeWorkout();
            } else {
                $scope.pauseWorkout();
            }
        }


        $scope.onKeyPressed = function (event) {
            if (event.which == 80 || event.which == 112) {
                $scope.pauseResumeToggle();
            }
        };

        var init = function () {
            startWorkout();
        };

        init();
    }


    // WorkoutAudioController
    angular.module('7minWorkout')
        .controller('WorkoutAudioController', ['$scope', '$timeout', WorkoutAudioController]);
    function WorkoutAudioController($scope, $timeout) {
        $scope.exercisesAudio = [];

        var workoutPlanwatch = $scope.$watch('workoutPlan', function (newValue, oldValue) {
            if (newValue) { // newValue = workoutPlan
                angular.forEach($scope.workoutPlan.exercises, function (exercise) {
                    $scope.exercisesAudio.push({
                        src: exercise.details.nameSound,
                        type: "audio/wav"
                    });
                    console.log(exercise.details.nameSound);
                });
                //console.log("exercise Audio: " + $scope.exercisesAudio[0].src);
                //console.log("exercise Audio: " + $scope.exercisesAudio[1].src);
                workoutPlanwatch(); //unbind the watch.       
                //console.log("exercise Audio: " + $scope.exercisesAudio[0].src);
                //console.log("exercise Audio: " + $scope.exercisesAudio[1].src);
            }
        });

        $scope.$watch('currentExercise', function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                console.log("currentExerciseIndex: " + $scope.currentExerciseIndex);
                if ($scope.currentExercise.details.name == 'rest') {
                    $timeout(function () { $scope.nextUpAudio.play(); }, 1000);
                    $timeout(function () {
                        $scope.nextUpExerciseAudio.play($scope.currentExerciseIndex, true);
                    }, 2000);
                }
            }

        });

        //$scope.$watch('currentExerciseDuration', function (newValue, oldValue) {
        //    if (newValue) {
        //        if (newValue == Math.floor($scope.currentExercise.duration / 2)
        //        && $scope.currentExercise.details.name !== 'rest') {
        //            $scope.halfWayAudio.play();
        //        }
        //        else if (newValue == $scope.currentExercise.duration - 3) {
        //            $scope.aboutToCompleteAudio.play();
        //        }
        //    }
        //});

        var init = function () {

        }

        init();
    }
})();