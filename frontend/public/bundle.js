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
    .state('updateemployee',{
      url:'/updateemployee',
      templateUrl:'app/components/update_site/update_employee.html',
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
    .state('updatesite',{
      url:'/updatesite',
      templateUrl:'app/components/update_site/update_site.html',
      controller:'updateSiteCtrl'
    })
    .state('updatesite.updatefullsite',{
      url:'/fullsiteupdate',
      templateUrl:'app/components/update_site/update_fullsite.html',
      controller:'updateSiteCtrl'
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
.controller('updateSiteCtrl',updateSiteCtrl);


function updateSiteCtrl($scope,updateService,$state,$filter){
$scope.showupdate = true;
updateService.updateSite()
.then(function(response){
  // console.log(response.data);
$scope.updatesites = response.data;
});
$scope.checkNull = true;
$scope.updateSite = function(siteview){
  $scope.showupdate = false;
updateService.allSiteInfo(siteview.site_id)
.then(function(res){
  // console.log(res.data);
  $scope.siteupdate = res.data.site[0];
  $scope.begintimechange = res.data.site[0].contract_begin
  $scope.endtimechange = res.data.site[0].contract_begin
  $scope.site_begin = $filter('date')($scope.begintimechange);
  $scope.site_end = $filter('date')($scope.endtimechange);
  $scope.checkForNull = res.data.hoursandsite;
  $scope.times = res.data.hoursandsite;

})
$state.go('updatesite.updatefullsite')

}





}//end of controller

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope){



}//end of homeCtrl

angular.module('keeperApp').service('createService', createService);

function createService($http, $q) {
    // this will create the beginning of the site w/o days and hours
    var siteId;
    this.shifts = [];
    this.site;
    this.createsite = function(obj) {
        return $http({method: "POST", url: "/createsite", data: obj}).then(function(res) {
            siteId = res.data[0].site_id;
            return res;
        });
    };
    // this will create the rest of the site -- days and hours
    this.createhours = function(shift) {
        console.log(shift);
        shift.site_id = siteId;
        return $http({method: "POST", url: "/createdayandhours", data: shift});
    };
    // this will create an employee
    var employeeId;
    this.createemployee = function(emp) {
        return $http({method: "POST", url: "/createemployee", data: emp}).then(function(res) {
            employeeId = res.data[0].user_id;
            console.log(employeeId);
            return res;
        });
    };

    // this makes an alert saying the site has been created
    this.sitealert = function() {
        swal({title: "Site Created!", type: "success", confirmButtonText: "Ok", allowOutsideClick: true});

    };
    // this makes an alert saying that the employee has been created
    this.employeealert = function() {
        swal({title: "Employee Created!", type: "success", confirmButtonText: "Ok", allowOutsideClick: true});

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
    url:"/siteoverview"
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

this.employeeSchedule = function(scheduleShift){
  return $http({
    method:"POST",
    url:"/employeeschedule",
    data:scheduleShift
  })
}


} //end of service

angular.module('keeperApp')
.service('updateService',updateService)

function updateService($http){

this.updateSite = function(){
  return $http({
    method:"GET",
    url:'/siteoverview'
  })
}

this.allSiteInfo = function(siteId){
  return $http({
    method:"GET",
    url:'/getsiteandhours/' + siteId
  })
}



}//end of service

angular.module('keeperApp').controller('scheduleCtrl', scheduleCtrl)

function scheduleCtrl($scope, overviewService, $state,createService) {

    var siteArray = [];

    overviewService.overViewSites().then(function(res) {

        var siteObj = res.data;

        var currentName;
        var titles = []
        $scope.siteoverview = res.data;
        $scope.showSites = true;

    });
// function will hide sites and then bring in site info
    $scope.scheduleShift = function(idNum) {
        $scope.showSites = false;

        overviewService.showHours(idNum.site_id)
        .then(function(res) {
          $scope.hours = res.data;
            $scope.shifts = res.data;

        })
        $state.go('schedule.selectshift')
    }

    var selectedShifts = [];
    $scope.addShiftNum = function(contractId, shiftNum) {
      // console.log($scope.shifts[0]);
      // console.log($scope.shifts[0].site_id_fk);
      if(shiftNum) {
        selectedShifts.push({
          shift_num: shiftNum,
          contract_time_fk: contractId,
          site_id_fk: $scope.shifts[0].site_id_fk
        })
      }
      else{
        var index = selectedShifts.map(function(val){
          return val.contract_time_fk;
        }).indexOf(contractId);

        selectedShifts.splice(index,1);
      }
    }



$scope.submitEmpShifts = function(){
  console.log(selectedShifts);
  selectedShifts.forEach(function(val){
    console.log('hello');
    overviewService.employeeSchedule(val)
  .then(function(response){
  })

  })

  selectedShifts = [];
  console.log(selectedShifts);
}



} //end of controller

angular.module('keeperApp').directive('menuDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/menu.html'
      }

})//end of directive

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9zaWduaW4vc2lnbmluQ3RybC5qcyIsInNoYXJlZC9zZXJ2aWNlcy9jcmVhdGVTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL21haW5wYWdlU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9vdmVydmlld1NlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvdXBkYXRlU2VydmljZS5qcyIsImNvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVDdHJsLmpzIiwic2hhcmVkL21lbnUvbWVudS1kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJywgWyd1aS5yb3V0ZXInLCd1aS5ib290c3RyYXAnLCduZ0FuaW1hdGUnLCdzYXRlbGxpemVyJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIpIHtcblxuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ3NpZ25pbicse1xuICAgICAgdXJsOicvJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvc2lnbmluL3NpZ25pbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzaWduaW5DdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtYWlucGFnZScse1xuICAgICAgdXJsOicvbWFpbnBhZ2UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9tYWluL21haW5wYWdlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ21haW5wYWdlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZScse1xuICAgICAgdXJsOicvY3JlYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGVkYXlzJywge1xuICAgICAgdXJsOiAnL2RheXMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZXNpdGVkYXlzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlZGF5cy5ob3VyJyx7XG4gICAgICB1cmw6Jy9ob3VycycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVob3Vycy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgndXBkYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL3VwZGF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL2NyZWF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzY2hlZHVsZScse1xuICAgICAgdXJsOicvc2NoZWR1bGVzaXRlcycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3NjaGVkdWxlLnNlbGVjdHNoaWZ0Jyx7XG4gICAgICB1cmw6Jy9zY2hlZHVsZXNoaWZ0cycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVzaGlmdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUnLHtcbiAgICAgIHVybDonL3VwZGF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUudXBkYXRlZnVsbHNpdGUnLHtcbiAgICAgIHVybDonL2Z1bGxzaXRldXBkYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZnVsbHNpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuXG5cblxuXG5cblxufSk7Ly9lbmQgb2YgYW5ndWxhciBhcHBcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5DdHJsJyxtYWluQ3RybClcblxuZnVuY3Rpb24gbWFpbkN0cmwoJHNjb3BlKXtcblxuJHNjb3BlLnRlc3Q9XCJoZWxsb1wiXG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignY3JlYXRlU2l0ZUN0cmwnLCBjcmVhdGVTaXRlQ3RybClcblxuZnVuY3Rpb24gY3JlYXRlU2l0ZUN0cmwoJHNjb3BlLCBjcmVhdGVTZXJ2aWNlLCAkc3RhdGUpIHtcblxuICAgIC8vIEdvZXMgZnJvbSBjcmVhdGUgc2l0ZSB0byBjcmVhdGUgZGF5cyBhbHNvIGNyZWF0ZXMgdGhlIGZpcnN0IHBhcnQgb2YgdGhlIHNpdGVcbiAgICAkc2NvcGUubmV4dCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVzaXRlKG5hbWUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5zaXRlSWQgPSByZXNwb25zZS5kYXRhWzBdLnNpdGVfaWQ7XG4gICAgICAgICAgICBjcmVhdGVTZXJ2aWNlLnNpdGU9JHNjb3BlLnNpdGVJZDtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdjcmVhdGVzaXRlZGF5cycpO1xuICAgICAgICAgIH0pO1xuXG4gICAgfVxuICAgIC8vIE9wZW5zIHN1YnZpZXcgZnJvbSBjcmVhdGUgZGF5cyBpbnRvIGNyZWF0ZSBob3Vyc1xuICAgICRzY29wZS5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKGRheSkge1xuICAgICAgICAkc2NvcGUuZ2V0RGF5ID0gZGF5O1xuICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzLmhvdXInKTtcbiAgICB9XG4gICAgLy8gY2xlYXJzIGFsbCBvZiB0aGUgY2xvY2sgaW5mb1xuICAgICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuc2hpZnQgPSBudWxsO1xuICAgIH07XG4gICAgLy8gY2xvY2sgc3RlcCBpbmNyZWFzZXNcbiAgICAkc2NvcGUuaHN0ZXAgPSAxO1xuICAgICRzY29wZS5tc3RlcCA9IDE1O1xuXG4gICAgLy8gY3JlYXRlcyB0aGUgc2hpZnQgb2JqZWN0IGFuZCB0aGVuIHB1c2hlcyBpdCBpbnRvIHRoZSBzZXJ2aWNlXG4gICAgJHNjb3BlLmdldE1vcmVIb3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG5cblxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNoaWZ0KSB7XG4gICAgICAgICAgICBzaGlmdFtwcm9wXSA9IChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldEhvdXJzKCkgKyAnOicgKyAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRNaW51dGVzKClcbiAgICAgICAgfVxuICAgICAgICBzaGlmdC5jb250cmFjdF9kYXkgPSAkc2NvcGUuZ2V0RGF5O1xuICAgICAgICBzaGlmdC5zaXRlSWQgPSBjcmVhdGVTZXJ2aWNlLnNpdGU7XG4gICAgICAgIHNoaWZ0LnNpdGVfaWRfZmsgPSBjcmVhdGVTZXJ2aWNlLnNpdGU7XG4gICAgICAgICRzY29wZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAgICAgfTtcblxuXG4gICAgJHNjb3BlLmVtcGxveWVlSWQ7XG4gICAgLy8gY3JlYXRlcyBhbiBlbXBsb3llZSBhbmQgcmV0dXJucyB0aGF0IGlkXG4gICAgJHNjb3BlLmNyZWF0ZUVtcGxveWVlID0gZnVuY3Rpb24oZW1wbG95ZWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVlbXBsb3llZShlbXBsb3llZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5lbXBsb3llZUlkID0gcmVzcG9uc2UuZGF0YVswXS51c2VyX2lkO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnQpe1xuICAgICAgY3JlYXRlU2VydmljZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUuZ2V0VGltZXM9ZnVuY3Rpb24oKXtcbiAgICAgIGNyZWF0ZVNlcnZpY2Uuc2hpZnRzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcbiAgICAgICAgaWYoIXZhbCl7XG4gICAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWhvdXJzKHZhbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgICAgfVxuICAgICAgfSlcblxuICAgIH1cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWlucGFnZUN0cmwnLG1haW5wYWdlQ3RybCk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlQ3RybCgpe1xuXG5cblxuXG5cbn0vL2VuZCBvZiBtYWlucGFnZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ3VwZGF0ZVNpdGVDdHJsJyx1cGRhdGVTaXRlQ3RybCk7XG5cblxuZnVuY3Rpb24gdXBkYXRlU2l0ZUN0cmwoJHNjb3BlLHVwZGF0ZVNlcnZpY2UsJHN0YXRlLCRmaWx0ZXIpe1xuJHNjb3BlLnNob3d1cGRhdGUgPSB0cnVlO1xudXBkYXRlU2VydmljZS51cGRhdGVTaXRlKClcbi50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4kc2NvcGUudXBkYXRlc2l0ZXMgPSByZXNwb25zZS5kYXRhO1xufSk7XG4kc2NvcGUuY2hlY2tOdWxsID0gdHJ1ZTtcbiRzY29wZS51cGRhdGVTaXRlID0gZnVuY3Rpb24oc2l0ZXZpZXcpe1xuICAkc2NvcGUuc2hvd3VwZGF0ZSA9IGZhbHNlO1xudXBkYXRlU2VydmljZS5hbGxTaXRlSW5mbyhzaXRldmlldy5zaXRlX2lkKVxuLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgLy8gY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAkc2NvcGUuc2l0ZXVwZGF0ZSA9IHJlcy5kYXRhLnNpdGVbMF07XG4gICRzY29wZS5iZWdpbnRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2JlZ2luXG4gICRzY29wZS5lbmR0aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9iZWdpblxuICAkc2NvcGUuc2l0ZV9iZWdpbiA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuYmVnaW50aW1lY2hhbmdlKTtcbiAgJHNjb3BlLnNpdGVfZW5kID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5lbmR0aW1lY2hhbmdlKTtcbiAgJHNjb3BlLmNoZWNrRm9yTnVsbCA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgJHNjb3BlLnRpbWVzID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuXG59KVxuJHN0YXRlLmdvKCd1cGRhdGVzaXRlLnVwZGF0ZWZ1bGxzaXRlJylcblxufVxuXG5cblxuXG5cbn0vL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdzaWduaW5DdHJsJyxzaWduaW5DdHJsKVxuXG5mdW5jdGlvbiBzaWduaW5DdHJsKCRzY29wZSl7XG5cblxuXG59Ly9lbmQgb2YgaG9tZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5zZXJ2aWNlKCdjcmVhdGVTZXJ2aWNlJywgY3JlYXRlU2VydmljZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2UoJGh0dHAsICRxKSB7XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzaXRlIHcvbyBkYXlzIGFuZCBob3Vyc1xuICAgIHZhciBzaXRlSWQ7XG4gICAgdGhpcy5zaGlmdHMgPSBbXTtcbiAgICB0aGlzLnNpdGU7XG4gICAgdGhpcy5jcmVhdGVzaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVzaXRlXCIsIGRhdGE6IG9ian0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBzaXRlSWQgPSByZXMuZGF0YVswXS5zaXRlX2lkO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSByZXN0IG9mIHRoZSBzaXRlIC0tIGRheXMgYW5kIGhvdXJzXG4gICAgdGhpcy5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNoaWZ0KTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZCA9IHNpdGVJZDtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZWRheWFuZGhvdXJzXCIsIGRhdGE6IHNoaWZ0fSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIGVtcGxveWVlXG4gICAgdmFyIGVtcGxveWVlSWQ7XG4gICAgdGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCkge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZW1wbG95ZWVcIiwgZGF0YTogZW1wfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIGVtcGxveWVlSWQgPSByZXMuZGF0YVswXS51c2VyX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZW1wbG95ZWVJZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhlIHNpdGUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe3RpdGxlOiBcIlNpdGUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoYXQgdGhlIGVtcGxveWVlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLmVtcGxveWVlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiRW1wbG95ZWUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5hZGR0b1NoaWZ0cyA9IGZ1bmN0aW9uKHNoaWZ0cykge1xuICAgICAgICB0aGlzLnNoaWZ0cy5wdXNoKHNoaWZ0cyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2hpZnRzKTtcblxuICAgIH07XG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbWFpbnBhZ2VTZXJ2aWNlJyxtYWlucGFnZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBtYWlucGFnZVNlcnZpY2UoKXtcblxuXG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ292ZXJ2aWV3U2VydmljZScsb3ZlcnZpZXdTZXJ2aWNlKVxuXG5mdW5jdGlvbiBvdmVydmlld1NlcnZpY2UoJGh0dHApe1xuXG50aGlzLm92ZXJWaWV3U2l0ZXMgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9zaXRlb3ZlcnZpZXdcIlxuICB9KVxufVxuXG50aGlzLnNob3dEYXlzID0gZnVuY3Rpb24oaWROdW0pe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9zY2hlZHVsZURheXMvXCIgKyBpZE51bVxuICB9KVxufVxuXG50aGlzLnNob3dIb3VycyA9IGZ1bmN0aW9uKGlkTnVtKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6IFwiL3NjaGVkdWxlSG91cnMvXCIgKyBpZE51bVxuICB9KVxufVxuXG50aGlzLmVtcGxveWVlU2NoZWR1bGUgPSBmdW5jdGlvbihzY2hlZHVsZVNoaWZ0KXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJQT1NUXCIsXG4gICAgdXJsOlwiL2VtcGxveWVlc2NoZWR1bGVcIixcbiAgICBkYXRhOnNjaGVkdWxlU2hpZnRcbiAgfSlcbn1cblxuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ3VwZGF0ZVNlcnZpY2UnLHVwZGF0ZVNlcnZpY2UpXG5cbmZ1bmN0aW9uIHVwZGF0ZVNlcnZpY2UoJGh0dHApe1xuXG50aGlzLnVwZGF0ZVNpdGUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDonL3NpdGVvdmVydmlldydcbiAgfSlcbn1cblxudGhpcy5hbGxTaXRlSW5mbyA9IGZ1bmN0aW9uKHNpdGVJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOicvZ2V0c2l0ZWFuZGhvdXJzLycgKyBzaXRlSWRcbiAgfSlcbn1cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignc2NoZWR1bGVDdHJsJywgc2NoZWR1bGVDdHJsKVxuXG5mdW5jdGlvbiBzY2hlZHVsZUN0cmwoJHNjb3BlLCBvdmVydmlld1NlcnZpY2UsICRzdGF0ZSxjcmVhdGVTZXJ2aWNlKSB7XG5cbiAgICB2YXIgc2l0ZUFycmF5ID0gW107XG5cbiAgICBvdmVydmlld1NlcnZpY2Uub3ZlclZpZXdTaXRlcygpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cbiAgICAgICAgdmFyIHNpdGVPYmogPSByZXMuZGF0YTtcblxuICAgICAgICB2YXIgY3VycmVudE5hbWU7XG4gICAgICAgIHZhciB0aXRsZXMgPSBbXVxuICAgICAgICAkc2NvcGUuc2l0ZW92ZXJ2aWV3ID0gcmVzLmRhdGE7XG4gICAgICAgICRzY29wZS5zaG93U2l0ZXMgPSB0cnVlO1xuXG4gICAgfSk7XG4vLyBmdW5jdGlvbiB3aWxsIGhpZGUgc2l0ZXMgYW5kIHRoZW4gYnJpbmcgaW4gc2l0ZSBpbmZvXG4gICAgJHNjb3BlLnNjaGVkdWxlU2hpZnQgPSBmdW5jdGlvbihpZE51bSkge1xuICAgICAgICAkc2NvcGUuc2hvd1NpdGVzID0gZmFsc2U7XG5cbiAgICAgICAgb3ZlcnZpZXdTZXJ2aWNlLnNob3dIb3VycyhpZE51bS5zaXRlX2lkKVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAkc2NvcGUuaG91cnMgPSByZXMuZGF0YTtcbiAgICAgICAgICAgICRzY29wZS5zaGlmdHMgPSByZXMuZGF0YTtcblxuICAgICAgICB9KVxuICAgICAgICAkc3RhdGUuZ28oJ3NjaGVkdWxlLnNlbGVjdHNoaWZ0JylcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0ZWRTaGlmdHMgPSBbXTtcbiAgICAkc2NvcGUuYWRkU2hpZnROdW0gPSBmdW5jdGlvbihjb250cmFjdElkLCBzaGlmdE51bSkge1xuICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnNoaWZ0c1swXSk7XG4gICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuc2hpZnRzWzBdLnNpdGVfaWRfZmspO1xuICAgICAgaWYoc2hpZnROdW0pIHtcbiAgICAgICAgc2VsZWN0ZWRTaGlmdHMucHVzaCh7XG4gICAgICAgICAgc2hpZnRfbnVtOiBzaGlmdE51bSxcbiAgICAgICAgICBjb250cmFjdF90aW1lX2ZrOiBjb250cmFjdElkLFxuICAgICAgICAgIHNpdGVfaWRfZms6ICRzY29wZS5zaGlmdHNbMF0uc2l0ZV9pZF9ma1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgdmFyIGluZGV4ID0gc2VsZWN0ZWRTaGlmdHMubWFwKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgcmV0dXJuIHZhbC5jb250cmFjdF90aW1lX2ZrO1xuICAgICAgICB9KS5pbmRleE9mKGNvbnRyYWN0SWQpO1xuXG4gICAgICAgIHNlbGVjdGVkU2hpZnRzLnNwbGljZShpbmRleCwxKTtcbiAgICAgIH1cbiAgICB9XG5cblxuXG4kc2NvcGUuc3VibWl0RW1wU2hpZnRzID0gZnVuY3Rpb24oKXtcbiAgY29uc29sZS5sb2coc2VsZWN0ZWRTaGlmdHMpO1xuICBzZWxlY3RlZFNoaWZ0cy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgY29uc29sZS5sb2coJ2hlbGxvJyk7XG4gICAgb3ZlcnZpZXdTZXJ2aWNlLmVtcGxveWVlU2NoZWR1bGUodmFsKVxuICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gIH0pXG5cbiAgfSlcblxuICBzZWxlY3RlZFNoaWZ0cyA9IFtdO1xuICBjb25zb2xlLmxvZyhzZWxlY3RlZFNoaWZ0cyk7XG59XG5cblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5kaXJlY3RpdmUoJ21lbnVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L21lbnUuaHRtbCdcbiAgICAgIH1cblxufSkvL2VuZCBvZiBkaXJlY3RpdmVcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
