var app = angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html',
        authenticated: false
    })

    .when('/task_manager',{
        templateUrl: 'app/views/pages/task_manager.html',
        controller: 'taskDisplayCtrl',
        controllerAs: 'display',
        authenticated: true
    })

    .when('/create_task',{
        templateUrl: 'app/views/pages/create_task.html',
        controller: 'taskCtrl',
        controllerAs: 'creator',
        authenticated: true
    })

    .when('/edit_task',{
        templateUrl: 'app/views/pages/edit_task.html',
        controller: 'taskEditCtrl',
        controllerAs: 'editor',
        authenticated: true
    })

    .when('/register',{
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
    })

    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })

    .when('/logout',{
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true
    })

    .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.run(['$rootScope','Auth','$location', function($rootScope, Auth, $location){

    $rootScope.$on('$routeChangeStart', function(event, next, current){
        if (next.$$route.authenticated == true) {
            if (!Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            }
        } else if (!next.$$route.authenticated == false) {
            if (Auth.isLoggedIn()){
                console.log('Opps');
                event.preventDefault();
                $location.path('/');
            }
        }
    })

}]);
