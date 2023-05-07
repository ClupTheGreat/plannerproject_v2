angular.module('taskServices',[])

.factory ('Task', function($http){
    taskFactory = {};

    // Task.create(taskData)
    taskFactory.create = function(taskData){
        return $http.post('/api/tasks', taskData);
    }

    return taskFactory;
});