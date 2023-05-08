angular.module('userServices',[])

.factory('User', function($http){
    userFactory = {};
    
    userFactory.create= function(redData){
        return $http.post('/api/users',this.regData);
    }

    return userFactory;
});
