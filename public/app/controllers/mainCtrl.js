angular.module('mainController',[`authServices`])

.controller('mainCtrl', function($timeout, $location, Auth, $rootScope){
    var app = this;
    app.loadme = false;

    $rootScope.$on('$routeChangeStart', function(){
        if (Auth.isLoggedIn()){
            app.isLoggedIn = true;
            Auth.getUser().then(function(data){
                app.username = data.data.username;
                app.useremail = data.data.useremail;
                app.loadme = true;
            });
        } else {
            app.isLoggedIn = false;
            app.username = '';
            app.loadme = true;
        }
    });
    


    this.doLogin = function(loginData){
        app.errorMsg = false;

        Auth.login(app.loginData).then(function(data){ 
            if (data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $location.path('/');
                    app.loginData = '';
                    app.successMsg=false;
                }, 2000);
            } else {
                app.errorMsg = data.data.message;
            }
            
        })
    }

    this.logout = function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/');
        }, 2000);
    }
});