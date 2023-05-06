angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/about',{
        templateUrl: 'app/views/pages/about.html'
    })

    .when('/create_task',{
        templateUrl: 'app/views/pages/create_task.html',
        controller: 'taskCtrl',
        controllerAs: 'creator'
    })

    .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});