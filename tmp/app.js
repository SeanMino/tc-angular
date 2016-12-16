/**
 * Created by yupeng on 16/11/10.
 */

var app = angular.module('xianfeng',['ui.router','HomeModules']);

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/home');

})
