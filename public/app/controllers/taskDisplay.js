angular.module('taskDisplayControllers', ['dataServices'])

.controller('taskDisplayCtrl', function($scope, $http, $interval, DataService) {
  //audio files
  var audio = new Audio('/assets/audio/alert.mp3');
  var audio_complete = new Audio('/assets/audio/alert_complete.mp3');

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
      task.playedAudio = {
        'hour': false,
        'minute30': false,
        'minute10': false,
        'second1': false
      };
      var deadline = new Date(task.task_end_time);
      var now = new Date();
      var diff = deadline - now;

      if (diff < 0) {
        task.time_remaining = 'Expired';
        task.playedAudio = {
          'hour': false,
          'minute30': false,
          'minute10': false,
          'second1': false
        };
        
      } else {
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);
        task.time_remaining = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';

        if (!task.playedAudio.hour && hours == 1) {
          audio.play();
          task.playedAudio.hour = true;
        } 
        if (!task.playedAudio.minute30 && minutes == 30) {
          audio.play();
          task.playedAudio.minute30 = true;
        } 
        if (!task.playedAudio.minute10 && minutes == 10) {
          audio.play();
          task.playedAudio.minute10 = true;
        } 
        if (!task.playedAudio.second1 && minutes == 0 && seconds == 1) {
          audio_complete.play();
          task.playedAudio.second1 = true;
        }

      }
    });

    $scope.sendData = function(task_data){
        DataService.setData(task_data)
    }

    $scope.deleteTask = function(task_id){
        $http.post('/api/delete_task', {task_id : task_id});
        $scope.loadData();
    }

    $scope.completeTask = function(task_id){
      $http.post('/api/complete_task',{task_id : task_id});
      $scope.loadData();
    }
  };
});

