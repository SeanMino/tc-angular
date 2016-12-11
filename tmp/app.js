/**
 * Created by yupeng on 16/11/10.
 */

var app = angular.module('xianfeng',['ui.router','angularCSS','HomeModules']);

app.config(function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/home');

})
