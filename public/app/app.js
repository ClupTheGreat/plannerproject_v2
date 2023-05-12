angular.module('plannerApp',[`appRoutes`,`taskControllers`, `ngAnimate`,`taskDisplayControllers`,'taskEditControllers','userControllers','userServices','dataServices','mainController','authServices','kanbanController'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});