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
    })
    .state('createemployee',{
      url:'/createemployee',
      templateUrl:'app/components/createsite/create_employee.html',
      controller:'createSiteCtrl'
    })
    .state('schedule',{
      url:'/schedulesites',
      templateUrl:'app/components/schedule/schedule.html',
      controller:'scheduleCtrl'
    })
    .state('schedule.selectshift',{
      url:'/scheduleshifts',
      templateUrl:'app/components/schedule/scheduleshifts.html',
      controller:'scheduleCtrl'
    })






});//end of angular app

angular.module('keeperApp')
.controller('mainCtrl',mainCtrl)

function mainCtrl($scope){

$scope.test="hello"


} //end of controller

angular.module('keeperApp').controller('createSiteCtrl', createSiteCtrl)

function createSiteCtrl($scope, createService, $state) {

    // Goes from create site to create days also creates the first part of the site
    $scope.next = function(name) {
        createService.createsite(name).then(function(response) {
            $scope.siteId = response.data[0].site_id;
            createService.site=$scope.siteId;
              $state.go('createsitedays');
          });

    }
    // Opens subview from create days into create hours
    $scope.createhours = function(day) {
        $scope.getDay = day;
        $state.go('createsitedays.hour');
    }
    // clears all of the clock info
    $scope.clear = function() {
        $scope.shift = null;
    };
    // clock step increases
    $scope.hstep = 1;
    $scope.mstep = 15;

    // creates the shift object and then pushes it into the service
    $scope.getMoreHours = function(shift) {


        for (var prop in shift) {
            shift[prop] = (new Date(shift[prop])).getHours() + ':' + (new Date(shift[prop])).getMinutes()
        }
        shift.contract_day = $scope.getDay;
        shift.siteId = createService.site;
        shift.site_id_fk = createService.site;
        $scope.addtoShifts(shift);
          };


    $scope.employeeId;
    // creates an employee and returns that id
    $scope.createEmployee = function(employee) {
        createService.createemployee(employee).then(function(response) {
          $scope.employeeId = response.data[0].user_id;

        })
    }

    $scope.addtoShifts = function(shift){
      createService.addtoShifts(shift);
      $state.go('createsitedays');
    }


    $scope.getTimes=function(){
      createService.shifts.forEach(function(val){
        console.log(val);
        if(!val){
          val = null;
        }
        else{
        createService.createhours(val).then(function(response) {});
      }
      })

    }

} //end of controller

angular.module('keeperApp')
.controller('mainpageCtrl',mainpageCtrl);

function mainpageCtrl(){





}//end of mainpageCtrl

angular.module('keeperApp')
.controller('scheduleCtrl',scheduleCtrl)

function scheduleCtrl($scope,overviewService, $state){



var siteArray = [];

overviewService.overViewSites()
.then(function(res){

var siteObj = res.data;

var currentName;
var titles = []
$scope.siteoverview = res.data;
$scope.showSites = true;


});


$scope.scheduleShift = function(idNum){
  $scope.showSites = false;


  overviewService.showHours(idNum.site_id)
  .then(function(res){
    $scope.hours = res.data;
    console.log(res.data);
  })

  $state.go('schedule.selectshift')
}







}//end of controller

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

angular.module('keeperApp').directive('menuDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/menu.html'
      }

})//end of directive

angular.module('keeperApp').service('createService', createService);

function createService($http, $q) {
    // this will create the beginning of the site w/o days and hours
    var siteId;
    this.shifts = [];
    this.site;
    this.createsite = function(obj) {
        return $http({
                method: "POST",
                url: "/createsite",
                data: obj
            })
            .then(function(res) {
                siteId = res.data[0].site_id;
                return res;
            });
    };
    // this will create the rest of the site -- days and hours
    this.createhours = function(shift) {
        console.log(shift);
        shift.site_id = siteId;
        return $http({
            method: "POST",
            url: "/createdayandhours",
            data: shift
        });
    };
    // this will create an employee
    var employeeId;
    this.createemployee = function(emp) {
        return $http({
                method: "POST",
                url: "/createemployee",
                data: emp
            })
            .then(function(res) {
                employeeId = res.data[0].user_id;
                console.log(employeeId);
                return res;
            });
    };

    // this makes an alert saying the site has been created
    this.sitealert = function() {
        swal({
            title: "Site Created!",
            type: "success",
            confirmButtonText: "Ok",
            allowOutsideClick: true
        });

    };
    // this makes an alert saying that the employee has been created
    this.employeealert = function() {
        swal({
            title: "Employee Created!",
            type: "success",
            confirmButtonText: "Ok",
            allowOutsideClick: true
        });

    };

    this.addtoShifts = function(shifts) {
        this.shifts.push(shifts);
        // console.log(this.shifts);

    };

} //end of service

