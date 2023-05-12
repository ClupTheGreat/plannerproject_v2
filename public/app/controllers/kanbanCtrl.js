angular.module('kanbanController',[])

.controller('kanbanCtrl', function($scope ,$http ){
    $scope.kanbanData;
    $scope.moveRight = function(){
        

    }

    $scope.loadData = function(){
        $http.post('/api/kanban_request').then(function(response) {
            $scope.kanbanData = response.data;
            
            console.log($scope.kanbanData);
    });
    };

    $scope.movr = function(task_id){
        $http.post('/api/kanban_movr', {task_id : task_id});
        $scope.loadData();
    }

    $scope.movl = function(task_id){
        $http.post('/api/kanban_movl', {task_id : task_id});
        $scope.loadData();
    }


    $scope.loadData();
});