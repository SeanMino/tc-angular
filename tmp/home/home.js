/**
 * Created by yupeng on 16/11/10.
 */

angular.module('HomeModules',[])

     .config(function($stateProvider,$urlRouterProvider){

          $stateProvider.state('home',{
               url:'/home',
               templateUrl:'./modules/home/home.html',
               controller:'HomeCtrl',
               css:'./modules/home/home.css'
          })

     })

    .filter('wang',function(){
        return function(ele){
            return ele+">>"
        }
    })

    .service('MathService',['$http',function($http){
         this.add = function(x,y){
              return x+y;
         }
         this.getData = function(){
            return $http.get('./data.json')
         }
    }])

     .controller('HomeCtrl',['$scope','MathService',function($scope,MathService){
          $scope.name = 'xiaowei';
          $scope.number = MathService.add;
          MathService.getData().success(function(res){
              $scope.arr = res;
          })
     }])
