angular.module('taskEditControllers',['dataServices'])

.controller('taskEditCtrl',function($http, $location, $timeout, DataService){
    let app = this;
    app.taskData = {
        task_id: DataService.getData()
    };
    this.editTask = function(taskData){
        console.log(this.taskData);
        $http.post(`/api/task_edit`,this.taskData).then(function(data){
            if (data.data.success) {
                app.loading = false;
                //Success message
                app.successMsg = data.data.message;
                //Redirect to task_manager
                $timeout(function(){
                    $location.path('/task_manager');
                }, 2000);
                
            } else {
                //Error message
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    }  
});