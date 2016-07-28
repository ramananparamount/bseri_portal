(function () {

    angular.module('ui.splash', ['ui.bootstrap', 'ngAnimate'])
        .service('$splash', ['$uibModal','$rootScope', 
          function($uibModal, $rootScope) {
            return {
                open: function (attrs, opts) {
                    console.log("Within Splash");
                    var scope = $rootScope.$new();
                    angular.extend(scope, attrs);
                    opts = angular.extend(opts || {}, {
                        backdrop: false,
                        scope: scope,
                        templateUrl: 'splash/content.html',
                        windowTemplateUrl: 'splash/index.html'
                    });
                    console.log("Within Splash2");

                    return $uibModal.open(opts);
                }
            };
        }
    ])
    .run([
      '$templateCache',
      function ($templateCache) {
        $templateCache.put('splash/index.html',
          '<section modal-render="{{$isRendered}}" class="splash" modal-in-class="splash-open" ng-style="{\'z-index\': 1000, display: \'block\'}" ng-click="close($event)">' +
          '  <div class="splash-inner" ng-transclude></div>' +
          '</section>'
        );
        $templateCache.put('splash/content.html',
          '<div class="splash-content text-center">' +
          '  <h1 ng-bind="title"></h1>' +
          '  <p class="lead" ng-bind="message"></p>' +
          '  <button class="btn btn-lg btn-outline" ng-bind="btnText || \'Ok, cool\'" ng-click="$close()"></button>' +
          '</div>'
        );
      }
    ]);


    var myapp = angular.module('bseriApp', ['ui.splash', 'ngAnimate','ui.router', 'ui.bootstrap', 'ngStorage']);
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
        url: "/training/:coursekeyword/:eventid",
        templateUrl: "partials/singlecourses.html",
        controller: function($scope,$http,$stateParams,$state,$localStorage,$uibModal,$q){
            console.log("Calling 1st");
            $scope.details = $http.get('/api/training/' + $stateParams.coursekeyword + "/" + $stateParams.eventid);
            $scope.registerinfo = $http.get('/api/training/eventIsRegistered' + "/" + $stateParams.eventid);

            $q.all([$scope.details,$scope.registerinfo])
                .then(function(values){
                    console.log(values[0].data);
                    console.log(values[1].data);
                    $scope.course = values[0].data.course;
                    if(values[1].data.isregistered){
                        $scope.RegisterMsg = "Course Registered";
                        $scope.TakeCourseDisabled = true;
                        // $scope.anchorlinkRegister = "";
                    }
                    else
                    {
                        $scope.RegisterMsg = "Take Course";
                        $scope.TakeCourseDisabled = false;
                        // $scope.anchorlinkRegister = "javascript:void(0)";
                    }
                });

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
            $scope.RegisterEvent = function(course){
                if($scope.TakeCourseDisabled){
                    console.log("Is Course disabled");
                    return false;
                }
                var loading = true;
                if($localStorage.currentUser === undefined || $localStorage.currentUser === null) {
                    $scope.openLoginModal();
                }
                else{
                    console.log(course.course.keyword + ',' + course.eventid);
                    $http.post('/api/training/registerCourse/' + course.course.keyword + "/" + course.eventid)
                        .success(function (response){
                            console.log(response);
                            if(response.success == true){
                                console.log("into DOM manipulation");
                                $scope.RegisterMsg = "Course Registered";
                                $scope.TakeCourseDisabled = true;
                                $scope.anchorlinkRegister = "";
                            }
                            $scope.snackbarMsg = response.message;
                        })
                        .error(function(err,status){
                            console.log(err);     
                        });
                }
            }

            $scope.IsCourseRegistered = function(){
                return $scope.TakeCourseDisabled;
            }
        }
    })

    .state('about', {
        url: "/about",
        templateUrl: "partials/about.html"
    })
    .state('course', {
        url: "/course",
        templateUrl: "partials/courses1.html"
    })
    .state('training', {
        url: "/training",
        templateUrl: "partials/training.html",
        controller: function($scope,$http,$state, $uibModal){
            console.log("Main Training State");
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
    .state('mytraining', {
        url: "/training/me",
        templateUrl: "partials/training.html",
        controller: function($scope, $http, $state, $uibModal){
            console.log("get My Events in the training html");
            $http.get('/api/training/myevents').success(function (response){
                console.log("response :"+ response);
                $scope.courses = response.courses;
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

    .state('junction', {
        url: "/junction",
        templateUrl: "partials/junction.html",
        controller: function($scope, $http, $state, $timeout, $stateParams, $splash , $uibModal){

            $scope.isCollapsed = true;

            $scope.openJunctionModal = function (blurb){
                var modalInstance = $uibModal.open({
                  animation: true,
                  size:'lg',
                  templateUrl: 'junctiondetails.html',
                  controller: 'ModalInstanceCtrl',
                  resolve: {
                    modalObject: blurb
                  }
                });
                // $splash.open({
                //     title: 'Hi there!',
                //     message: "This sure is a fine modal, isn't it?"
                // });
            };

            $http.get('/api/junction').success(function (response){
                console.log(response);
                $scope.categories = response.categories;
            }).error(function(err,status){
                console.log(err);
            });

            $scope.getCategoryBlurb = function(catID,tabIdx){
                console.log("catID:"+catID);
                if($scope.categories[tabIdx].isLoaded){
                    // console.log("Already Loaded:"+tabIdx);
                    return;
                }
                /* or make request for data delayed to show Loading... */
                $timeout(function(){
                    console.log("Getting from service catID:"+catID + ' for tabIdx = ' + tabIdx);
                    $http.get('/api/junction/' + catID).success(function(response){
                        // console.log(response.items);
                        $scope.categories[tabIdx].blurbs = response.items;
                        // console.log($scope.categories[tabIdx].blurbs[0].title);
                        $scope.categories[tabIdx].isLoaded=true;
                    }).error(function(err,status){
                        console.log(err);
                    });
                
                }, 100);

            };
        }
    })


    .state('gallery', {
        url: "/gallery",
        templateUrl: "partials/gallery.html"
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
    // $locationProvider.html5Mode(true);
})

.run(['$http','$rootScope','$window','$localStorage', function($http, $rootScope,$window,$localStorage) {
    if($localStorage.currentUser != undefined && $localStorage.currentUser != null) {
        console.log("Authorization:" + $localStorage.currentUser.token);
        // add JWT token as default auth header
        // $http.defaults.headers.common.Authorization
        $http.defaults.headers.common.Authorization = $localStorage.currentUser.token;
        console.log("Authorization:" + $http.defaults.headers.common.Authorization);
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
        console.log(url + '--' + params);
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
                // $location.path('/');
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
myapp.controller('headerCtrl', function ($scope, $uibModal, $state, AuthenticationService, $localStorage) {
    $scope.Islogged = false;

    //Initialize the Logged State
    var init = function(){
        if($localStorage.currentUser != undefined && $localStorage.currentUser != null) {
            $scope.Islogged = true;
        }
    }
    init();

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

    $scope.getMyEvents = function(){
        console.log("Get My Events:");
        $state.go('mytraining');
    }

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