angular.module('summaryControllers',[])

.controller('summaryCtrl', function($scope,$http){
    console.log('summary ctrl');
    $scope.loadData = function() {
        $http.post('/api/task_display').then(function(response) {
          $scope.data = response.data;
          console.log($scope.data);
        }, function(error) {
          console.log(error);
        });
      };

    $scope.calculateCompletionRate = function() {
        var completedTasks = 0;
        for (var i = 0; i < $scope.data.length; i++) {
          if ($scope.data[i].task_status == 1) {
            completedTasks++;
          }
        }
        var completionRate = (completedTasks / $scope.data.length) * 100;
        return completionRate.toFixed(2) + "%";
      };


    $scope.$on('$viewContentLoaded', function() {
        $scope.loadData();
        $scope.getTaskCompletionRate();
    });

    

});



