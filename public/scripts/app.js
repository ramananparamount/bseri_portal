(function () {
    var myapp = angular.module('bseriApp', ['ngAnimate','ui.router', 'ui.bootstrap', 'ngStorage']);
    myapp.config(function($stateProvider, $urlRouterProvider, $locationProvider){


    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/")

    $stateProvider
    .state('home', {
        url: "/",
        templateUrl: "partials/home.html",
        controller: function ($scope, $http, $filter, $uibModal) {

            $scope.IsAVideo = function(content) {
                return (content.media == 'video');
            };
            $http.get('/api/home').success(function (response){
                    console.log(response);
                    var data = response;
                    $scope.courses=data.courses;
                    $scope.contents = data.contents;
                    // $scope.user = data.user;
                    // $scope.testimonials = data.testimonials;
                    //console.log(details[0]);
                }).error(function(err,status){
                    console.log(err);
            });

            $scope.openReadMoreModal = function (course) {
                var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'readmoremodal.html',
                  controller: 'ModalInstanceCtrl',
                  resolve: {
                    modalObject: course
                  }
                });
            };

            $scope.openVideoModal = function (content) {
                var modalInstance = $uibModal.open({
                  animation: true,
                  // size:'lg',
                  windowClass: 'modal-fullscreen', 
                  templateUrl: 'videomodal.html',
                  controller: 'ModalInstanceCtrl',
                  resolve: {
                    modalObject: content
                  }
                });
            };


        }
    })
    .state('trainingdetails', {
        url: "/training/:courseid",
        templateUrl: "partials/singlecourses.html",
        controller: function($scope,$http,$stateParams,$state){
            $http.get('/api/training/' + $stateParams.courseid)
                .success(function (response){
                    console.log(response);
                    $scope.course=response;
                })
                .error(function(err,status){
                    console.log(err);
            });
        }
    })

    .state('about', {
        url: "/about",
        templateUrl: "partials/about.html"
    })
    .state('training', {
        url: "/training",
        templateUrl: "partials/training.html",
        controller: function($scope,$http,$state, $uibModal){
            $http.get('/api/training').success(function (response){
                    console.log(response);
                    var data = response;
                    $scope.courses=data.courses;
                }).error(function(err,status){
                    console.log(err);
            });
            $scope.openReadMoreModal = function (course) {
                var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'readmoremodal.html',
                  controller: 'ModalInstanceCtrl',
                  resolve: {
                    modalObject: course
                  }
                });
            };

        }
    })



    .state('managementsystems', {
        url: "/managementsystems/:catId",
        templateUrl: "partials/managementsys.html",
        controller: function($scope,$http,$filter,$stateParams,$sce,$state){
            $http.get("/data/systems.json").success(function (data){
                    var details = [];
                    details = ($filter('filter')(data,{"topic":$stateParams.catId}));
                    $scope.details=details[0];
                    //console.log(details[0]);
                }).error(function(err,status){
                    console.data(status);
            });
            //Rendering HTML from the json data and not simple json from json data
            $scope.$sce=$sce;
            $scope.HasQuiz = $stateParams.catId == "systems" ? false : true;
            $scope.quizlink = "quiz({'catId':'" + $stateParams.catId +"'})";

            var currQ=-1;
            var TotalQrys = 0;
            var queries = [];
            var CorrectAnswers = 0;
            var currAnswer = 0;
            $scope.ShowResult = false;
            $scope.ShowNext = true;
            $scope.ShowProfile = false;
            $http.get("/data/quiz.json").success(function (data){
                    queries = ($filter('filter')(data,{"topic":$stateParams.catId}));
                    //console.log(queries[0].questions[0]);
                    $scope.qry = queries[0].questions[++currQ];
                    TotalQrys = queries[0].questions.length;
                }).error(function(err,status){
                    console.data(status);
            });
            $scope.setShowResult = function (disabled){
                disabled = true;
            };
            $scope.getShowResult = function (answer){
                return (answer > 0);
            };
            $scope.updateAnswer = function (answer){
                console.log("Answer = " + answer);
                currAnswer = answer;
            }
            $scope.DisplayResult = function (){
                if(currAnswer === $scope.qry.answeropt){
                    CorrectAnswers++;
//                    console.log("Increment correct answer " + CorrectAnswers);
                }
                //Hide the show result button 
                $scope.ShowResult = false;
                switch(CorrectAnswers){
                    case 0:
                        $scope.DisplayResultMessage="Still you can review the content and try again!! ";
                        //Show the videorerun button
                        $scope.videoRerun = true;
                        $scope.ShowRegister = false;
                        break;
                    case 1:
                    case 2:
                        $scope.DisplayResultMessage="Your Result : " + CorrectAnswers + "/" + TotalQrys + "! Claim a 5% discount now or retake the test!";
                        $scope.videoRerun = true;
                        $scope.ShowRegister = true;
                        break;
                    case 3:
                        $scope.DisplayResultMessage="Your Result : " + (CorrectAnswers/TotalQrys * 100) + "%! Claim a 10% discount now or retake the test!";
                        $scope.videoRerun = true;
                        $scope.ShowRegister = true;
                        break;
                    case 4:
                    case 5:
                        $scope.DisplayResultMessage="Congrats! Your mark : " + (CorrectAnswers/TotalQrys * 100) + "% ! Claim a 20% discount!";
                        $scope.videoRerun = false;
                        $scope.ShowRegister = true;
                        break;

                }
            }

            $scope.DisplayNextQ = function(){
                if(currAnswer === $scope.qry.answeropt){
                    CorrectAnswers++;
//                    console.log("Increment correct answer " + CorrectAnswers);
                }
                $scope.qry=queries[0].questions[++currQ];
                $scope.qry.submitAns=-1;
                currAnswer = 0 ;
                if(currQ === (TotalQrys - 1)) {
                    $scope.ShowNext = false;
                    $scope.ShowResult = true;
                }
            };

            function QuizReset (){
                var overlay = document.getElementById("overlay");
                overlay.style.visibility='hidden';
                currQ=-1;
                $scope.ShowResult = false;
                $scope.ShowNext = true;
                $scope.videoRerun = false;
                $scope.ShowRegister = false;
                $scope.DisplayResultMessage = "";
                $scope.qry=queries[0].questions[++currQ];
                $scope.qry.submitAns = -1;
            }

            $scope.RetakeExam = function (){
                QuizReset();
                var video = document.getElementById("IDvideo");
                video.play();
                video.controls=true;
            }

            $scope.RegisterUser = function (e){
                $scope.videoRerun = false;
                if(!$scope.ShowProfile){
                    $scope.ShowProfile = true;
                }
                else{
                    $state.go("training");
                }
            }
        }
    })
    .state('gallery', {
        url: "/gallery",
        templateUrl: "partials/gallery.html"
    })
    .state('quiz', {
        url: "/quiz/:catId",
        templateUrl: "partials/quiz.html",
        controller: function($scope,$http,$filter,$stateParams){
            $http.get("/data/quiz.json").success(function (data){
                        var queries = [];
                        queries = ($filter('filter')(data,{"topic":$stateParams.catId}));
                        $scope.qrys=queries[0].questions;
                    }).error(function(err,status){
                        console.data(status);
                });
            $scope.setShowResult = function (disabled){
                disabled = true;
            };
            $scope.getShowResult = function (answer){
                return (answer > 0);
            };
        }
    })
    .state('blogitem', {
        url: "/blogitem",
        templateUrl: "partials/blog-item.html"
    })
    .state('blog', {
        url: "/blog",
        templateUrl: "partials/blog.html"
    })

    //HTML mode for pretty url 
    //Also ensure <base href="/"> is included in the index.html or the main page
    $locationProvider.html5Mode(true);
})

