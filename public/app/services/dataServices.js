angular.module('dataServices',[])

.factory ('DataService', function($http){
    var dataFactory = {};

    function setData(newData) {
        data = newData;
        console.log('set Data: '+ newData);
      }

    function getData() {
        return data;
    }

    return {
        setData: setData,
        getData: getData
      };
});
















// angular.module('dataServices').service('DataService',function(){
//     var data = {};

//     function setData(newData){
//         data = newData;
//     }

//     function getData(){
//         return data;
//     }

//     return {
//         setData: setData,
//         getData: getData
//     };
// });