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

angular.module('keeperApp')
.controller('mainpageCtrl',mainpageCtrl);

function mainpageCtrl(){





}//end of mainpageCtrl

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope){



}//end of homeCtrl

angular.module('keeperApp').controller('createSiteCtrl', createSiteCtrl)

function createSiteCtrl($scope, createService, $state, $log) {
$scope.siteId;
    // Goes from create site to create days also creates the first part of the site
    $scope.next = function(site) {
        $state.go('createsitedays');
        createService.createsite(site)
        .then(function(response)
        {$scope.siteId = response.data[0].site_id;});

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
        shift.contract_day = $scope.getDay;
        // shift.site_id = siteId;
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

angular.module('keeperApp').service('createService', createService);

function createService($http, $q) {
    // this will create the beginning of the site w/o days and hours
    var siteId;
    this.createsite = function(obj) {
        return $http({method: "POST", url: "/createsite", data: obj})
        .then(function(res){
          siteId = res.data[0].site_id;
          return res;
        });
        // console.log(obj);
    };
    // this will create the rest of the site -- days and hours
    var dayFk;
    this.createhours = function(shift) {
      shift.site_id = siteId;
      shift.contract_days_fk = dayFk;
        return $http({method: "POST", url: "/createdayandhours", data: shift});
        // .then(function(res){
        //   dayFk = res.data[0].cd_id;
        // })
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

angular.module('keeperApp')
.controller('updateSiteCtrl',updateSiteCtrl);


function updateSiteCtrl($scope,updateService){

console.log(updateService.updateSite());

updateService.updateSite()
.then(function(response){
$scope.sites = response;
});






}//end of controller

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJjb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlU2l0ZUN0cmwuanMiLCJzaGFyZWQvY3JlYXRlX2VtcGxveWVlL2VtcGxveWVlX21vZGFsX2N0cmwuanMiLCJzaGFyZWQvc2VydmljZXMvY3JlYXRlU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9tYWlucGFnZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvdXBkYXRlU2VydmljZS5qcyIsInNoYXJlZC9tZW51L21lbnUtZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfc2l0ZUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcsIFsndWkucm91dGVyJywndWkuYm9vdHN0cmFwJywnbmdBbmltYXRlJywnc2F0ZWxsaXplciddKVxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyKSB7XG5cblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdzaWduaW4nLHtcbiAgICAgIHVybDonLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL3NpZ25pbi9zaWduaW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnc2lnbmluQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWFpbnBhZ2UnLHtcbiAgICAgIHVybDonL21haW5wYWdlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvbWFpbi9tYWlucGFnZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdtYWlucGFnZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGUnLHtcbiAgICAgIHVybDonL2NyZWF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlZGF5cycsIHtcbiAgICAgIHVybDogJy9kYXlzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlZGF5cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZWRheXMuaG91cicse1xuICAgICAgdXJsOicvaG91cnMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlaG91cnMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcblxuICAgIC5zdGF0ZSgndXBkYXRlc2l0ZScse1xuICAgICAgdXJsOicvdXBkYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KTtcblxuXG5cblxuXG5cbn0pOy8vZW5kIG9mIGFuZ3VsYXIgYXBwXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWluQ3RybCcsbWFpbkN0cmwpXG5cbmZ1bmN0aW9uIG1haW5DdHJsKCRzY29wZSl7XG5cbiRzY29wZS50ZXN0PVwiaGVsbG9cIlxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbnBhZ2VDdHJsJyxtYWlucGFnZUN0cmwpO1xuXG5mdW5jdGlvbiBtYWlucGFnZUN0cmwoKXtcblxuXG5cblxuXG59Ly9lbmQgb2YgbWFpbnBhZ2VDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdzaWduaW5DdHJsJyxzaWduaW5DdHJsKVxuXG5mdW5jdGlvbiBzaWduaW5DdHJsKCRzY29wZSl7XG5cblxuXG59Ly9lbmQgb2YgaG9tZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdjcmVhdGVTaXRlQ3RybCcsIGNyZWF0ZVNpdGVDdHJsKVxuXG5mdW5jdGlvbiBjcmVhdGVTaXRlQ3RybCgkc2NvcGUsIGNyZWF0ZVNlcnZpY2UsICRzdGF0ZSwgJGxvZykge1xuJHNjb3BlLnNpdGVJZDtcbiAgICAvLyBHb2VzIGZyb20gY3JlYXRlIHNpdGUgdG8gY3JlYXRlIGRheXMgYWxzbyBjcmVhdGVzIHRoZSBmaXJzdCBwYXJ0IG9mIHRoZSBzaXRlXG4gICAgJHNjb3BlLm5leHQgPSBmdW5jdGlvbihzaXRlKSB7XG4gICAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMnKTtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVzaXRlKHNpdGUpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgICAgICB7JHNjb3BlLnNpdGVJZCA9IHJlc3BvbnNlLmRhdGFbMF0uc2l0ZV9pZDt9KTtcblxuICAgIH1cbiAgICAvLyBPcGVucyBzdWJ2aWV3IGZyb20gY3JlYXRlIGRheXMgaW50byBjcmVhdGUgaG91cnNcbiAgICAkc2NvcGUuY3JlYXRlaG91cnMgPSBmdW5jdGlvbihkYXkpIHtcbiAgICAgICAgJHNjb3BlLmdldERheSA9IGRheTtcbiAgICAgICAgJHN0YXRlLmdvKCdjcmVhdGVzaXRlZGF5cy5ob3VyJyk7XG4gICAgfVxuLy8gY2xvY2sgc3RlcCBpbmNyZWFzZXNcbiAgICAkc2NvcGUuaHN0ZXAgPSAxO1xuICAgICRzY29wZS5tc3RlcCA9IDE1O1xuLy8gY3JlYXRlcyB0aGUgc2hpZnQgb2JqZWN0IGFuZCB0aGVuIHB1c2hlcyBpdCBpbnRvIHRoZSBzZXJ2aWNlXG4gICAgJHNjb3BlLmdldFRpbWVzID0gZnVuY3Rpb24oc2hpZnQpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzaGlmdCkge1xuICAgICAgICAgICAgc2hpZnRbcHJvcF0gPSAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRIb3VycygpICsgJzonICsgKG5ldyBEYXRlKHNoaWZ0W3Byb3BdKSkuZ2V0TWludXRlcygpXG4gICAgICAgIH1cbiAgICAgICAgc2hpZnQuY29udHJhY3RfZGF5ID0gJHNjb3BlLmdldERheTtcbiAgICAgICAgLy8gc2hpZnQuc2l0ZV9pZCA9IHNpdGVJZDtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVob3VycyhzaGlmdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7fSk7XG4gICAgfTtcbi8vIGNsZWFycyBhbGwgb2YgdGhlIGNsb2NrIGluZm9cbiAgICAkc2NvcGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnNoaWZ0ID0gbnVsbDtcbiAgICB9O1xuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ2VtcGxveWVlX21vZGFsQ3RybCcsZW1wbG95ZWVfbW9kYWxDdHJsKVxuXG5cbmZ1bmN0aW9uIGVtcGxveWVlX21vZGFsQ3RybCgkc2NvcGUsJHVpYk1vZGFsSW5zdGFuY2UsY3JlYXRlU2VydmljZSl7XG5cblxuLy8gXG4vLyAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbihlbXBsb3llZSl7XG4vLyAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVlbXBsb3llZShlbXBsb3llZSlcbi8vICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4vLyAgICAgfSlcbi8vICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZShcbi8vICAgICAgIGNyZWF0ZVNlcnZpY2UuZW1wbG95ZWVhbGVydCgpXG4vLyAgICAgKTtcbi8vICAgfVxuLy9cbi8vXG4vL1xuLy8gJHNjb3BlLmNhbmNlbD0gZnVuY3Rpb24oKXtcbi8vICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xuLy8gfVxuLy9cbi8vICRzY29wZS5vaz1mdW5jdGlvbigpe1xuLy8gICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgnVGVzdCcpO1xuLy8gfVxuXG59XG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuc2VydmljZSgnY3JlYXRlU2VydmljZScsIGNyZWF0ZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBjcmVhdGVTZXJ2aWNlKCRodHRwLCAkcSkge1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgdGhlIGJlZ2lubmluZyBvZiB0aGUgc2l0ZSB3L28gZGF5cyBhbmQgaG91cnNcbiAgICB2YXIgc2l0ZUlkO1xuICAgIHRoaXMuY3JlYXRlc2l0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlc2l0ZVwiLCBkYXRhOiBvYmp9KVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgIHNpdGVJZCA9IHJlcy5kYXRhWzBdLnNpdGVfaWQ7XG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG9iaik7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSByZXN0IG9mIHRoZSBzaXRlIC0tIGRheXMgYW5kIGhvdXJzXG4gICAgdmFyIGRheUZrO1xuICAgIHRoaXMuY3JlYXRlaG91cnMgPSBmdW5jdGlvbihzaGlmdCkge1xuICAgICAgc2hpZnQuc2l0ZV9pZCA9IHNpdGVJZDtcbiAgICAgIHNoaWZ0LmNvbnRyYWN0X2RheXNfZmsgPSBkYXlGaztcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZWRheWFuZGhvdXJzXCIsIGRhdGE6IHNoaWZ0fSk7XG4gICAgICAgIC8vIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgIC8vICAgZGF5RmsgPSByZXMuZGF0YVswXS5jZF9pZDtcbiAgICAgICAgLy8gfSlcbiAgICB9O1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgYW4gZW1wbG95ZWVcbiAgICB0aGlzLmNyZWF0ZWVtcGxveWVlID0gZnVuY3Rpb24oZW1wKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVlbXBsb3llZVwiLCBkYXRhOiBlbXB9KTtcbiAgICB9O1xuXG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhlIHNpdGUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe3RpdGxlOiBcIlNpdGUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoYXQgdGhlIGVtcGxveWVlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLmVtcGxveWVlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiRW1wbG95ZWUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ21haW5wYWdlU2VydmljZScsbWFpbnBhZ2VTZXJ2aWNlKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VTZXJ2aWNlKCl7XG5cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iLCIvLyBhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi8vIC5zZXJ2aWNlKCd1cGRhdGVTZXJ2aWNlJyx1cGRhdGVTZXJ2aWNlKVxuLy9cbi8vIGZ1bmN0aW9uIHVwZGF0ZVNlcnZpY2UoJGh0dHApe1xuLy9cbi8vIC8vIHRoaXMudXBkYXRlU2l0ZSA9IGZ1bmN0aW9uKCl7XG4vLyAvLyAgIHJldHVybiAkaHR0cCh7XG4vLyAvLyAgICAgbWV0aG9kOlwiR0VUXCIsXG4vLyAvLyAgICAgdXJsOicvc2l0ZSdcbi8vIC8vICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4vLyAvLyAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4vLyAvLyAgIH0pXG4vLyAvL1xuLy8gLy8gfVxuLy9cbi8vXG4vL1xuLy8gfS8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5kaXJlY3RpdmUoJ21lbnVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L21lbnUuaHRtbCdcbiAgICAgIH1cblxufSkvL2VuZCBvZiBkaXJlY3RpdmVcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ3VwZGF0ZVNpdGVDdHJsJyx1cGRhdGVTaXRlQ3RybCk7XG5cblxuZnVuY3Rpb24gdXBkYXRlU2l0ZUN0cmwoJHNjb3BlLHVwZGF0ZVNlcnZpY2Upe1xuXG5jb25zb2xlLmxvZyh1cGRhdGVTZXJ2aWNlLnVwZGF0ZVNpdGUoKSk7XG5cbnVwZGF0ZVNlcnZpY2UudXBkYXRlU2l0ZSgpXG4udGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4kc2NvcGUuc2l0ZXMgPSByZXNwb25zZTtcbn0pO1xuXG5cblxuXG5cblxufS8vZW5kIG9mIGNvbnRyb2xsZXJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
