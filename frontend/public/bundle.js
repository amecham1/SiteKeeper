angular.module('keeperApp', ['ui.router','ui.bootstrap','ngAnimate','satellizer'])
.config(function($stateProvider, $urlRouterProvider, $authProvider) {


    $urlRouterProvider.otherwise('/');

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
    .state('createsite',{
      url:'/createsite',
      templateUrl:'app/components/createsite/createsite.html',
      controller:'createSiteCtrl'
    })
    .state('createsitedays', {
      url: '/days',
      templateUrl: 'app/components/createsite/createsitedays.html',
      controller: 'createSiteCtrl'
    })
    .state('createsitedays.hour',{
      url:'/hours',
      templateUrl:'app/components/createsite/createhours.html',
      controller: 'createSiteCtrl'
    })

    .state('updatesite',{
      url:'/updatesite',
      templateUrl:'app/components/update_site/update_site.html',
      controller:'updateSiteCtrl'
    });






});//end of angular app

angular.module('keeperApp')
.controller('mainCtrl',mainCtrl)

function mainCtrl($scope){

$scope.test="hello"


} //end of controller

angular.module('keeperApp').service('createService', createService);

function createService($http, $q) {
    // this will create the beginning of the site w/o days and hours
    this.createsite = function(obj) {
        return $http({method: "POST", url: "/createsite", data: obj});
        // console.log(obj);
    };
    // this will create the rest of the site -- days and hours
    this.createhours = function(shift) {
        return $http({method: "POST", url: "/scheduledata", data: shift});
        // console.log(shift);
    };
    // this will create an employee
    this.createemployee = function(emp) {
        return $http({method: "POST", url: "/createemployee", data: emp});
    };

    // this makes an alert saying the site has been created
    this.sitealert = function() {
        swal({title: "Site Created!", type: "success", confirmButtonText: "Ok", allowOutsideClick: true});

    };
    // this makes an alert saying that the employee has been created
    this.employeealert = function() {
        swal({title: "Employee Created!", type: "success", confirmButtonText: "Ok", allowOutsideClick: true});

    };

} //end of service

angular.module('keeperApp')
.service('mainpageService',mainpageService);

function mainpageService(){




}//end of service

// angular.module('keeperApp')
// .service('updateService',updateService)
//
// function updateService($http){
//
// // this.updateSite = function(){
// //   return $http({
// //     method:"GET",
// //     url:'/site'
// //   }).then(function(response){
// //     return response.data;
// //   })
// //
// // }
//
//
//
// }//end of service

angular.module('keeperApp').directive('menuDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/menu.html'
      }

})//end of directive

angular.module('keeperApp').controller('createSiteCtrl', createSiteCtrl)

function createSiteCtrl($scope, createService, $state, $log) {

    // Goes from create site to create days also creates the first part of the site
    $scope.next = function(site) {
        $state.go('createsitedays');
        createService.createsite(site).then(function(response){});
    }

    // Opens subview from create days into create hours
    $scope.createhours = function(day) {
        $scope.getDay = day;
        $state.go('createsitedays.hour');
    }
// clock step increases
    $scope.hstep = 1;
    $scope.mstep = 15;
// creates the shift object and then pushes it into the service
    $scope.getTimes = function(shift) {
        for (var prop in shift) {
            shift[prop] = (new Date(shift[prop])).getHours() + ':' + (new Date(shift[prop])).getMinutes()
        }
        shift.name = $scope.getDay;
        createService.createhours(shift).then(function(response){});
    };
// clears all of the clock info
    $scope.clear = function() {
        $scope.shift = null;
    };

} //end of controller

angular.module('keeperApp')
.controller('employee_modalCtrl',employee_modalCtrl)


function employee_modalCtrl($scope,$uibModalInstance,createService){


// 
//   $scope.submit = function(employee){
//     createService.createemployee(employee)
//     .then(function(response){
//     })
//     $uibModalInstance.close(
//       createService.employeealert()
//     );
//   }
//
//
//
// $scope.cancel= function(){
//   $uibModalInstance.dismiss();
// }
//
// $scope.ok=function(){
//   $uibModalInstance.close('Test');
// }

}

angular.module('keeperApp')
.controller('mainpageCtrl',mainpageCtrl);

function mainpageCtrl(){





}//end of mainpageCtrl

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope){



}//end of homeCtrl

angular.module('keeperApp')
.controller('updateSiteCtrl',updateSiteCtrl);


