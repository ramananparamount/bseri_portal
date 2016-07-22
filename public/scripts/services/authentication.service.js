(function () {
    'use strict';
 
    angular
        .module('bseriApp')
        .factory('AuthenticationService', Service);
 
    function Service($http, $localStorage) {
        var service = {};
 
        service.Login = Login;
        service.Logout = Logout;
        service.Register = Register;
        service.flushLoginTokens = flushLoginTokens;
 
        return service;
 
        function Login(username, password, callback) {
            $http.post('/api/home/login', { username: username, password: password })
                .success(function (response) {
                    // console.log(response);
                    // login successful if there's a token in the response
                    if (response.token) {
                        // store username and token in local storage to keep user logged in between page refreshes
                        $localStorage.currentUser = { username: username, token: response.token };
                        // console.log($localStorage.currentUser);
                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = response.token;
                        // console.log($http.defaults.headers.common.Authorization);
 
                        // execute callback with true to indicate successful login
                        callback(true);
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                })
                .error(function (err,status){
                    console.log(err);
                });
        }

        function Register(email, password, username, phone, callback) {
            console.log(email);
            console.log(password);
            console.log(username);
            console.log(phone);

            $http.post('/api/home/register', {email:email, password: password, username: username, phone:phone })
                .success(function (response) {
                    // register successful
                    if (response.success) {


                        // // store username and token in local storage to keep user logged in between page refreshes
                        // $localStorage.currentUser = { username: username, token: response.token };
                        // // console.log($localStorage.currentUser);
                        // // add jwt token to auth header for all requests made by the $http service
                        // $http.defaults.headers.common.Authorization = response.token;
                        // // console.log($http.defaults.headers.common.Authorization);
 
                        // // execute callback with true to indicate successful login
                        callback(response);
                    } else {
                        // execute callback with false to indicate failed login
                        callback(response);
                    }
                })
                .error(function (err,status){
                    console.log(err);
                });
        }


 
        function Logout(callback) {
            console.log("entering Logout");

            $http.post('/api/home/logout')
                .success(function(response){
                    console.log("entering success");
                    flushLoginTokens(callback);
                }) 
                .error(function(err,status){
                    console.log("entering error from logout service");
                    console.log(err);
                    callback(false);
                });

        }

        function flushLoginTokens(callback){
            console.log("entering flushLoginTokens");
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
            callback(true);
        }

    }
})();