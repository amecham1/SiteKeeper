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
.directive('createSiteDirective',function(){

return{
  restrict:'E',
  templateUrl:'app/shared/createsite/createsitemodal.html',

}


})//end of directive

angular.module('keeperApp')
.controller('modalCtrl',modalCtrl)


function modalCtrl($scope,$uibModalInstance,createService){


  $scope.submit = function(site){
    createService.createsite(site)
    .then(function(response){
    })
    $uibModalInstance.close(
      createService.alert()
    );
  }



$scope.cancel= function(){
  $uibModalInstance.dismiss();
}

$scope.ok=function(){
  $uibModalInstance.close('Test');
}

}

angular.module('keeperApp')
.directive('menuDirective',function(){

return{
  restrict: 'E',
  templateUrl: 'app/shared/menu/menu.html',
  controller: function($scope,$uibModal){
    console.log('fired!')
    $scope.open=function(){
      var modalInstance = $uibModal.open({
        size:'md',
        templateUrl:'app/shared/createsite/createsitemodal.html',
        controller:'modalCtrl',
        // windowTemplateUrl:'app/shared/createsite/createsitemodal.html'
      })
    }
    }
  }

})

angular.module('keeperApp')
.service('createService',createService)

function createService($http,$q){

this.createsite = function(obj){
  return $http({
    method:"POST",
    url:"/createsite",
    data:obj
  })
}


this.alert = function(){swal({
    title: "Site Created!",
    type: "success",
    confirmButtonText: "Ok", 
    allowOutsideClick: true
  });

    }


}//end of service

angular.module('keeperApp')
.service('mainpageService',mainpageService);

function mainpageService(){




}//end of service

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJzaGFyZWQvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlLWRpcmVjdGl2ZS1tb2RhbC5qcyIsInNoYXJlZC9jcmVhdGVzaXRlL21vZGFsQ3RybC5qcyIsInNoYXJlZC9tZW51L21lbnUtZGlyZWN0aXZlLmpzIiwic2hhcmVkL3NlcnZpY2VzL2NyZWF0ZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvbWFpbnBhZ2VTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcsIFsndWkucm91dGVyJywndWkuYm9vdHN0cmFwJywnbmdBbmltYXRlJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgICAvLyAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpXG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnc2lnbmluJyx7XG4gICAgICB1cmw6Jy8nLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9zaWduaW4vc2lnbmluLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ3NpZ25pbkN0cmwnXG4gICAgfSlcblxuICAgIC5zdGF0ZSgnbWFpbnBhZ2UnLHtcbiAgICAgIHVybDonL21haW5wYWdlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvbWFpbi9tYWlucGFnZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdtYWlucGFnZUN0cmwnXG4gICAgfSlcbiAgICAvLyAuc3RhdGUoJ3NpdGVtb2RhbCcse1xuICAgIC8vICAgdXJsOicvc2l0ZW1vZGFsJyxcbiAgICAvLyAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9jcmVhdGVzaXRlL2NyZWF0ZXNpdGUuaHRtbCcsXG4gICAgLy8gICBjb250cm9sbGVyOiAnY29tcGxleEN0cmwnXG4gICAgLy8gfSlcblxufSkvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5wYWdlQ3RybCcsbWFpbnBhZ2VDdHJsKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VDdHJsKCl7XG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2lnbmluQ3RybCcsc2lnbmluQ3RybClcblxuZnVuY3Rpb24gc2lnbmluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD0naGVsbG8gaXMgdGhpcyB3b3JraW5nJztcblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5kaXJlY3RpdmUoJ2NyZWF0ZVNpdGVEaXJlY3RpdmUnLGZ1bmN0aW9uKCl7XG5cbnJldHVybntcbiAgcmVzdHJpY3Q6J0UnLFxuICB0ZW1wbGF0ZVVybDonYXBwL3NoYXJlZC9jcmVhdGVzaXRlL2NyZWF0ZXNpdGVtb2RhbC5odG1sJyxcblxufVxuXG5cbn0pLy9lbmQgb2YgZGlyZWN0aXZlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtb2RhbEN0cmwnLG1vZGFsQ3RybClcblxuXG5mdW5jdGlvbiBtb2RhbEN0cmwoJHNjb3BlLCR1aWJNb2RhbEluc3RhbmNlLGNyZWF0ZVNlcnZpY2Upe1xuXG5cbiAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKHNpdGUpe1xuICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlc2l0ZShzaXRlKVxuICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICB9KVxuICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKFxuICAgICAgY3JlYXRlU2VydmljZS5hbGVydCgpXG4gICAgKTtcbiAgfVxuXG5cblxuJHNjb3BlLmNhbmNlbD0gZnVuY3Rpb24oKXtcbiAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xufVxuXG4kc2NvcGUub2s9ZnVuY3Rpb24oKXtcbiAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoJ1Rlc3QnKTtcbn1cblxufVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJyxmdW5jdGlvbigpe1xuXG5yZXR1cm57XG4gIHJlc3RyaWN0OiAnRScsXG4gIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L21lbnUuaHRtbCcsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwkdWliTW9kYWwpe1xuICAgIGNvbnNvbGUubG9nKCdmaXJlZCEnKVxuICAgICRzY29wZS5vcGVuPWZ1bmN0aW9uKCl7XG4gICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcbiAgICAgICAgc2l6ZTonbWQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDonYXBwL3NoYXJlZC9jcmVhdGVzaXRlL2NyZWF0ZXNpdGVtb2RhbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjonbW9kYWxDdHJsJyxcbiAgICAgICAgLy8gd2luZG93VGVtcGxhdGVVcmw6J2FwcC9zaGFyZWQvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlbW9kYWwuaHRtbCdcbiAgICAgIH0pXG4gICAgfVxuICAgIH1cbiAgfVxuXG59KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnY3JlYXRlU2VydmljZScsY3JlYXRlU2VydmljZSlcblxuZnVuY3Rpb24gY3JlYXRlU2VydmljZSgkaHR0cCwkcSl7XG5cbnRoaXMuY3JlYXRlc2l0ZSA9IGZ1bmN0aW9uKG9iail7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDpcIi9jcmVhdGVzaXRlXCIsXG4gICAgZGF0YTpvYmpcbiAgfSlcbn1cblxuXG50aGlzLmFsZXJ0ID0gZnVuY3Rpb24oKXtzd2FsKHtcbiAgICB0aXRsZTogXCJTaXRlIENyZWF0ZWQhXCIsXG4gICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIiwgXG4gICAgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWVcbiAgfSk7XG5cbiAgICB9XG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ21haW5wYWdlU2VydmljZScsbWFpbnBhZ2VTZXJ2aWNlKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VTZXJ2aWNlKCl7XG5cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
