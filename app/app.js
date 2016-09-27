angular.module('keeperApp', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/home')

    $stateProvider
    .state('/home',{
      url:'/home',
      templateUrl: 'app/components/home/home.html',
      controller: 'homeCtrl'
    })

})//end of angular app
