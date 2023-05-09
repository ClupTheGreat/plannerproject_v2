angular.module('authServices',[])

.factory('Auth', function($http, AuthToken, $q){
    authFactory = {};
    //Auth.login(loginData);
    authFactory.login = function(loginData){
        return $http.post('/api/authenticate',loginData).then(function(data){
            AuthToken.setToken(data.data.token);
            return data;
        });
    }


    //Auth.isLoggedIn();
    authFactory.isLoggedIn = function(){
        if (AuthToken.getToken()){
            return true;
        } else {
            return false;
        }
    };

    //AuthToken.getUser();
    authFactory.getUser = function(){
        if (AuthToken.getToken()){
            return $http.post('/api/me');
        } else {
            return $q.reject({message : 'User has no token'});
        }
    }

    //Auth.logout();
    authFactory.logout = function(){
        AuthToken.setToken();
    };

    return authFactory;
})

.factory('AuthToken', function($window){
    let authTokenFactory = {};

    authTokenFactory.setToken = function(token){
        if (token) {
            return $window.localStorage.setItem('token', token);
        } else {
            return $window.localStorage.removeItem('token');
        }
    };

    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    }

    return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken){
    var authInterceptorsFactory = {};

    authInterceptorsFactory.request = function(config){
        var token = AuthToken.getToken();
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    };
    return authInterceptorsFactory;
});

