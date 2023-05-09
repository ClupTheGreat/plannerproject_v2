angular.module('userControllers',['userServices'])

.controller('regCtrl', function($http, User, $location, $timeout, User){

    var app= this;
    app.errorMsg = false;

    this.regUser = function(regData){
        console.log('Form submitted');
        console.log(this.regData);
        User.create(this.regData).then(function(data){
            console.log(data);
            if (data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $location.path('/task_manager');
                }, 2000);
            } else {
                app.errorMsg = data.data.message;
            }
            
        })
    }
});
