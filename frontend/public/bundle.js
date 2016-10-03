angular.module('keeperApp', ['ui.router'])
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

})//end of angular app

angular.module('keeperApp')
.controller('mainCtrl',mainCtrl)

function mainCtrl($scope){

$scope.test="hello"


} //end of controller

angular.module('keeperApp')
.controller('mainpageCtrl',mainpageCtrl);

function mainpageCtrl(){





}//end of mainpageCtrl

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope){

$scope.test='hello is this working';

}//end of homeCtrl

angular.module('keeperApp')
.controller('createCtrl',createCtrl)


function createCtrl($scope,createService){


  var newSite = {
    name: $scope.name,
    address: $scope.address,
    site_info: $scope.siteinfo,
    contract_length: $scope.contract,
    hours: $scope.hours
  }

$scope.addSite = function(){
createService.createsite(){
.then(function(newSite){
})

}

}




}//end of controller

angular.module('keeperApp')
.directive('createSiteDirective',function(){

return{
  restrict:'E',
  templateUrl:'app/shared/createsite/createsite.html',
  
}


})//end of directive

angular.module('keeperApp')
.directive('menuDirective',function(){

return{
  restrict: 'E',
  templateUrl: 'app/shared/menu/menu.html'
}


})

angular.module('keeperApp')
.service('createService',createService)

function createService($http,$q){

this.createsite = function(obj){
  return $http({
    method:"POST",
    url:"localhost:3000/createsite",
    data:obj
  })
}


}//end of service

angular.module('keeperApp')
.service('mainpageService',mainpageService);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJzaGFyZWQvY3JlYXRlc2l0ZS9jcmVhdGVDdHJsLmpzIiwic2hhcmVkL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZS1kaXJlY3RpdmUuanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9jcmVhdGVTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL21haW5wYWdlU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcsIFsndWkucm91dGVyJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgICAvLyAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpXG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnc2lnbmluJyx7XG4gICAgICB1cmw6Jy8nLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9zaWduaW4vc2lnbmluLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ3NpZ25pbkN0cmwnXG4gICAgfSlcblxuICAgIC5zdGF0ZSgnbWFpbnBhZ2UnLHtcbiAgICAgIHVybDonL21haW5wYWdlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvbWFpbi9tYWlucGFnZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdtYWlucGFnZUN0cmwnXG4gICAgfSlcblxufSkvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5wYWdlQ3RybCcsbWFpbnBhZ2VDdHJsKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VDdHJsKCl7XG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2lnbmluQ3RybCcsc2lnbmluQ3RybClcblxuZnVuY3Rpb24gc2lnbmluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD0naGVsbG8gaXMgdGhpcyB3b3JraW5nJztcblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdjcmVhdGVDdHJsJyxjcmVhdGVDdHJsKVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZUN0cmwoJHNjb3BlLGNyZWF0ZVNlcnZpY2Upe1xuXG5cbiAgdmFyIG5ld1NpdGUgPSB7XG4gICAgbmFtZTogJHNjb3BlLm5hbWUsXG4gICAgYWRkcmVzczogJHNjb3BlLmFkZHJlc3MsXG4gICAgc2l0ZV9pbmZvOiAkc2NvcGUuc2l0ZWluZm8sXG4gICAgY29udHJhY3RfbGVuZ3RoOiAkc2NvcGUuY29udHJhY3QsXG4gICAgaG91cnM6ICRzY29wZS5ob3Vyc1xuICB9XG5cbiRzY29wZS5hZGRTaXRlID0gZnVuY3Rpb24oKXtcbmNyZWF0ZVNlcnZpY2UuY3JlYXRlc2l0ZSgpe1xuLnRoZW4oZnVuY3Rpb24obmV3U2l0ZSl7XG59KVxuXG59XG5cbn1cblxuXG5cblxufS8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmRpcmVjdGl2ZSgnY3JlYXRlU2l0ZURpcmVjdGl2ZScsZnVuY3Rpb24oKXtcblxucmV0dXJue1xuICByZXN0cmljdDonRScsXG4gIHRlbXBsYXRlVXJsOidhcHAvc2hhcmVkL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZS5odG1sJyxcbiAgXG59XG5cblxufSkvL2VuZCBvZiBkaXJlY3RpdmVcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmRpcmVjdGl2ZSgnbWVudURpcmVjdGl2ZScsZnVuY3Rpb24oKXtcblxucmV0dXJue1xuICByZXN0cmljdDogJ0UnLFxuICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnXG59XG5cblxufSlcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ2NyZWF0ZVNlcnZpY2UnLGNyZWF0ZVNlcnZpY2UpXG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2UoJGh0dHAsJHEpe1xuXG50aGlzLmNyZWF0ZXNpdGUgPSBmdW5jdGlvbihvYmope1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIlBPU1RcIixcbiAgICB1cmw6XCJsb2NhbGhvc3Q6MzAwMC9jcmVhdGVzaXRlXCIsXG4gICAgZGF0YTpvYmpcbiAgfSlcbn1cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbWFpbnBhZ2VTZXJ2aWNlJyxtYWlucGFnZVNlcnZpY2UpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
