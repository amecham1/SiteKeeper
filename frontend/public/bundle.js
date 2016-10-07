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

angular.module('keeperApp').controller('createSiteCtrl', createSiteCtrl)

function createSiteCtrl($scope, createService, $state, $log) {

    // Goes from create site to create days also creates the first part of the site
    $scope.next = function(site) {
        $state.go('createsitedays');
        createService.createsite(site).then(function(response){});
        createService.createhours(site).then(function(response){});
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
.controller('mainpageCtrl',mainpageCtrl);

function mainpageCtrl(){





}//end of mainpageCtrl

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope){



}//end of homeCtrl

angular.module('keeperApp').directive('menuDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/menu.html'
      }

})//end of directive

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

angular.module('keeperApp')
.controller('updateSiteCtrl',updateSiteCtrl);


function updateSiteCtrl($scope,updateService){

console.log(updateService.updateSite());

updateService.updateSite()
.then(function(response){
$scope.sites = response;
});






}//end of controller

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9jcmVhdGVTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL21haW5wYWdlU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy91cGRhdGVTZXJ2aWNlLmpzIiwiY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfc2l0ZUN0cmwuanMiLCJzaGFyZWQvY3JlYXRlX2VtcGxveWVlL2VtcGxveWVlX21vZGFsX2N0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcsIFsndWkucm91dGVyJywndWkuYm9vdHN0cmFwJywnbmdBbmltYXRlJywnc2F0ZWxsaXplciddKVxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyKSB7XG5cblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdzaWduaW4nLHtcbiAgICAgIHVybDonLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL3NpZ25pbi9zaWduaW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnc2lnbmluQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWFpbnBhZ2UnLHtcbiAgICAgIHVybDonL21haW5wYWdlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvbWFpbi9tYWlucGFnZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdtYWlucGFnZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGUnLHtcbiAgICAgIHVybDonL2NyZWF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlZGF5cycsIHtcbiAgICAgIHVybDogJy9kYXlzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlZGF5cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZWRheXMuaG91cicse1xuICAgICAgdXJsOicvaG91cnMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlaG91cnMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcblxuICAgIC5zdGF0ZSgndXBkYXRlc2l0ZScse1xuICAgICAgdXJsOicvdXBkYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KTtcblxuXG5cblxuXG5cbn0pOy8vZW5kIG9mIGFuZ3VsYXIgYXBwXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWluQ3RybCcsbWFpbkN0cmwpXG5cbmZ1bmN0aW9uIG1haW5DdHJsKCRzY29wZSl7XG5cbiRzY29wZS50ZXN0PVwiaGVsbG9cIlxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ2NyZWF0ZVNpdGVDdHJsJywgY3JlYXRlU2l0ZUN0cmwpXG5cbmZ1bmN0aW9uIGNyZWF0ZVNpdGVDdHJsKCRzY29wZSwgY3JlYXRlU2VydmljZSwgJHN0YXRlLCAkbG9nKSB7XG5cbiAgICAvLyBHb2VzIGZyb20gY3JlYXRlIHNpdGUgdG8gY3JlYXRlIGRheXMgYWxzbyBjcmVhdGVzIHRoZSBmaXJzdCBwYXJ0IG9mIHRoZSBzaXRlXG4gICAgJHNjb3BlLm5leHQgPSBmdW5jdGlvbihzaXRlKSB7XG4gICAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMnKTtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVzaXRlKHNpdGUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe30pO1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWhvdXJzKHNpdGUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe30pO1xuICAgIH1cblxuICAgIC8vIE9wZW5zIHN1YnZpZXcgZnJvbSBjcmVhdGUgZGF5cyBpbnRvIGNyZWF0ZSBob3Vyc1xuICAgICRzY29wZS5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKGRheSkge1xuICAgICAgICAkc2NvcGUuZ2V0RGF5ID0gZGF5O1xuICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzLmhvdXInKTtcbiAgICB9XG4vLyBjbG9jayBzdGVwIGluY3JlYXNlc1xuICAgICRzY29wZS5oc3RlcCA9IDE7XG4gICAgJHNjb3BlLm1zdGVwID0gMTU7XG4vLyBjcmVhdGVzIHRoZSBzaGlmdCBvYmplY3QgYW5kIHRoZW4gcHVzaGVzIGl0IGludG8gdGhlIHNlcnZpY2VcbiAgICAkc2NvcGUuZ2V0VGltZXMgPSBmdW5jdGlvbihzaGlmdCkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNoaWZ0KSB7XG4gICAgICAgICAgICBzaGlmdFtwcm9wXSA9IChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldEhvdXJzKCkgKyAnOicgKyAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRNaW51dGVzKClcbiAgICAgICAgfVxuICAgICAgICBzaGlmdC5uYW1lID0gJHNjb3BlLmdldERheTtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVob3VycyhzaGlmdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7fSk7XG4gICAgfTtcbi8vIGNsZWFycyBhbGwgb2YgdGhlIGNsb2NrIGluZm9cbiAgICAkc2NvcGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnNoaWZ0ID0gbnVsbDtcbiAgICB9O1xuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5wYWdlQ3RybCcsbWFpbnBhZ2VDdHJsKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VDdHJsKCl7XG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2lnbmluQ3RybCcsc2lnbmluQ3RybClcblxuZnVuY3Rpb24gc2lnbmluQ3RybCgkc2NvcGUpe1xuXG5cblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnXG4gICAgICB9XG5cbn0pLy9lbmQgb2YgZGlyZWN0aXZlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuc2VydmljZSgnY3JlYXRlU2VydmljZScsIGNyZWF0ZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBjcmVhdGVTZXJ2aWNlKCRodHRwLCAkcSkge1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgdGhlIGJlZ2lubmluZyBvZiB0aGUgc2l0ZSB3L28gZGF5cyBhbmQgaG91cnNcbiAgICB0aGlzLmNyZWF0ZXNpdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZXNpdGVcIiwgZGF0YTogb2JqfSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG9iaik7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSByZXN0IG9mIHRoZSBzaXRlIC0tIGRheXMgYW5kIGhvdXJzXG4gICAgdGhpcy5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9zY2hlZHVsZWRhdGFcIiwgZGF0YTogc2hpZnR9KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc2hpZnQpO1xuICAgIH07XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSBhbiBlbXBsb3llZVxuICAgIHRoaXMuY3JlYXRlZW1wbG95ZWUgPSBmdW5jdGlvbihlbXApIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZWVtcGxveWVlXCIsIGRhdGE6IGVtcH0pO1xuICAgIH07XG5cbiAgICAvLyB0aGlzIG1ha2VzIGFuIGFsZXJ0IHNheWluZyB0aGUgc2l0ZSBoYXMgYmVlbiBjcmVhdGVkXG4gICAgdGhpcy5zaXRlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiU2l0ZSBDcmVhdGVkIVwiLCB0eXBlOiBcInN1Y2Nlc3NcIiwgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIiwgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWV9KTtcblxuICAgIH07XG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhhdCB0aGUgZW1wbG95ZWUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuZW1wbG95ZWVhbGVydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2FsKHt0aXRsZTogXCJFbXBsb3llZSBDcmVhdGVkIVwiLCB0eXBlOiBcInN1Y2Nlc3NcIiwgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIiwgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWV9KTtcblxuICAgIH07XG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbWFpbnBhZ2VTZXJ2aWNlJyxtYWlucGFnZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBtYWlucGFnZVNlcnZpY2UoKXtcblxuXG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiIsIi8vIGFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLy8gLnNlcnZpY2UoJ3VwZGF0ZVNlcnZpY2UnLHVwZGF0ZVNlcnZpY2UpXG4vL1xuLy8gZnVuY3Rpb24gdXBkYXRlU2VydmljZSgkaHR0cCl7XG4vL1xuLy8gLy8gdGhpcy51cGRhdGVTaXRlID0gZnVuY3Rpb24oKXtcbi8vIC8vICAgcmV0dXJuICRodHRwKHtcbi8vIC8vICAgICBtZXRob2Q6XCJHRVRcIixcbi8vIC8vICAgICB1cmw6Jy9zaXRlJ1xuLy8gLy8gICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbi8vIC8vICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbi8vIC8vICAgfSlcbi8vIC8vXG4vLyAvLyB9XG4vL1xuLy9cbi8vXG4vLyB9Ly9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcigndXBkYXRlU2l0ZUN0cmwnLHVwZGF0ZVNpdGVDdHJsKTtcblxuXG5mdW5jdGlvbiB1cGRhdGVTaXRlQ3RybCgkc2NvcGUsdXBkYXRlU2VydmljZSl7XG5cbmNvbnNvbGUubG9nKHVwZGF0ZVNlcnZpY2UudXBkYXRlU2l0ZSgpKTtcblxudXBkYXRlU2VydmljZS51cGRhdGVTaXRlKClcbi50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiRzY29wZS5zaXRlcyA9IHJlc3BvbnNlO1xufSk7XG5cblxuXG5cblxuXG59Ly9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignZW1wbG95ZWVfbW9kYWxDdHJsJyxlbXBsb3llZV9tb2RhbEN0cmwpXG5cblxuZnVuY3Rpb24gZW1wbG95ZWVfbW9kYWxDdHJsKCRzY29wZSwkdWliTW9kYWxJbnN0YW5jZSxjcmVhdGVTZXJ2aWNlKXtcblxuXG4vLyBcbi8vICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKGVtcGxveWVlKXtcbi8vICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWVtcGxveWVlKGVtcGxveWVlKVxuLy8gICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbi8vICAgICB9KVxuLy8gICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKFxuLy8gICAgICAgY3JlYXRlU2VydmljZS5lbXBsb3llZWFsZXJ0KClcbi8vICAgICApO1xuLy8gICB9XG4vL1xuLy9cbi8vXG4vLyAkc2NvcGUuY2FuY2VsPSBmdW5jdGlvbigpe1xuLy8gICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4vLyB9XG4vL1xuLy8gJHNjb3BlLm9rPWZ1bmN0aW9uKCl7XG4vLyAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCdUZXN0Jyk7XG4vLyB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
