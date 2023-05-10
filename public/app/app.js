angular.module('plannerApp',[`appRoutes`,`taskControllers`, `ngAnimate`,`taskDisplayControllers`,'taskEditControllers','userControllers','userServices','dataServices','mainController','authServices','ui.bootstrap'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});