.run(['$http','$rootScope','$window','$localStorage', function($http, $rootScope,$window,$localStorage) {
    // add JWT token as default auth header
    // $http.defaults.headers.common.Authorization
    // $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
    if($localStorage.currentUser != undefined && $localStorage.currentUser != null) {
        console.log("Authorization:" + $localStorage.currentUser.username);
    }
    $rootScope.$on('$stateChangeSuccess',function(){
        $window.scrollTo(0,0);
    })

}])



//***********************************************************************************//
//                              Modal Window controller                              //
//***********************************************************************************//
// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
myapp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $state, modalObject) {
    console.log(modalObject);
    $scope.modalObject = modalObject;

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.stateGoToDetails = function (url, params) {
        $state.go(url,params);
        $uibModalInstance.dismiss('cancel');
    };

});


//***********************************************************************************//
//                              Login Window controller                              //
//***********************************************************************************//
myapp.controller('LoginCtrl', function ($location, $uibModalInstance, AuthenticationService) {
    var vm = this;
    vm.login = login;
     
    initController();
     
    function initController() {
        vm.error = false;
        // reset login status
        AuthenticationService.flushLoginTokens(function (status){
            console.log("Logout:" + status);
        });

    };
     
    function login() {
        vm.error = false;
        vm.loading = true;
        AuthenticationService.Login(vm.username, vm.password, function (result) {
            if (result === true) {
                $location.path('/');
                $uibModalInstance.close({success:true});
                // $uibModalInstance.dismiss('cancel');
            } else {
                vm.error = 'Username or password is incorrect';
                vm.loading = false;
            }
        });
    };

    vm.openSignup = function () {
        console.log("test");
        $uibModalInstance.close({openSignup:true});
    };
});


