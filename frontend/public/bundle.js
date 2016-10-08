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
    });






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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJjb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlQ3RybC5qcyIsInNoYXJlZC9tZW51L21lbnUtZGlyZWN0aXZlLmpzIiwic2hhcmVkL3NlcnZpY2VzL2NyZWF0ZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvbWFpbnBhZ2VTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3VwZGF0ZVNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJywgWyd1aS5yb3V0ZXInLCd1aS5ib290c3RyYXAnLCduZ0FuaW1hdGUnLCdzYXRlbGxpemVyJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIpIHtcblxuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ3NpZ25pbicse1xuICAgICAgdXJsOicvJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvc2lnbmluL3NpZ25pbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzaWduaW5DdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtYWlucGFnZScse1xuICAgICAgdXJsOicvbWFpbnBhZ2UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9tYWluL21haW5wYWdlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ21haW5wYWdlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZScse1xuICAgICAgdXJsOicvY3JlYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGVkYXlzJywge1xuICAgICAgdXJsOiAnL2RheXMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZXNpdGVkYXlzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlZGF5cy5ob3VyJyx7XG4gICAgICB1cmw6Jy9ob3VycycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVob3Vycy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgndXBkYXRlc2l0ZScse1xuICAgICAgdXJsOicvdXBkYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL2NyZWF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pO1xuXG5cblxuXG5cblxufSk7Ly9lbmQgb2YgYW5ndWxhciBhcHBcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5DdHJsJyxtYWluQ3RybClcblxuZnVuY3Rpb24gbWFpbkN0cmwoJHNjb3BlKXtcblxuJHNjb3BlLnRlc3Q9XCJoZWxsb1wiXG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignY3JlYXRlU2l0ZUN0cmwnLCBjcmVhdGVTaXRlQ3RybClcblxuZnVuY3Rpb24gY3JlYXRlU2l0ZUN0cmwoJHNjb3BlLCBjcmVhdGVTZXJ2aWNlLCAkc3RhdGUpIHtcblxuICAgIC8vIEdvZXMgZnJvbSBjcmVhdGUgc2l0ZSB0byBjcmVhdGUgZGF5cyBhbHNvIGNyZWF0ZXMgdGhlIGZpcnN0IHBhcnQgb2YgdGhlIHNpdGVcbiAgICAkc2NvcGUubmV4dCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVzaXRlKG5hbWUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5zaXRlSWQgPSByZXNwb25zZS5kYXRhWzBdLnNpdGVfaWQ7XG4gICAgICAgICAgICBjcmVhdGVTZXJ2aWNlLnNpdGU9JHNjb3BlLnNpdGVJZDtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdjcmVhdGVzaXRlZGF5cycpO1xuICAgICAgICAgIH0pO1xuXG4gICAgfVxuICAgIC8vIE9wZW5zIHN1YnZpZXcgZnJvbSBjcmVhdGUgZGF5cyBpbnRvIGNyZWF0ZSBob3Vyc1xuICAgICRzY29wZS5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKGRheSkge1xuICAgICAgICAkc2NvcGUuZ2V0RGF5ID0gZGF5O1xuICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzLmhvdXInKTtcbiAgICB9XG4gICAgLy8gY2xlYXJzIGFsbCBvZiB0aGUgY2xvY2sgaW5mb1xuICAgICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuc2hpZnQgPSBudWxsO1xuICAgIH07XG4gICAgLy8gY2xvY2sgc3RlcCBpbmNyZWFzZXNcbiAgICAkc2NvcGUuaHN0ZXAgPSAxO1xuICAgICRzY29wZS5tc3RlcCA9IDE1O1xuXG4gICAgLy8gY3JlYXRlcyB0aGUgc2hpZnQgb2JqZWN0IGFuZCB0aGVuIHB1c2hlcyBpdCBpbnRvIHRoZSBzZXJ2aWNlXG4gICAgJHNjb3BlLmdldE1vcmVIb3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG5cblxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNoaWZ0KSB7XG4gICAgICAgICAgICBzaGlmdFtwcm9wXSA9IChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldEhvdXJzKCkgKyAnOicgKyAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRNaW51dGVzKClcbiAgICAgICAgfVxuICAgICAgICBzaGlmdC5jb250cmFjdF9kYXkgPSAkc2NvcGUuZ2V0RGF5O1xuICAgICAgICBzaGlmdC5zaXRlSWQgPSBjcmVhdGVTZXJ2aWNlLnNpdGU7XG4gICAgICAgICRzY29wZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAgICAgfTtcblxuXG4gICAgJHNjb3BlLmVtcGxveWVlSWQ7XG4gICAgLy8gY3JlYXRlcyBhbiBlbXBsb3llZSBhbmQgcmV0dXJucyB0aGF0IGlkXG4gICAgJHNjb3BlLmNyZWF0ZUVtcGxveWVlID0gZnVuY3Rpb24oZW1wbG95ZWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVlbXBsb3llZShlbXBsb3llZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5lbXBsb3llZUlkID0gcmVzcG9uc2UuZGF0YVswXS51c2VyX2lkO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnQpe1xuICAgICAgY3JlYXRlU2VydmljZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUuZ2V0VGltZXM9ZnVuY3Rpb24oKXtcbiAgICAgIGNyZWF0ZVNlcnZpY2Uuc2hpZnRzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcbiAgICAgICAgaWYoIXZhbCl7XG4gICAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWhvdXJzKHZhbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgICAgfVxuICAgICAgfSlcblxuICAgIH1cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWlucGFnZUN0cmwnLG1haW5wYWdlQ3RybCk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlQ3RybCgpe1xuXG5cblxuXG5cbn0vL2VuZCBvZiBtYWlucGFnZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ3NpZ25pbkN0cmwnLHNpZ25pbkN0cmwpXG5cbmZ1bmN0aW9uIHNpZ25pbkN0cmwoJHNjb3BlKXtcblxuXG5cbn0vL2VuZCBvZiBob21lQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcigndXBkYXRlU2l0ZUN0cmwnLHVwZGF0ZVNpdGVDdHJsKTtcblxuXG5mdW5jdGlvbiB1cGRhdGVTaXRlQ3RybCgkc2NvcGUsdXBkYXRlU2VydmljZSl7XG5cbmNvbnNvbGUubG9nKHVwZGF0ZVNlcnZpY2UudXBkYXRlU2l0ZSgpKTtcblxudXBkYXRlU2VydmljZS51cGRhdGVTaXRlKClcbi50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiRzY29wZS5zaXRlcyA9IHJlc3BvbnNlO1xufSk7XG5cblxuXG5cblxuXG59Ly9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmRpcmVjdGl2ZSgnbWVudURpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvc2hhcmVkL21lbnUvbWVudS5odG1sJ1xuICAgICAgfVxuXG59KS8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLnNlcnZpY2UoJ2NyZWF0ZVNlcnZpY2UnLCBjcmVhdGVTZXJ2aWNlKTtcblxuZnVuY3Rpb24gY3JlYXRlU2VydmljZSgkaHR0cCwgJHEpIHtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNpdGUgdy9vIGRheXMgYW5kIGhvdXJzXG4gICAgdmFyIHNpdGVJZDtcbiAgICB0aGlzLnNoaWZ0cyA9IFtdO1xuICAgIHRoaXMuc2l0ZTtcbiAgICB0aGlzLmNyZWF0ZXNpdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIHVybDogXCIvY3JlYXRlc2l0ZVwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IG9ialxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIHNpdGVJZCA9IHJlcy5kYXRhWzBdLnNpdGVfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSB0aGUgcmVzdCBvZiB0aGUgc2l0ZSAtLSBkYXlzIGFuZCBob3Vyc1xuICAgIHRoaXMuY3JlYXRlaG91cnMgPSBmdW5jdGlvbihzaGlmdCkge1xuICAgICAgICBjb25zb2xlLmxvZyhzaGlmdCk7XG4gICAgICAgIHNoaWZ0LnNpdGVfaWQgPSBzaXRlSWQ7XG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgdXJsOiBcIi9jcmVhdGVkYXlhbmRob3Vyc1wiLFxuICAgICAgICAgICAgZGF0YTogc2hpZnRcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIGVtcGxveWVlXG4gICAgdmFyIGVtcGxveWVlSWQ7XG4gICAgdGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCkge1xuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jcmVhdGVlbXBsb3llZVwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVtcFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIGVtcGxveWVlSWQgPSByZXMuZGF0YVswXS51c2VyX2lkO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVtcGxveWVlSWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhlIHNpdGUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgdGl0bGU6IFwiU2l0ZSBDcmVhdGVkIVwiLFxuICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJPa1wiLFxuICAgICAgICAgICAgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoYXQgdGhlIGVtcGxveWVlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLmVtcGxveWVlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICB0aXRsZTogXCJFbXBsb3llZSBDcmVhdGVkIVwiLFxuICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJPa1wiLFxuICAgICAgICAgICAgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5hZGR0b1NoaWZ0cyA9IGZ1bmN0aW9uKHNoaWZ0cykge1xuICAgICAgICB0aGlzLnNoaWZ0cy5wdXNoKHNoaWZ0cyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2hpZnRzKTtcblxuICAgIH07XG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbWFpbnBhZ2VTZXJ2aWNlJyxtYWlucGFnZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBtYWlucGFnZVNlcnZpY2UoKXtcblxuXG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiIsIi8vIGFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLy8gLnNlcnZpY2UoJ3VwZGF0ZVNlcnZpY2UnLHVwZGF0ZVNlcnZpY2UpXG4vL1xuLy8gZnVuY3Rpb24gdXBkYXRlU2VydmljZSgkaHR0cCl7XG4vL1xuLy8gLy8gdGhpcy51cGRhdGVTaXRlID0gZnVuY3Rpb24oKXtcbi8vIC8vICAgcmV0dXJuICRodHRwKHtcbi8vIC8vICAgICBtZXRob2Q6XCJHRVRcIixcbi8vIC8vICAgICB1cmw6Jy9zaXRlJ1xuLy8gLy8gICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbi8vIC8vICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbi8vIC8vICAgfSlcbi8vIC8vXG4vLyAvLyB9XG4vL1xuLy9cbi8vXG4vLyB9Ly9lbmQgb2Ygc2VydmljZVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