function updateSiteCtrl($scope,updateService){

console.log(updateService.updateSite());

updateService.updateSite()
.then(function(response){
$scope.sites = response;
});






}//end of controller

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwic2hhcmVkL3NlcnZpY2VzL2NyZWF0ZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvbWFpbnBhZ2VTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3VwZGF0ZVNlcnZpY2UuanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVTaXRlQ3RybC5qcyIsInNoYXJlZC9jcmVhdGVfZW1wbG95ZWUvZW1wbG95ZWVfbW9kYWxfY3RybC5qcyIsImNvbXBvbmVudHMvbWFpbi9tYWlucGFnZUN0cmwuanMiLCJjb21wb25lbnRzL3NpZ25pbi9zaWduaW5DdHJsLmpzIiwiY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfc2l0ZUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnLCBbJ3VpLnJvdXRlcicsJ3VpLmJvb3RzdHJhcCcsJ25nQW5pbWF0ZScsJ3NhdGVsbGl6ZXInXSlcbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlcikge1xuXG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnc2lnbmluJyx7XG4gICAgICB1cmw6Jy8nLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9zaWduaW4vc2lnbmluLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ3NpZ25pbkN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21haW5wYWdlJyx7XG4gICAgICB1cmw6Jy9tYWlucGFnZScsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL21haW4vbWFpbnBhZ2UuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnbWFpbnBhZ2VDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlJyx7XG4gICAgICB1cmw6Jy9jcmVhdGVzaXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZXNpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZWRheXMnLCB7XG4gICAgICB1cmw6ICcvZGF5cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZWRheXMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGVkYXlzLmhvdXInLHtcbiAgICAgIHVybDonL2hvdXJzJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZWhvdXJzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG5cbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUnLHtcbiAgICAgIHVybDonL3VwZGF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgfSk7XG5cblxuXG5cblxuXG59KTsvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5zZXJ2aWNlKCdjcmVhdGVTZXJ2aWNlJywgY3JlYXRlU2VydmljZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2UoJGh0dHAsICRxKSB7XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzaXRlIHcvbyBkYXlzIGFuZCBob3Vyc1xuICAgIHRoaXMuY3JlYXRlc2l0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlc2l0ZVwiLCBkYXRhOiBvYmp9KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cob2JqKTtcbiAgICB9O1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgdGhlIHJlc3Qgb2YgdGhlIHNpdGUgLS0gZGF5cyBhbmQgaG91cnNcbiAgICB0aGlzLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oc2hpZnQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL3NjaGVkdWxlZGF0YVwiLCBkYXRhOiBzaGlmdH0pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzaGlmdCk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIGVtcGxveWVlXG4gICAgdGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCkge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZW1wbG95ZWVcIiwgZGF0YTogZW1wfSk7XG4gICAgfTtcblxuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoZSBzaXRlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLnNpdGVhbGVydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2FsKHt0aXRsZTogXCJTaXRlIENyZWF0ZWQhXCIsIHR5cGU6IFwic3VjY2Vzc1wiLCBjb25maXJtQnV0dG9uVGV4dDogXCJPa1wiLCBhbGxvd091dHNpZGVDbGljazogdHJ1ZX0pO1xuXG4gICAgfTtcbiAgICAvLyB0aGlzIG1ha2VzIGFuIGFsZXJ0IHNheWluZyB0aGF0IHRoZSBlbXBsb3llZSBoYXMgYmVlbiBjcmVhdGVkXG4gICAgdGhpcy5lbXBsb3llZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe3RpdGxlOiBcIkVtcGxveWVlIENyZWF0ZWQhXCIsIHR5cGU6IFwic3VjY2Vzc1wiLCBjb25maXJtQnV0dG9uVGV4dDogXCJPa1wiLCBhbGxvd091dHNpZGVDbGljazogdHJ1ZX0pO1xuXG4gICAgfTtcblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdtYWlucGFnZVNlcnZpY2UnLG1haW5wYWdlU2VydmljZSk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlU2VydmljZSgpe1xuXG5cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIiwiLy8gYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4vLyAuc2VydmljZSgndXBkYXRlU2VydmljZScsdXBkYXRlU2VydmljZSlcbi8vXG4vLyBmdW5jdGlvbiB1cGRhdGVTZXJ2aWNlKCRodHRwKXtcbi8vXG4vLyAvLyB0aGlzLnVwZGF0ZVNpdGUgPSBmdW5jdGlvbigpe1xuLy8gLy8gICByZXR1cm4gJGh0dHAoe1xuLy8gLy8gICAgIG1ldGhvZDpcIkdFVFwiLFxuLy8gLy8gICAgIHVybDonL3NpdGUnXG4vLyAvLyAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuLy8gLy8gICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuLy8gLy8gICB9KVxuLy8gLy9cbi8vIC8vIH1cbi8vXG4vL1xuLy9cbi8vIH0vL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnXG4gICAgICB9XG5cbn0pLy9lbmQgb2YgZGlyZWN0aXZlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignY3JlYXRlU2l0ZUN0cmwnLCBjcmVhdGVTaXRlQ3RybClcblxuZnVuY3Rpb24gY3JlYXRlU2l0ZUN0cmwoJHNjb3BlLCBjcmVhdGVTZXJ2aWNlLCAkc3RhdGUsICRsb2cpIHtcblxuICAgIC8vIEdvZXMgZnJvbSBjcmVhdGUgc2l0ZSB0byBjcmVhdGUgZGF5cyBhbHNvIGNyZWF0ZXMgdGhlIGZpcnN0IHBhcnQgb2YgdGhlIHNpdGVcbiAgICAkc2NvcGUubmV4dCA9IGZ1bmN0aW9uKHNpdGUpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdjcmVhdGVzaXRlZGF5cycpO1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUoc2l0ZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7fSk7XG4gICAgfVxuXG4gICAgLy8gT3BlbnMgc3VidmlldyBmcm9tIGNyZWF0ZSBkYXlzIGludG8gY3JlYXRlIGhvdXJzXG4gICAgJHNjb3BlLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oZGF5KSB7XG4gICAgICAgICRzY29wZS5nZXREYXkgPSBkYXk7XG4gICAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMuaG91cicpO1xuICAgIH1cbi8vIGNsb2NrIHN0ZXAgaW5jcmVhc2VzXG4gICAgJHNjb3BlLmhzdGVwID0gMTtcbiAgICAkc2NvcGUubXN0ZXAgPSAxNTtcbi8vIGNyZWF0ZXMgdGhlIHNoaWZ0IG9iamVjdCBhbmQgdGhlbiBwdXNoZXMgaXQgaW50byB0aGUgc2VydmljZVxuICAgICRzY29wZS5nZXRUaW1lcyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc2hpZnQpIHtcbiAgICAgICAgICAgIHNoaWZ0W3Byb3BdID0gKG5ldyBEYXRlKHNoaWZ0W3Byb3BdKSkuZ2V0SG91cnMoKSArICc6JyArIChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldE1pbnV0ZXMoKVxuICAgICAgICB9XG4gICAgICAgIHNoaWZ0Lm5hbWUgPSAkc2NvcGUuZ2V0RGF5O1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWhvdXJzKHNoaWZ0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXt9KTtcbiAgICB9O1xuLy8gY2xlYXJzIGFsbCBvZiB0aGUgY2xvY2sgaW5mb1xuICAgICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuc2hpZnQgPSBudWxsO1xuICAgIH07XG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignZW1wbG95ZWVfbW9kYWxDdHJsJyxlbXBsb3llZV9tb2RhbEN0cmwpXG5cblxuZnVuY3Rpb24gZW1wbG95ZWVfbW9kYWxDdHJsKCRzY29wZSwkdWliTW9kYWxJbnN0YW5jZSxjcmVhdGVTZXJ2aWNlKXtcblxuXG4vLyBcbi8vICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKGVtcGxveWVlKXtcbi8vICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWVtcGxveWVlKGVtcGxveWVlKVxuLy8gICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbi8vICAgICB9KVxuLy8gICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKFxuLy8gICAgICAgY3JlYXRlU2VydmljZS5lbXBsb3llZWFsZXJ0KClcbi8vICAgICApO1xuLy8gICB9XG4vL1xuLy9cbi8vXG4vLyAkc2NvcGUuY2FuY2VsPSBmdW5jdGlvbigpe1xuLy8gICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4vLyB9XG4vL1xuLy8gJHNjb3BlLm9rPWZ1bmN0aW9uKCl7XG4vLyAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCdUZXN0Jyk7XG4vLyB9XG5cbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5wYWdlQ3RybCcsbWFpbnBhZ2VDdHJsKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VDdHJsKCl7XG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2lnbmluQ3RybCcsc2lnbmluQ3RybClcblxuZnVuY3Rpb24gc2lnbmluQ3RybCgkc2NvcGUpe1xuXG5cblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCd1cGRhdGVTaXRlQ3RybCcsdXBkYXRlU2l0ZUN0cmwpO1xuXG5cbmZ1bmN0aW9uIHVwZGF0ZVNpdGVDdHJsKCRzY29wZSx1cGRhdGVTZXJ2aWNlKXtcblxuY29uc29sZS5sb2codXBkYXRlU2VydmljZS51cGRhdGVTaXRlKCkpO1xuXG51cGRhdGVTZXJ2aWNlLnVwZGF0ZVNpdGUoKVxuLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuJHNjb3BlLnNpdGVzID0gcmVzcG9uc2U7XG59KTtcblxuXG5cblxuXG5cbn0vL2VuZCBvZiBjb250cm9sbGVyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
