angular.module('userControllers',['userServices'])

.controller('regCtrl', function($http, User){

    var app= this;

    this.regUser = function(regData){
        console.log('Form submitted');
        console.log(this.regData);
        User.create(regData).then(function(data){
            console.log(data);
            if (data.data.success){
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = data.data.message;
            }
            
        })
    }
});
