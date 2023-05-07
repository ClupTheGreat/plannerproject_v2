angular.module('taskEditServices',[])

.factory ('TaskEdit', function($http){
    taskEditFactory = {};

    // Task.create(taskData)
    taskFactory.create = function(taskData){
        return $http.post('/api/task_edit', taskData);
    }

    return taskEditFactory;
});