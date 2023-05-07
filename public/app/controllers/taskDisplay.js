angular.module('taskDisplayControllers', ['dataServices'])

.controller('taskDisplayCtrl', function($scope, $http, $interval, DataService) {

  $scope.loadData = function() {
    $http.post('/api/task_display').then(function(response) {
      $scope.data = response.data;
      $scope.calculateTimeRemaining(); // call the new function to calculate time remaining
    }, function(error) {
      console.log(error);
    });
  };

  $scope.$on('$viewContentLoaded', function() {
    $scope.loadData();
    $interval($scope.calculateTimeRemaining, 1000); // update the timer every second
  });

  $scope.calculateTimeRemaining = function() {
    angular.forEach($scope.data, function(task) {
      var deadline = new Date(task.task_end_time);
      var now = new Date();
      var diff = deadline - now;

      if (diff < 0) {
        task.time_remaining = 'Expired';
      } else {
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);
        task.time_remaining = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
      }
    });

    $scope.sendData = function(task_data){
        DataService.setData(task_data)
    }

    $scope.deleteTask = function(task_id){
        $http.post('/api/delete_task', {task_id : task_id});
        $scope.loadData();
    }
  };
});

