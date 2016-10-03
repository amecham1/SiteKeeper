angular.module('keeperApp', ['ui.router','ui.bootstrap','ngAnimate'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/')

    $stateProvider
    .state('signin',{
      url:'/',
      templateUrl: 'app/components/signin/signin.html',
      controller: 'signinCtrl'
    })

    .state('mainpage',{
      url:'/mainpage',
      templateUrl: 'app/components/main/mainpage.html',
      controller: 'mainpageCtrl'
    })
    // .state('sitemodal',{
    //   url:'/sitemodal',
    //   templateUrl: 'app/shared/createsite/createsite.html',
    //   controller: 'complexCtrl'
    // })

})//end of angular app
