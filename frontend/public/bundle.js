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
    .state('showemployee',{
      url:'/viewemployee',
      templateUrl:'app/components/update_site/view_employee.html',
      controller:'updateSiteCtrl'
    })
    .state('showemployee.updateemployee',{
      url:'/updateemployee',
      templateUrl:'app/components/update_site/update_employee.html',
      controller: 'updateSiteCtrl'
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

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope,loginService){


$scope.submitlogin = function(login){
  console.log(login);
loginService.getLogin(login)
.then(function(res){});
}

}//end of homeCtrl

angular.module('keeperApp').controller('updateSiteCtrl', updateSiteCtrl);

function updateSiteCtrl($scope, updateService, $state, $filter) {
    $scope.showupdate = true;
    updateService.updateSite().then(function(response) {
        $scope.updatesites = response.data;
    });

    $scope.checkNull = true;

    $scope.updateSite = function(siteview) {
        $scope.showupdate = false;
        updateService.allSiteInfo(siteview.site_id).then(function(res) {
            // console.log(res.data);
            $scope.siteupdate = res.data.site[0];
            $scope.begintimechange = res.data.site[0].contract_begin
            $scope.endtimechange = res.data.site[0].contract_end
            $scope.siteupdate.contract_begin = $filter('date')($scope.begintimechange);
            $scope.siteupdate.contract_end = $filter('date')($scope.endtimechange);
            $scope.checkForNull = res.data.hoursandsite;
            // console.log($scope.checkForNull);
            $scope.times = res.data.hoursandsite;
        })
        $state.go('updatesite.updatefullsite')
    }

    $scope.submitUpdate = function(site,time){
      console.log(site);
        console.log(time);
      var siteIdNum = site.site_id;
      updateService.updatesite(siteIdNum,site)
      .then(function(response){
      })
      time.forEach(function(val){

        var siteId = val.contract_time_id;
        updateService.updatehours(siteId,val)
        .then(function(res){});
        siteId =0;
      })
    }

    updateService.showemployee()
    .then(function(emp){
      // console.log(emp);

      $scope.employee = emp.data;
    })

    $scope.updateEmp = function(emp){
      $scope.showupdate = false;
      $scope.empupdate = emp
      console.log(emp);
      $state.go('showemployee.updateemployee')
    }

    $scope.submitEmployee = function(empchange){
      var employeeId = empchange.user_id;
      updateService.updateemployee(employeeId,empchange)
      .then(function(res){});
    }



} //end of controller

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
.service('loginService',loginService);


function loginService($http){

this.getLogin = function(login){
  console.log(login,'service');
  login = {
    username: login.email,
    password: login.password
  }
return $http({
  method:"POST",
  url:'/login',
  data: login
})


}



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

this.updatesite = function(updateId,updateSite){
  return $http({
    method: "PUT",
    url:'/updatesite/' + updateId,
    data: updateSite
  })
}

this.updatehours = function(updateId, updateTime){
  return $http({
    method: "PUT",
    url:'/updatehours/' + updateId,
    data: updateTime
  })
}

this.updateemployee = function(updateId, updateEmployee){
  return $http({
    method: "PUT",
    url: '/updateemployee/' + updateId,
    data: updateEmployee
  })
}

this.showemployee = function(){
  return $http({
    method: "GET",
    url:"/viewemployee"
  })
}


}//end of service

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVDdHJsLmpzIiwiY29tcG9uZW50cy9zaWduaW4vc2lnbmluQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGVDdHJsLmpzIiwic2hhcmVkL21lbnUvbWVudS1kaXJlY3RpdmUuanMiLCJzaGFyZWQvc2VydmljZXMvY3JlYXRlU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9sb2dpblNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvbWFpbnBhZ2VTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL292ZXJ2aWV3U2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy91cGRhdGVTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJywgWyd1aS5yb3V0ZXInLCd1aS5ib290c3RyYXAnLCduZ0FuaW1hdGUnLCdzYXRlbGxpemVyJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIpIHtcblxuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ3NpZ25pbicse1xuICAgICAgdXJsOicvJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvc2lnbmluL3NpZ25pbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzaWduaW5DdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtYWlucGFnZScse1xuICAgICAgdXJsOicvbWFpbnBhZ2UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9tYWluL21haW5wYWdlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ21haW5wYWdlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZScse1xuICAgICAgdXJsOicvY3JlYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGVkYXlzJywge1xuICAgICAgdXJsOiAnL2RheXMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZXNpdGVkYXlzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlZGF5cy5ob3VyJyx7XG4gICAgICB1cmw6Jy9ob3VycycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVob3Vycy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgndXBkYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL3VwZGF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL2NyZWF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzY2hlZHVsZScse1xuICAgICAgdXJsOicvc2NoZWR1bGVzaXRlcycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3NjaGVkdWxlLnNlbGVjdHNoaWZ0Jyx7XG4gICAgICB1cmw6Jy9zY2hlZHVsZXNoaWZ0cycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVzaGlmdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUnLHtcbiAgICAgIHVybDonL3VwZGF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUudXBkYXRlZnVsbHNpdGUnLHtcbiAgICAgIHVybDonL2Z1bGxzaXRldXBkYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZnVsbHNpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hvd2VtcGxveWVlJyx7XG4gICAgICB1cmw6Jy92aWV3ZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3ZpZXdfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hvd2VtcGxveWVlLnVwZGF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy91cGRhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ3VwZGF0ZVNpdGVDdHJsJ1xuICAgIH0pXG5cblxuXG5cblxuXG59KTsvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdjcmVhdGVTaXRlQ3RybCcsIGNyZWF0ZVNpdGVDdHJsKVxuXG5mdW5jdGlvbiBjcmVhdGVTaXRlQ3RybCgkc2NvcGUsIGNyZWF0ZVNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gR29lcyBmcm9tIGNyZWF0ZSBzaXRlIHRvIGNyZWF0ZSBkYXlzIGFsc28gY3JlYXRlcyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgc2l0ZVxuICAgICRzY29wZS5uZXh0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUobmFtZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLnNpdGVJZCA9IHJlc3BvbnNlLmRhdGFbMF0uc2l0ZV9pZDtcbiAgICAgICAgICAgIGNyZWF0ZVNlcnZpY2Uuc2l0ZT0kc2NvcGUuc2l0ZUlkO1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgLy8gT3BlbnMgc3VidmlldyBmcm9tIGNyZWF0ZSBkYXlzIGludG8gY3JlYXRlIGhvdXJzXG4gICAgJHNjb3BlLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oZGF5KSB7XG4gICAgICAgICRzY29wZS5nZXREYXkgPSBkYXk7XG4gICAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMuaG91cicpO1xuICAgIH1cbiAgICAvLyBjbGVhcnMgYWxsIG9mIHRoZSBjbG9jayBpbmZvXG4gICAgJHNjb3BlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5zaGlmdCA9IG51bGw7XG4gICAgfTtcbiAgICAvLyBjbG9jayBzdGVwIGluY3JlYXNlc1xuICAgICRzY29wZS5oc3RlcCA9IDE7XG4gICAgJHNjb3BlLm1zdGVwID0gMTU7XG5cbiAgICAvLyBjcmVhdGVzIHRoZSBzaGlmdCBvYmplY3QgYW5kIHRoZW4gcHVzaGVzIGl0IGludG8gdGhlIHNlcnZpY2VcbiAgICAkc2NvcGUuZ2V0TW9yZUhvdXJzID0gZnVuY3Rpb24oc2hpZnQpIHtcblxuXG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc2hpZnQpIHtcbiAgICAgICAgICAgIHNoaWZ0W3Byb3BdID0gKG5ldyBEYXRlKHNoaWZ0W3Byb3BdKSkuZ2V0SG91cnMoKSArICc6JyArIChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldE1pbnV0ZXMoKVxuICAgICAgICB9XG4gICAgICAgIHNoaWZ0LmNvbnRyYWN0X2RheSA9ICRzY29wZS5nZXREYXk7XG4gICAgICAgIHNoaWZ0LnNpdGVJZCA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZF9mayA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcbiAgICAgICAgJHNjb3BlLmFkZHRvU2hpZnRzKHNoaWZ0KTtcbiAgICAgICAgICB9O1xuXG5cbiAgICAkc2NvcGUuZW1wbG95ZWVJZDtcbiAgICAvLyBjcmVhdGVzIGFuIGVtcGxveWVlIGFuZCByZXR1cm5zIHRoYXQgaWRcbiAgICAkc2NvcGUuY3JlYXRlRW1wbG95ZWUgPSBmdW5jdGlvbihlbXBsb3llZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWVtcGxveWVlKGVtcGxveWVlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLmVtcGxveWVlSWQgPSByZXNwb25zZS5kYXRhWzBdLnVzZXJfaWQ7XG5cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAkc2NvcGUuYWRkdG9TaGlmdHMgPSBmdW5jdGlvbihzaGlmdCl7XG4gICAgICBjcmVhdGVTZXJ2aWNlLmFkZHRvU2hpZnRzKHNoaWZ0KTtcbiAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMnKTtcbiAgICB9XG5cblxuICAgICRzY29wZS5nZXRUaW1lcz1mdW5jdGlvbigpe1xuICAgICAgY3JlYXRlU2VydmljZS5zaGlmdHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICBjb25zb2xlLmxvZyh2YWwpO1xuICAgICAgICBpZighdmFsKXtcbiAgICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlaG91cnModmFsKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgICB9XG4gICAgICB9KVxuXG4gICAgfVxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5wYWdlQ3RybCcsbWFpbnBhZ2VDdHJsKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VDdHJsKCl7XG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ3NjaGVkdWxlQ3RybCcsIHNjaGVkdWxlQ3RybClcblxuZnVuY3Rpb24gc2NoZWR1bGVDdHJsKCRzY29wZSwgb3ZlcnZpZXdTZXJ2aWNlLCAkc3RhdGUsY3JlYXRlU2VydmljZSkge1xuXG4gICAgdmFyIHNpdGVBcnJheSA9IFtdO1xuXG4gICAgb3ZlcnZpZXdTZXJ2aWNlLm92ZXJWaWV3U2l0ZXMoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXG4gICAgICAgIHZhciBzaXRlT2JqID0gcmVzLmRhdGE7XG5cbiAgICAgICAgdmFyIGN1cnJlbnROYW1lO1xuICAgICAgICB2YXIgdGl0bGVzID0gW11cbiAgICAgICAgJHNjb3BlLnNpdGVvdmVydmlldyA9IHJlcy5kYXRhO1xuICAgICAgICAkc2NvcGUuc2hvd1NpdGVzID0gdHJ1ZTtcblxuICAgIH0pO1xuLy8gZnVuY3Rpb24gd2lsbCBoaWRlIHNpdGVzIGFuZCB0aGVuIGJyaW5nIGluIHNpdGUgaW5mb1xuICAgICRzY29wZS5zY2hlZHVsZVNoaWZ0ID0gZnVuY3Rpb24oaWROdW0pIHtcbiAgICAgICAgJHNjb3BlLnNob3dTaXRlcyA9IGZhbHNlO1xuXG4gICAgICAgIG92ZXJ2aWV3U2VydmljZS5zaG93SG91cnMoaWROdW0uc2l0ZV9pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgJHNjb3BlLmhvdXJzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAkc2NvcGUuc2hpZnRzID0gcmVzLmRhdGE7XG5cbiAgICAgICAgfSlcbiAgICAgICAgJHN0YXRlLmdvKCdzY2hlZHVsZS5zZWxlY3RzaGlmdCcpXG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGVkU2hpZnRzID0gW107XG4gICAgJHNjb3BlLmFkZFNoaWZ0TnVtID0gZnVuY3Rpb24oY29udHJhY3RJZCwgc2hpZnROdW0pIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5zaGlmdHNbMF0pO1xuICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnNoaWZ0c1swXS5zaXRlX2lkX2ZrKTtcbiAgICAgIGlmKHNoaWZ0TnVtKSB7XG4gICAgICAgIHNlbGVjdGVkU2hpZnRzLnB1c2goe1xuICAgICAgICAgIHNoaWZ0X251bTogc2hpZnROdW0sXG4gICAgICAgICAgY29udHJhY3RfdGltZV9mazogY29udHJhY3RJZCxcbiAgICAgICAgICBzaXRlX2lkX2ZrOiAkc2NvcGUuc2hpZnRzWzBdLnNpdGVfaWRfZmtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIHZhciBpbmRleCA9IHNlbGVjdGVkU2hpZnRzLm1hcChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgIHJldHVybiB2YWwuY29udHJhY3RfdGltZV9maztcbiAgICAgICAgfSkuaW5kZXhPZihjb250cmFjdElkKTtcblxuICAgICAgICBzZWxlY3RlZFNoaWZ0cy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICB9XG4gICAgfVxuXG5cblxuJHNjb3BlLnN1Ym1pdEVtcFNoaWZ0cyA9IGZ1bmN0aW9uKCl7XG4gIGNvbnNvbGUubG9nKHNlbGVjdGVkU2hpZnRzKTtcbiAgc2VsZWN0ZWRTaGlmdHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgIGNvbnNvbGUubG9nKCdoZWxsbycpO1xuICAgIG92ZXJ2aWV3U2VydmljZS5lbXBsb3llZVNjaGVkdWxlKHZhbClcbiAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICB9KVxuXG4gIH0pXG5cbiAgc2VsZWN0ZWRTaGlmdHMgPSBbXTtcbiAgY29uc29sZS5sb2coc2VsZWN0ZWRTaGlmdHMpO1xufVxuXG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdzaWduaW5DdHJsJyxzaWduaW5DdHJsKVxuXG5mdW5jdGlvbiBzaWduaW5DdHJsKCRzY29wZSxsb2dpblNlcnZpY2Upe1xuXG5cbiRzY29wZS5zdWJtaXRsb2dpbiA9IGZ1bmN0aW9uKGxvZ2luKXtcbiAgY29uc29sZS5sb2cobG9naW4pO1xubG9naW5TZXJ2aWNlLmdldExvZ2luKGxvZ2luKVxuLnRoZW4oZnVuY3Rpb24ocmVzKXt9KTtcbn1cblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcigndXBkYXRlU2l0ZUN0cmwnLCB1cGRhdGVTaXRlQ3RybCk7XG5cbmZ1bmN0aW9uIHVwZGF0ZVNpdGVDdHJsKCRzY29wZSwgdXBkYXRlU2VydmljZSwgJHN0YXRlLCAkZmlsdGVyKSB7XG4gICAgJHNjb3BlLnNob3d1cGRhdGUgPSB0cnVlO1xuICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlU2l0ZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLnVwZGF0ZXNpdGVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcblxuICAgICRzY29wZS5jaGVja051bGwgPSB0cnVlO1xuXG4gICAgJHNjb3BlLnVwZGF0ZVNpdGUgPSBmdW5jdGlvbihzaXRldmlldykge1xuICAgICAgICAkc2NvcGUuc2hvd3VwZGF0ZSA9IGZhbHNlO1xuICAgICAgICB1cGRhdGVTZXJ2aWNlLmFsbFNpdGVJbmZvKHNpdGV2aWV3LnNpdGVfaWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XG4gICAgICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZSA9IHJlcy5kYXRhLnNpdGVbMF07XG4gICAgICAgICAgICAkc2NvcGUuYmVnaW50aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9iZWdpblxuICAgICAgICAgICAgJHNjb3BlLmVuZHRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2VuZFxuICAgICAgICAgICAgJHNjb3BlLnNpdGV1cGRhdGUuY29udHJhY3RfYmVnaW4gPSAkZmlsdGVyKCdkYXRlJykoJHNjb3BlLmJlZ2ludGltZWNoYW5nZSk7XG4gICAgICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9lbmQgPSAkZmlsdGVyKCdkYXRlJykoJHNjb3BlLmVuZHRpbWVjaGFuZ2UpO1xuICAgICAgICAgICAgJHNjb3BlLmNoZWNrRm9yTnVsbCA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5jaGVja0Zvck51bGwpO1xuICAgICAgICAgICAgJHNjb3BlLnRpbWVzID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuICAgICAgICB9KVxuICAgICAgICAkc3RhdGUuZ28oJ3VwZGF0ZXNpdGUudXBkYXRlZnVsbHNpdGUnKVxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXRVcGRhdGUgPSBmdW5jdGlvbihzaXRlLHRpbWUpe1xuICAgICAgY29uc29sZS5sb2coc2l0ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRpbWUpO1xuICAgICAgdmFyIHNpdGVJZE51bSA9IHNpdGUuc2l0ZV9pZDtcbiAgICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlc2l0ZShzaXRlSWROdW0sc2l0ZSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIH0pXG4gICAgICB0aW1lLmZvckVhY2goZnVuY3Rpb24odmFsKXtcblxuICAgICAgICB2YXIgc2l0ZUlkID0gdmFsLmNvbnRyYWN0X3RpbWVfaWQ7XG4gICAgICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlaG91cnMoc2l0ZUlkLHZhbClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXt9KTtcbiAgICAgICAgc2l0ZUlkID0wO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICB1cGRhdGVTZXJ2aWNlLnNob3dlbXBsb3llZSgpXG4gICAgLnRoZW4oZnVuY3Rpb24oZW1wKXtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVtcCk7XG5cbiAgICAgICRzY29wZS5lbXBsb3llZSA9IGVtcC5kYXRhO1xuICAgIH0pXG5cbiAgICAkc2NvcGUudXBkYXRlRW1wID0gZnVuY3Rpb24oZW1wKXtcbiAgICAgICRzY29wZS5zaG93dXBkYXRlID0gZmFsc2U7XG4gICAgICAkc2NvcGUuZW1wdXBkYXRlID0gZW1wXG4gICAgICBjb25zb2xlLmxvZyhlbXApO1xuICAgICAgJHN0YXRlLmdvKCdzaG93ZW1wbG95ZWUudXBkYXRlZW1wbG95ZWUnKVxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXRFbXBsb3llZSA9IGZ1bmN0aW9uKGVtcGNoYW5nZSl7XG4gICAgICB2YXIgZW1wbG95ZWVJZCA9IGVtcGNoYW5nZS51c2VyX2lkO1xuICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVlbXBsb3llZShlbXBsb3llZUlkLGVtcGNoYW5nZSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7fSk7XG4gICAgfVxuXG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnXG4gICAgICB9XG5cbn0pLy9lbmQgb2YgZGlyZWN0aXZlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuc2VydmljZSgnY3JlYXRlU2VydmljZScsIGNyZWF0ZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBjcmVhdGVTZXJ2aWNlKCRodHRwLCAkcSkge1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgdGhlIGJlZ2lubmluZyBvZiB0aGUgc2l0ZSB3L28gZGF5cyBhbmQgaG91cnNcbiAgICB2YXIgc2l0ZUlkO1xuICAgIHRoaXMuc2hpZnRzID0gW107XG4gICAgdGhpcy5zaXRlO1xuICAgIHRoaXMuY3JlYXRlc2l0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlc2l0ZVwiLCBkYXRhOiBvYmp9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgc2l0ZUlkID0gcmVzLmRhdGFbMF0uc2l0ZV9pZDtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSB0aGUgcmVzdCBvZiB0aGUgc2l0ZSAtLSBkYXlzIGFuZCBob3Vyc1xuICAgIHRoaXMuY3JlYXRlaG91cnMgPSBmdW5jdGlvbihzaGlmdCkge1xuICAgICAgICBjb25zb2xlLmxvZyhzaGlmdCk7XG4gICAgICAgIHNoaWZ0LnNpdGVfaWQgPSBzaXRlSWQ7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVkYXlhbmRob3Vyc1wiLCBkYXRhOiBzaGlmdH0pO1xuICAgIH07XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSBhbiBlbXBsb3llZVxuICAgIHZhciBlbXBsb3llZUlkO1xuICAgIHRoaXMuY3JlYXRlZW1wbG95ZWUgPSBmdW5jdGlvbihlbXApIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZWVtcGxveWVlXCIsIGRhdGE6IGVtcH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBlbXBsb3llZUlkID0gcmVzLmRhdGFbMF0udXNlcl9pZDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVtcGxveWVlSWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoZSBzaXRlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLnNpdGVhbGVydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2FsKHt0aXRsZTogXCJTaXRlIENyZWF0ZWQhXCIsIHR5cGU6IFwic3VjY2Vzc1wiLCBjb25maXJtQnV0dG9uVGV4dDogXCJPa1wiLCBhbGxvd091dHNpZGVDbGljazogdHJ1ZX0pO1xuXG4gICAgfTtcbiAgICAvLyB0aGlzIG1ha2VzIGFuIGFsZXJ0IHNheWluZyB0aGF0IHRoZSBlbXBsb3llZSBoYXMgYmVlbiBjcmVhdGVkXG4gICAgdGhpcy5lbXBsb3llZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe3RpdGxlOiBcIkVtcGxveWVlIENyZWF0ZWQhXCIsIHR5cGU6IFwic3VjY2Vzc1wiLCBjb25maXJtQnV0dG9uVGV4dDogXCJPa1wiLCBhbGxvd091dHNpZGVDbGljazogdHJ1ZX0pO1xuXG4gICAgfTtcblxuICAgIHRoaXMuYWRkdG9TaGlmdHMgPSBmdW5jdGlvbihzaGlmdHMpIHtcbiAgICAgICAgdGhpcy5zaGlmdHMucHVzaChzaGlmdHMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnNoaWZ0cyk7XG5cbiAgICB9O1xuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ2xvZ2luU2VydmljZScsbG9naW5TZXJ2aWNlKTtcblxuXG5mdW5jdGlvbiBsb2dpblNlcnZpY2UoJGh0dHApe1xuXG50aGlzLmdldExvZ2luID0gZnVuY3Rpb24obG9naW4pe1xuICBjb25zb2xlLmxvZyhsb2dpbiwnc2VydmljZScpO1xuICBsb2dpbiA9IHtcbiAgICB1c2VybmFtZTogbG9naW4uZW1haWwsXG4gICAgcGFzc3dvcmQ6IGxvZ2luLnBhc3N3b3JkXG4gIH1cbnJldHVybiAkaHR0cCh7XG4gIG1ldGhvZDpcIlBPU1RcIixcbiAgdXJsOicvbG9naW4nLFxuICBkYXRhOiBsb2dpblxufSlcblxuXG59XG5cblxuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ21haW5wYWdlU2VydmljZScsbWFpbnBhZ2VTZXJ2aWNlKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VTZXJ2aWNlKCl7XG5cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdvdmVydmlld1NlcnZpY2UnLG92ZXJ2aWV3U2VydmljZSlcblxuZnVuY3Rpb24gb3ZlcnZpZXdTZXJ2aWNlKCRodHRwKXtcblxudGhpcy5vdmVyVmlld1NpdGVzID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvc2l0ZW92ZXJ2aWV3XCJcbiAgfSlcbn1cblxudGhpcy5zaG93RGF5cyA9IGZ1bmN0aW9uKGlkTnVtKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvc2NoZWR1bGVEYXlzL1wiICsgaWROdW1cbiAgfSlcbn1cblxudGhpcy5zaG93SG91cnMgPSBmdW5jdGlvbihpZE51bSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOiBcIi9zY2hlZHVsZUhvdXJzL1wiICsgaWROdW1cbiAgfSlcbn1cblxudGhpcy5lbXBsb3llZVNjaGVkdWxlID0gZnVuY3Rpb24oc2NoZWR1bGVTaGlmdCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDpcIi9lbXBsb3llZXNjaGVkdWxlXCIsXG4gICAgZGF0YTpzY2hlZHVsZVNoaWZ0XG4gIH0pXG59XG5cblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCd1cGRhdGVTZXJ2aWNlJyx1cGRhdGVTZXJ2aWNlKVxuXG5mdW5jdGlvbiB1cGRhdGVTZXJ2aWNlKCRodHRwKXtcblxudGhpcy51cGRhdGVTaXRlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6Jy9zaXRlb3ZlcnZpZXcnXG4gIH0pXG59XG5cbnRoaXMuYWxsU2l0ZUluZm8gPSBmdW5jdGlvbihzaXRlSWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDonL2dldHNpdGVhbmRob3Vycy8nICsgc2l0ZUlkXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlc2l0ZSA9IGZ1bmN0aW9uKHVwZGF0ZUlkLHVwZGF0ZVNpdGUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6Jy91cGRhdGVzaXRlLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVTaXRlXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlaG91cnMgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlVGltZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDonL3VwZGF0ZWhvdXJzLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVUaW1lXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlZW1wbG95ZWUgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlRW1wbG95ZWUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6ICcvdXBkYXRlZW1wbG95ZWUvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZUVtcGxveWVlXG4gIH0pXG59XG5cbnRoaXMuc2hvd2VtcGxveWVlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgdXJsOlwiL3ZpZXdlbXBsb3llZVwiXG4gIH0pXG59XG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
