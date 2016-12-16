/**
 * Created by yupeng on 16/11/10.
 */

angular.module('HomeModules',[])

     .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

          $stateProvider.state('home',{
               url:'/home',
               templateUrl:'./modules/home/home.html',
               controller:'HomeCtrl',
               css:'./modules/home/home.css'
          })

     }])

    .filter('wang',function(){
        return function(ele){
            return ele+">>"
        }
    })

    .service('MathService',['$http',function($http){
         this.add = function(x,y){
              return x+y;
         }
         
    }])

     .controller('HomeCtrl',['$scope','MathService',function($scope,MathService){
          $scope.name = 'xiaowei';
          $scope.number = MathService.add;
          
     }])
