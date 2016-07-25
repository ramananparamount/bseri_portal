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