angular.module('keeperApp')
.service('mainpageService',mainpageService);

function mainpageService(){




}//end of service

angular.module('keeperApp')
.service('overviewService',overviewService)

function overviewService($http){

this.overViewSites = function(){
  return $http({
    method:"GET",
    url:"/scheduleoverview"
  })
}

this.showDays = function(idNum){
  return $http({
    method:"GET",
    url:"/scheduleDays/" + idNum
  })
}

this.showHours = function(idNum){
  return $http({
    method:"GET",
    url: "/scheduleHours/" + idNum
  })
}



} //end of service

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVDdHJsLmpzIiwiY29tcG9uZW50cy9zaWduaW4vc2lnbmluQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGVDdHJsLmpzIiwic2hhcmVkL21lbnUvbWVudS1kaXJlY3RpdmUuanMiLCJzaGFyZWQvc2VydmljZXMvY3JlYXRlU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9tYWlucGFnZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvb3ZlcnZpZXdTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3VwZGF0ZVNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcsIFsndWkucm91dGVyJywndWkuYm9vdHN0cmFwJywnbmdBbmltYXRlJywnc2F0ZWxsaXplciddKVxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyKSB7XG5cblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdzaWduaW4nLHtcbiAgICAgIHVybDonLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL3NpZ25pbi9zaWduaW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnc2lnbmluQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWFpbnBhZ2UnLHtcbiAgICAgIHVybDonL21haW5wYWdlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvbWFpbi9tYWlucGFnZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdtYWlucGFnZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGUnLHtcbiAgICAgIHVybDonL2NyZWF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlZGF5cycsIHtcbiAgICAgIHVybDogJy9kYXlzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlZGF5cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZWRheXMuaG91cicse1xuICAgICAgdXJsOicvaG91cnMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlaG91cnMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUnLHtcbiAgICAgIHVybDonL3VwZGF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy9jcmVhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2NoZWR1bGUnLHtcbiAgICAgIHVybDonL3NjaGVkdWxlc2l0ZXMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonc2NoZWR1bGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzY2hlZHVsZS5zZWxlY3RzaGlmdCcse1xuICAgICAgdXJsOicvc2NoZWR1bGVzaGlmdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlc2hpZnRzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonc2NoZWR1bGVDdHJsJ1xuICAgIH0pXG5cblxuXG5cblxuXG59KTsvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdjcmVhdGVTaXRlQ3RybCcsIGNyZWF0ZVNpdGVDdHJsKVxuXG5mdW5jdGlvbiBjcmVhdGVTaXRlQ3RybCgkc2NvcGUsIGNyZWF0ZVNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gR29lcyBmcm9tIGNyZWF0ZSBzaXRlIHRvIGNyZWF0ZSBkYXlzIGFsc28gY3JlYXRlcyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgc2l0ZVxuICAgICRzY29wZS5uZXh0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUobmFtZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLnNpdGVJZCA9IHJlc3BvbnNlLmRhdGFbMF0uc2l0ZV9pZDtcbiAgICAgICAgICAgIGNyZWF0ZVNlcnZpY2Uuc2l0ZT0kc2NvcGUuc2l0ZUlkO1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgLy8gT3BlbnMgc3VidmlldyBmcm9tIGNyZWF0ZSBkYXlzIGludG8gY3JlYXRlIGhvdXJzXG4gICAgJHNjb3BlLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oZGF5KSB7XG4gICAgICAgICRzY29wZS5nZXREYXkgPSBkYXk7XG4gICAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMuaG91cicpO1xuICAgIH1cbiAgICAvLyBjbGVhcnMgYWxsIG9mIHRoZSBjbG9jayBpbmZvXG4gICAgJHNjb3BlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5zaGlmdCA9IG51bGw7XG4gICAgfTtcbiAgICAvLyBjbG9jayBzdGVwIGluY3JlYXNlc1xuICAgICRzY29wZS5oc3RlcCA9IDE7XG4gICAgJHNjb3BlLm1zdGVwID0gMTU7XG5cbiAgICAvLyBjcmVhdGVzIHRoZSBzaGlmdCBvYmplY3QgYW5kIHRoZW4gcHVzaGVzIGl0IGludG8gdGhlIHNlcnZpY2VcbiAgICAkc2NvcGUuZ2V0TW9yZUhvdXJzID0gZnVuY3Rpb24oc2hpZnQpIHtcblxuXG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc2hpZnQpIHtcbiAgICAgICAgICAgIHNoaWZ0W3Byb3BdID0gKG5ldyBEYXRlKHNoaWZ0W3Byb3BdKSkuZ2V0SG91cnMoKSArICc6JyArIChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldE1pbnV0ZXMoKVxuICAgICAgICB9XG4gICAgICAgIHNoaWZ0LmNvbnRyYWN0X2RheSA9ICRzY29wZS5nZXREYXk7XG4gICAgICAgIHNoaWZ0LnNpdGVJZCA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZF9mayA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcbiAgICAgICAgJHNjb3BlLmFkZHRvU2hpZnRzKHNoaWZ0KTtcbiAgICAgICAgICB9O1xuXG5cbiAgICAkc2NvcGUuZW1wbG95ZWVJZDtcbiAgICAvLyBjcmVhdGVzIGFuIGVtcGxveWVlIGFuZCByZXR1cm5zIHRoYXQgaWRcbiAgICAkc2NvcGUuY3JlYXRlRW1wbG95ZWUgPSBmdW5jdGlvbihlbXBsb3llZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWVtcGxveWVlKGVtcGxveWVlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLmVtcGxveWVlSWQgPSByZXNwb25zZS5kYXRhWzBdLnVzZXJfaWQ7XG5cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAkc2NvcGUuYWRkdG9TaGlmdHMgPSBmdW5jdGlvbihzaGlmdCl7XG4gICAgICBjcmVhdGVTZXJ2aWNlLmFkZHRvU2hpZnRzKHNoaWZ0KTtcbiAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMnKTtcbiAgICB9XG5cblxuICAgICRzY29wZS5nZXRUaW1lcz1mdW5jdGlvbigpe1xuICAgICAgY3JlYXRlU2VydmljZS5zaGlmdHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICBjb25zb2xlLmxvZyh2YWwpO1xuICAgICAgICBpZighdmFsKXtcbiAgICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlaG91cnModmFsKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgICB9XG4gICAgICB9KVxuXG4gICAgfVxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5wYWdlQ3RybCcsbWFpbnBhZ2VDdHJsKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VDdHJsKCl7XG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2NoZWR1bGVDdHJsJyxzY2hlZHVsZUN0cmwpXG5cbmZ1bmN0aW9uIHNjaGVkdWxlQ3RybCgkc2NvcGUsb3ZlcnZpZXdTZXJ2aWNlLCAkc3RhdGUpe1xuXG5cblxudmFyIHNpdGVBcnJheSA9IFtdO1xuXG5vdmVydmlld1NlcnZpY2Uub3ZlclZpZXdTaXRlcygpXG4udGhlbihmdW5jdGlvbihyZXMpe1xuXG52YXIgc2l0ZU9iaiA9IHJlcy5kYXRhO1xuXG52YXIgY3VycmVudE5hbWU7XG52YXIgdGl0bGVzID0gW11cbiRzY29wZS5zaXRlb3ZlcnZpZXcgPSByZXMuZGF0YTtcbiRzY29wZS5zaG93U2l0ZXMgPSB0cnVlO1xuXG5cbn0pO1xuXG5cbiRzY29wZS5zY2hlZHVsZVNoaWZ0ID0gZnVuY3Rpb24oaWROdW0pe1xuICAkc2NvcGUuc2hvd1NpdGVzID0gZmFsc2U7XG5cblxuICBvdmVydmlld1NlcnZpY2Uuc2hvd0hvdXJzKGlkTnVtLnNpdGVfaWQpXG4gIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgJHNjb3BlLmhvdXJzID0gcmVzLmRhdGE7XG4gICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICB9KVxuXG4gICRzdGF0ZS5nbygnc2NoZWR1bGUuc2VsZWN0c2hpZnQnKVxufVxuXG5cblxuXG5cblxuXG59Ly9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2lnbmluQ3RybCcsc2lnbmluQ3RybClcblxuZnVuY3Rpb24gc2lnbmluQ3RybCgkc2NvcGUpe1xuXG5cblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCd1cGRhdGVTaXRlQ3RybCcsdXBkYXRlU2l0ZUN0cmwpO1xuXG5cbmZ1bmN0aW9uIHVwZGF0ZVNpdGVDdHJsKCRzY29wZSx1cGRhdGVTZXJ2aWNlKXtcblxuY29uc29sZS5sb2codXBkYXRlU2VydmljZS51cGRhdGVTaXRlKCkpO1xuXG51cGRhdGVTZXJ2aWNlLnVwZGF0ZVNpdGUoKVxuLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuJHNjb3BlLnNpdGVzID0gcmVzcG9uc2U7XG59KTtcblxuXG5cblxuXG5cbn0vL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnXG4gICAgICB9XG5cbn0pLy9lbmQgb2YgZGlyZWN0aXZlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuc2VydmljZSgnY3JlYXRlU2VydmljZScsIGNyZWF0ZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBjcmVhdGVTZXJ2aWNlKCRodHRwLCAkcSkge1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgdGhlIGJlZ2lubmluZyBvZiB0aGUgc2l0ZSB3L28gZGF5cyBhbmQgaG91cnNcbiAgICB2YXIgc2l0ZUlkO1xuICAgIHRoaXMuc2hpZnRzID0gW107XG4gICAgdGhpcy5zaXRlO1xuICAgIHRoaXMuY3JlYXRlc2l0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jcmVhdGVzaXRlXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogb2JqXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgc2l0ZUlkID0gcmVzLmRhdGFbMF0uc2l0ZV9pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSByZXN0IG9mIHRoZSBzaXRlIC0tIGRheXMgYW5kIGhvdXJzXG4gICAgdGhpcy5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNoaWZ0KTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZCA9IHNpdGVJZDtcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICB1cmw6IFwiL2NyZWF0ZWRheWFuZGhvdXJzXCIsXG4gICAgICAgICAgICBkYXRhOiBzaGlmdFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgYW4gZW1wbG95ZWVcbiAgICB2YXIgZW1wbG95ZWVJZDtcbiAgICB0aGlzLmNyZWF0ZWVtcGxveWVlID0gZnVuY3Rpb24oZW1wKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NyZWF0ZWVtcGxveWVlXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZW1wXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgZW1wbG95ZWVJZCA9IHJlcy5kYXRhWzBdLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZW1wbG95ZWVJZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyB0aGlzIG1ha2VzIGFuIGFsZXJ0IHNheWluZyB0aGUgc2l0ZSBoYXMgYmVlbiBjcmVhdGVkXG4gICAgdGhpcy5zaXRlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICB0aXRsZTogXCJTaXRlIENyZWF0ZWQhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsXG4gICAgICAgICAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgIH07XG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhhdCB0aGUgZW1wbG95ZWUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuZW1wbG95ZWVhbGVydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgIHRpdGxlOiBcIkVtcGxveWVlIENyZWF0ZWQhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsXG4gICAgICAgICAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICB0aGlzLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnRzKSB7XG4gICAgICAgIHRoaXMuc2hpZnRzLnB1c2goc2hpZnRzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zaGlmdHMpO1xuXG4gICAgfTtcblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdtYWlucGFnZVNlcnZpY2UnLG1haW5wYWdlU2VydmljZSk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlU2VydmljZSgpe1xuXG5cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnb3ZlcnZpZXdTZXJ2aWNlJyxvdmVydmlld1NlcnZpY2UpXG5cbmZ1bmN0aW9uIG92ZXJ2aWV3U2VydmljZSgkaHR0cCl7XG5cbnRoaXMub3ZlclZpZXdTaXRlcyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL3NjaGVkdWxlb3ZlcnZpZXdcIlxuICB9KVxufVxuXG50aGlzLnNob3dEYXlzID0gZnVuY3Rpb24oaWROdW0pe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9zY2hlZHVsZURheXMvXCIgKyBpZE51bVxuICB9KVxufVxuXG50aGlzLnNob3dIb3VycyA9IGZ1bmN0aW9uKGlkTnVtKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6IFwiL3NjaGVkdWxlSG91cnMvXCIgKyBpZE51bVxuICB9KVxufVxuXG5cblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCIvLyBhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi8vIC5zZXJ2aWNlKCd1cGRhdGVTZXJ2aWNlJyx1cGRhdGVTZXJ2aWNlKVxuLy9cbi8vIGZ1bmN0aW9uIHVwZGF0ZVNlcnZpY2UoJGh0dHApe1xuLy9cbi8vIC8vIHRoaXMudXBkYXRlU2l0ZSA9IGZ1bmN0aW9uKCl7XG4vLyAvLyAgIHJldHVybiAkaHR0cCh7XG4vLyAvLyAgICAgbWV0aG9kOlwiR0VUXCIsXG4vLyAvLyAgICAgdXJsOicvc2l0ZSdcbi8vIC8vICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4vLyAvLyAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4vLyAvLyAgIH0pXG4vLyAvL1xuLy8gLy8gfVxuLy9cbi8vXG4vL1xuLy8gfS8vZW5kIG9mIHNlcnZpY2VcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
