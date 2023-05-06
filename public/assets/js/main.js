// angular.module('plannerApp', [])
//     .controller('PlannerController', ['$scope', '$http', function($scope, $http) {
//         $scope.loading = false;
//         $scope.items = [];
//         $scope.loadData = function() {
//             $scope.loading = true;
//             $http.get('/data')
//                 .then(function(response) {
//                     $scope.loading = false;
//                     $scope.items = response.data;
//                 })
//                 .catch(function(error) {
//                     console.error(error);
//                 });
//         };
//     }]);