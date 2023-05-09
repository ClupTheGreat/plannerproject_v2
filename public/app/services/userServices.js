angular.module('userServices',[])

.factory('User', function($http){
    userFactory = {};
    userFactory.create= function(regData){
        console.log(regData + 'service');
        return $http.post('/api/users',regData);
    }

    return userFactory;
});
