angular.module(`taskControllers`,['taskServices'])

.controller('taskCtrl', function($http, $location, $timeout, Task){

    let app = this;

    this.taskCreate = function(taskData){
        app.loading = true;
        app.errorMsg = false;
        Task.create(app.taskData).then(function(data){
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
    };
});
