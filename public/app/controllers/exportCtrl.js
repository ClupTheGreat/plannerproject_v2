angular.module('exportControllers',[])

.controller('exportCtrl', function($http, $scope){
    $scope.exportFunc = function(){
        $http.post('/api/export');
    }
    
});