//***********************************************************************************//
//                              Header Navig controller                              //
//***********************************************************************************//
myapp.controller('headerCtrl', function ($scope, $uibModal,AuthenticationService) {
    $scope.Islogged = false;
    $scope.openLoginModal = function () {
        var LoginmodalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'signin.html',
          controller: 'LoginCtrl',
          controllerAs : 'vm'
        });

        LoginmodalInstance.result.then(function (res){
            if(res.success){
                $scope.Islogged = true;
                console.log("close:" + res);
            }
            else if(res.openSignup){
                $scope.openSignupModal();
            }
        }, function (res) {
            console.log("dismiss:" + res);
        });
    };

    $scope.openSignupModal = function () {
        $scope.IsRegistered = false;
        var SignupmodalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'register.html',
          controller: 'RegisterCtrl',
          controllerAs : 'vm'
        });
        SignupmodalInstance.result.then(function (res){
            if(res.success){
                $scope.IsRegistered = true;
                console.log("Register close:" + res);
            }
        }, function (res) {
            console.log("Register dismiss:" + res);
        });
    };

    $scope.logout = function () {
        AuthenticationService.Logout(function(status){
            console.log("Logout:" + status);
            $scope.Islogged = !status;
        });
    };

});

//***********************************************************************************//
//                              Signup Window controller                             //
//***********************************************************************************//
myapp.controller('RegisterCtrl', function ($location, $uibModalInstance, AuthenticationService) {
    var vm = this;
     
    initController();
     
    function initController() {
        vm.error = false;
        // reset login status
        AuthenticationService.flushLoginTokens(function (status){
            console.log("Logout:" + status);
        });
    };
     
    vm.register = function () {
        vm.error = false;
        vm.loading = true;
        if (vm.password != vm.confirmpassword) {
            console.log("Register password mismatch");
            vm.error = 'Password & Confirm Password doesnot match';
            vm.loading = false;
            return;
        }

        console.log(vm.email);
        console.log(vm.password);
        console.log(vm.username);
        console.log(vm.phone);
        AuthenticationService.Register(vm.email, vm.password, vm.username, vm.phone,  function (result) {
            if (result === true) {
                // $location.path('/');
                $uibModalInstance.close({success:true});
                // Toast Message That registration is done

                // $uibModalInstance.dismiss('cancel');
            } else {
                vm.error = result.message;
                vm.loading = false;
            }
        });
    };
});

})();