angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/task_manager',{
        templateUrl: 'app/views/pages/task_manager.html',
        controller: 'taskDisplayCtrl',
        controllerAs: 'display'
    })

    .when('/create_task',{
        templateUrl: 'app/views/pages/create_task.html',
        controller: 'taskCtrl',
        controllerAs: 'creator'
    })

    .when('/edit_task',{
        templateUrl: 'app/views/pages/edit_task.html',
        controller: 'taskEditCtrl',
        controllerAs: 'editor'
    })

    .when('/register',{
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register'
    })

    .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});