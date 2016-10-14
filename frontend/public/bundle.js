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
    .state('hour',{
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
$scope.showshifts1 = false;
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
        $state.go('hour');
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


    $scope.pickShift = function(v){

    if(v === 1){
      $scope.showshifts1 = !$scope.showshifts1;
    }
    if(v === 2){
      $scope.showshifts2 = !$scope.showshifts2;
    }
    if(v === 3){
      $scope.showshifts3 = !$scope.showshifts3;
    }
    if(v === 4){
      $scope.showshifts4 = !$scope.showshifts4;
    }

    }

} //end of controller

angular.module('keeperApp')
.controller('mainpageCtrl',mainpageCtrl);

function mainpageCtrl($scope,mainpageService,overviewService){

mainpageService.getcurrent()
.then(function(res){
  var siteUserId = res.data.passport.user.user_id;
  $scope.usersites = res.data.passport.user;
  mainpageService.getUserSites(siteUserId)
  .then(function(userSites){

  console.log(userSites.data);

  })


})





}//end of mainpageCtrl

angular.module('keeperApp').controller('scheduleCtrl', scheduleCtrl)

function scheduleCtrl($scope, overviewService, $state, createService) {

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

        overviewService.showHours(idNum.site_id).then(function(res) {
            $scope.hours = res.data;
            $scope.shifts = res.data;

        })
        $state.go('schedule.selectshift')
    }

    var selectedShifts = [];
    $scope.addShiftNum = function(contractId, shiftNum) {
      overviewService.getUserId()
      .then(function(res){
        var empId = res.data.passport.user.user_id;
        if (shiftNum) {
            selectedShifts.push({shift_num: shiftNum, contract_time_fk: contractId, site_id_fk: $scope.shifts[0].site_id_fk, user_id_fk: empId})
        } else {
            var index = selectedShifts.map(function(val) {
                return val.contract_time_fk;
            }).indexOf(contractId);

            selectedShifts.splice(index, 1);
        }

      })

    }




    $scope.submitEmpShifts = function() {
        console.log(selectedShifts);
        selectedShifts.forEach(function(val) {
            // console.log('hello');
            overviewService.employeeSchedule(val).then(function(response) {})

        })

        selectedShifts = [];
        // console.log(selectedShifts);
    }




} //end of controller

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope,loginService,$state){

//$scope.login = false;
$scope.done = false;
$scope.realbutton = false;

$scope.beginlogin = function(){
  // TweenMax.staggerTo(".login-button", 1, {rotation:360, y:50}, .1);
  // $scope.login = false;
  $scope.done = true;
  // $scope.realbutton = false;
}

$scope.login = {
  username: 'a@a.com',
  password: 'a'
}


$scope.submitlogin = function(login){
  loginService.getLogin(login)
    .then(function(res){
      if(res.status === 200) $state.go('mainpage');
    }, function(err) {
      console.log(err)
    });
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

angular.module('keeperApp')
.animation('.slide-down', function() {
return {
    enter: function(element, done) {
      TweenMax.from(element, 1, {opacity:0, y:50, onComplete:done})
    },
    leave: function(element, done) {
      TweenMax.to(element, 1, {opacity:0, y:50, onComplete:done})
    }
  }
});

// ('.main-content', [function(){
//   return {
//     enter: function(element, done) {
//       TweenMax.from(element, 1, {opacity:0, y:50, onComplete:done})
//     },
//     leave: function(element, done) {
//       TweenMax.to(element, 1, {opacity:0, y:50, onComplete:done})
//     }
//   }
// }])

angular.module('keeperApp').directive('menuDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/menu.html',
        controller: function($scope) {
        
        }
    }

}) //end of directive

angular.module('keeperApp').directive('titleDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/title.html'

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
  return $http({
    method:"POST",
    url:'/auth/login',
    data: login
  });
}



} //end of service

angular.module('keeperApp')
.service('mainpageService',mainpageService);

function mainpageService($http){

this.getcurrent = function(){
  return $http({
    method:"GET",
    url: "/auth/current"
  })
}

this.getUserSites = function(userSiteId){
  return $http({
    method:"GET",
    url:"/getUserSites/" + userSiteId
  })
}



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
  // console.log(scheduleShift);
  return $http({
    method:"POST",
    url:"/employeeschedule",
    data:scheduleShift
  })
}

this.getUserInfo = function(userId){
  return $http({
    method:"GET",
    url:"/getUserInfo/" + userId
  })
}

this.getUserId = function(){
  return $http({
    method:"GET",
    url:"/auth/current"
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVDdHJsLmpzIiwiY29tcG9uZW50cy9zaWduaW4vc2lnbmluQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGVDdHJsLmpzIiwic2hhcmVkL2FuaW1hdGlvbnMvdWktdmlldy1hbmltYXRpb24uanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9tZW51L3RpdGxlLWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9jcmVhdGVTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL2xvZ2luU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9tYWlucGFnZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvb3ZlcnZpZXdTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3VwZGF0ZVNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJywgWyd1aS5yb3V0ZXInLCd1aS5ib290c3RyYXAnLCduZ0FuaW1hdGUnLCdzYXRlbGxpemVyJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIpIHtcblxuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ3NpZ25pbicse1xuICAgICAgdXJsOicvJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvc2lnbmluL3NpZ25pbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzaWduaW5DdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtYWlucGFnZScse1xuICAgICAgdXJsOicvbWFpbnBhZ2UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9tYWluL21haW5wYWdlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ21haW5wYWdlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZScse1xuICAgICAgdXJsOicvY3JlYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGVkYXlzJywge1xuICAgICAgdXJsOiAnL2RheXMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZXNpdGVkYXlzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdob3VyJyx7XG4gICAgICB1cmw6Jy9ob3VycycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVob3Vycy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgndXBkYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL3VwZGF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL2NyZWF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzY2hlZHVsZScse1xuICAgICAgdXJsOicvc2NoZWR1bGVzaXRlcycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3NjaGVkdWxlLnNlbGVjdHNoaWZ0Jyx7XG4gICAgICB1cmw6Jy9zY2hlZHVsZXNoaWZ0cycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVzaGlmdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUnLHtcbiAgICAgIHVybDonL3VwZGF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUudXBkYXRlZnVsbHNpdGUnLHtcbiAgICAgIHVybDonL2Z1bGxzaXRldXBkYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZnVsbHNpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hvd2VtcGxveWVlJyx7XG4gICAgICB1cmw6Jy92aWV3ZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3ZpZXdfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hvd2VtcGxveWVlLnVwZGF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy91cGRhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ3VwZGF0ZVNpdGVDdHJsJ1xuICAgIH0pXG5cblxuXG5cblxuXG59KTsvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdjcmVhdGVTaXRlQ3RybCcsIGNyZWF0ZVNpdGVDdHJsKVxuXG5mdW5jdGlvbiBjcmVhdGVTaXRlQ3RybCgkc2NvcGUsIGNyZWF0ZVNlcnZpY2UsICRzdGF0ZSkge1xuJHNjb3BlLnNob3dzaGlmdHMxID0gZmFsc2U7XG4gICAgLy8gR29lcyBmcm9tIGNyZWF0ZSBzaXRlIHRvIGNyZWF0ZSBkYXlzIGFsc28gY3JlYXRlcyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgc2l0ZVxuICAgICRzY29wZS5uZXh0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUobmFtZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLnNpdGVJZCA9IHJlc3BvbnNlLmRhdGFbMF0uc2l0ZV9pZDtcbiAgICAgICAgICAgIGNyZWF0ZVNlcnZpY2Uuc2l0ZT0kc2NvcGUuc2l0ZUlkO1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgLy8gT3BlbnMgc3VidmlldyBmcm9tIGNyZWF0ZSBkYXlzIGludG8gY3JlYXRlIGhvdXJzXG4gICAgJHNjb3BlLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oZGF5KSB7XG4gICAgICAgICRzY29wZS5nZXREYXkgPSBkYXk7XG4gICAgICAgICRzdGF0ZS5nbygnaG91cicpO1xuICAgIH1cbiAgICAvLyBjbGVhcnMgYWxsIG9mIHRoZSBjbG9jayBpbmZvXG4gICAgJHNjb3BlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5zaGlmdCA9IG51bGw7XG4gICAgfTtcbiAgICAvLyBjbG9jayBzdGVwIGluY3JlYXNlc1xuICAgICRzY29wZS5oc3RlcCA9IDE7XG4gICAgJHNjb3BlLm1zdGVwID0gMTU7XG5cbiAgICAvLyBjcmVhdGVzIHRoZSBzaGlmdCBvYmplY3QgYW5kIHRoZW4gcHVzaGVzIGl0IGludG8gdGhlIHNlcnZpY2VcbiAgICAkc2NvcGUuZ2V0TW9yZUhvdXJzID0gZnVuY3Rpb24oc2hpZnQpIHtcblxuXG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc2hpZnQpIHtcbiAgICAgICAgICAgIHNoaWZ0W3Byb3BdID0gKG5ldyBEYXRlKHNoaWZ0W3Byb3BdKSkuZ2V0SG91cnMoKSArICc6JyArIChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldE1pbnV0ZXMoKVxuICAgICAgICB9XG4gICAgICAgIHNoaWZ0LmNvbnRyYWN0X2RheSA9ICRzY29wZS5nZXREYXk7XG4gICAgICAgIHNoaWZ0LnNpdGVJZCA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZF9mayA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcbiAgICAgICAgJHNjb3BlLmFkZHRvU2hpZnRzKHNoaWZ0KTtcbiAgICAgICAgICB9O1xuXG5cbiAgICAkc2NvcGUuZW1wbG95ZWVJZDtcbiAgICAvLyBjcmVhdGVzIGFuIGVtcGxveWVlIGFuZCByZXR1cm5zIHRoYXQgaWRcbiAgICAkc2NvcGUuY3JlYXRlRW1wbG95ZWUgPSBmdW5jdGlvbihlbXBsb3llZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWVtcGxveWVlKGVtcGxveWVlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLmVtcGxveWVlSWQgPSByZXNwb25zZS5kYXRhWzBdLnVzZXJfaWQ7XG5cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAkc2NvcGUuYWRkdG9TaGlmdHMgPSBmdW5jdGlvbihzaGlmdCl7XG4gICAgICBjcmVhdGVTZXJ2aWNlLmFkZHRvU2hpZnRzKHNoaWZ0KTtcbiAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMnKTtcbiAgICB9XG5cblxuICAgICRzY29wZS5nZXRUaW1lcz1mdW5jdGlvbigpe1xuICAgICAgY3JlYXRlU2VydmljZS5zaGlmdHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICBjb25zb2xlLmxvZyh2YWwpO1xuICAgICAgICBpZighdmFsKXtcbiAgICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlaG91cnModmFsKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgICB9XG4gICAgICB9KVxuXG4gICAgfVxuXG5cbiAgICAkc2NvcGUucGlja1NoaWZ0ID0gZnVuY3Rpb24odil7XG5cbiAgICBpZih2ID09PSAxKXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzMSA9ICEkc2NvcGUuc2hvd3NoaWZ0czE7XG4gICAgfVxuICAgIGlmKHYgPT09IDIpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHMyID0gISRzY29wZS5zaG93c2hpZnRzMjtcbiAgICB9XG4gICAgaWYodiA9PT0gMyl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czMgPSAhJHNjb3BlLnNob3dzaGlmdHMzO1xuICAgIH1cbiAgICBpZih2ID09PSA0KXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzNCA9ICEkc2NvcGUuc2hvd3NoaWZ0czQ7XG4gICAgfVxuXG4gICAgfVxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5wYWdlQ3RybCcsbWFpbnBhZ2VDdHJsKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VDdHJsKCRzY29wZSxtYWlucGFnZVNlcnZpY2Usb3ZlcnZpZXdTZXJ2aWNlKXtcblxubWFpbnBhZ2VTZXJ2aWNlLmdldGN1cnJlbnQoKVxuLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgdmFyIHNpdGVVc2VySWQgPSByZXMuZGF0YS5wYXNzcG9ydC51c2VyLnVzZXJfaWQ7XG4gICRzY29wZS51c2Vyc2l0ZXMgPSByZXMuZGF0YS5wYXNzcG9ydC51c2VyO1xuICBtYWlucGFnZVNlcnZpY2UuZ2V0VXNlclNpdGVzKHNpdGVVc2VySWQpXG4gIC50aGVuKGZ1bmN0aW9uKHVzZXJTaXRlcyl7XG5cbiAgY29uc29sZS5sb2codXNlclNpdGVzLmRhdGEpO1xuXG4gIH0pXG5cblxufSlcblxuXG5cblxuXG59Ly9lbmQgb2YgbWFpbnBhZ2VDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignc2NoZWR1bGVDdHJsJywgc2NoZWR1bGVDdHJsKVxuXG5mdW5jdGlvbiBzY2hlZHVsZUN0cmwoJHNjb3BlLCBvdmVydmlld1NlcnZpY2UsICRzdGF0ZSwgY3JlYXRlU2VydmljZSkge1xuXG4gICAgdmFyIHNpdGVBcnJheSA9IFtdO1xuXG4gICAgb3ZlcnZpZXdTZXJ2aWNlLm92ZXJWaWV3U2l0ZXMoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXG4gICAgICAgIHZhciBzaXRlT2JqID0gcmVzLmRhdGE7XG5cbiAgICAgICAgdmFyIGN1cnJlbnROYW1lO1xuICAgICAgICB2YXIgdGl0bGVzID0gW11cbiAgICAgICAgJHNjb3BlLnNpdGVvdmVydmlldyA9IHJlcy5kYXRhO1xuICAgICAgICAkc2NvcGUuc2hvd1NpdGVzID0gdHJ1ZTtcblxuICAgIH0pO1xuICAgIC8vIGZ1bmN0aW9uIHdpbGwgaGlkZSBzaXRlcyBhbmQgdGhlbiBicmluZyBpbiBzaXRlIGluZm9cbiAgICAkc2NvcGUuc2NoZWR1bGVTaGlmdCA9IGZ1bmN0aW9uKGlkTnVtKSB7XG4gICAgICAgICRzY29wZS5zaG93U2l0ZXMgPSBmYWxzZTtcblxuICAgICAgICBvdmVydmlld1NlcnZpY2Uuc2hvd0hvdXJzKGlkTnVtLnNpdGVfaWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAkc2NvcGUuaG91cnMgPSByZXMuZGF0YTtcbiAgICAgICAgICAgICRzY29wZS5zaGlmdHMgPSByZXMuZGF0YTtcblxuICAgICAgICB9KVxuICAgICAgICAkc3RhdGUuZ28oJ3NjaGVkdWxlLnNlbGVjdHNoaWZ0JylcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0ZWRTaGlmdHMgPSBbXTtcbiAgICAkc2NvcGUuYWRkU2hpZnROdW0gPSBmdW5jdGlvbihjb250cmFjdElkLCBzaGlmdE51bSkge1xuICAgICAgb3ZlcnZpZXdTZXJ2aWNlLmdldFVzZXJJZCgpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICB2YXIgZW1wSWQgPSByZXMuZGF0YS5wYXNzcG9ydC51c2VyLnVzZXJfaWQ7XG4gICAgICAgIGlmIChzaGlmdE51bSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRTaGlmdHMucHVzaCh7c2hpZnRfbnVtOiBzaGlmdE51bSwgY29udHJhY3RfdGltZV9mazogY29udHJhY3RJZCwgc2l0ZV9pZF9mazogJHNjb3BlLnNoaWZ0c1swXS5zaXRlX2lkX2ZrLCB1c2VyX2lkX2ZrOiBlbXBJZH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzZWxlY3RlZFNoaWZ0cy5tYXAoZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5jb250cmFjdF90aW1lX2ZrO1xuICAgICAgICAgICAgfSkuaW5kZXhPZihjb250cmFjdElkKTtcblxuICAgICAgICAgICAgc2VsZWN0ZWRTaGlmdHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICB9KVxuXG4gICAgfVxuXG5cblxuXG4gICAgJHNjb3BlLnN1Ym1pdEVtcFNoaWZ0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZFNoaWZ0cyk7XG4gICAgICAgIHNlbGVjdGVkU2hpZnRzLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaGVsbG8nKTtcbiAgICAgICAgICAgIG92ZXJ2aWV3U2VydmljZS5lbXBsb3llZVNjaGVkdWxlKHZhbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pXG5cbiAgICAgICAgfSlcblxuICAgICAgICBzZWxlY3RlZFNoaWZ0cyA9IFtdO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzZWxlY3RlZFNoaWZ0cyk7XG4gICAgfVxuXG5cblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ3NpZ25pbkN0cmwnLHNpZ25pbkN0cmwpXG5cbmZ1bmN0aW9uIHNpZ25pbkN0cmwoJHNjb3BlLGxvZ2luU2VydmljZSwkc3RhdGUpe1xuXG4vLyRzY29wZS5sb2dpbiA9IGZhbHNlO1xuJHNjb3BlLmRvbmUgPSBmYWxzZTtcbiRzY29wZS5yZWFsYnV0dG9uID0gZmFsc2U7XG5cbiRzY29wZS5iZWdpbmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgLy8gVHdlZW5NYXguc3RhZ2dlclRvKFwiLmxvZ2luLWJ1dHRvblwiLCAxLCB7cm90YXRpb246MzYwLCB5OjUwfSwgLjEpO1xuICAvLyAkc2NvcGUubG9naW4gPSBmYWxzZTtcbiAgJHNjb3BlLmRvbmUgPSB0cnVlO1xuICAvLyAkc2NvcGUucmVhbGJ1dHRvbiA9IGZhbHNlO1xufVxuXG4kc2NvcGUubG9naW4gPSB7XG4gIHVzZXJuYW1lOiAnYUBhLmNvbScsXG4gIHBhc3N3b3JkOiAnYSdcbn1cblxuXG4kc2NvcGUuc3VibWl0bG9naW4gPSBmdW5jdGlvbihsb2dpbil7XG4gIGxvZ2luU2VydmljZS5nZXRMb2dpbihsb2dpbilcbiAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgaWYocmVzLnN0YXR1cyA9PT0gMjAwKSAkc3RhdGUuZ28oJ21haW5wYWdlJyk7XG4gICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgfSk7XG59XG5cbn0vL2VuZCBvZiBob21lQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ3VwZGF0ZVNpdGVDdHJsJywgdXBkYXRlU2l0ZUN0cmwpO1xuXG5mdW5jdGlvbiB1cGRhdGVTaXRlQ3RybCgkc2NvcGUsIHVwZGF0ZVNlcnZpY2UsICRzdGF0ZSwgJGZpbHRlcikge1xuICAgICRzY29wZS5zaG93dXBkYXRlID0gdHJ1ZTtcbiAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZVNpdGUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS51cGRhdGVzaXRlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuY2hlY2tOdWxsID0gdHJ1ZTtcblxuICAgICRzY29wZS51cGRhdGVTaXRlID0gZnVuY3Rpb24oc2l0ZXZpZXcpIHtcbiAgICAgICAgJHNjb3BlLnNob3d1cGRhdGUgPSBmYWxzZTtcbiAgICAgICAgdXBkYXRlU2VydmljZS5hbGxTaXRlSW5mbyhzaXRldmlldy5zaXRlX2lkKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgICAgICAgJHNjb3BlLnNpdGV1cGRhdGUgPSByZXMuZGF0YS5zaXRlWzBdO1xuICAgICAgICAgICAgJHNjb3BlLmJlZ2ludGltZWNoYW5nZSA9IHJlcy5kYXRhLnNpdGVbMF0uY29udHJhY3RfYmVnaW5cbiAgICAgICAgICAgICRzY29wZS5lbmR0aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9lbmRcbiAgICAgICAgICAgICRzY29wZS5zaXRldXBkYXRlLmNvbnRyYWN0X2JlZ2luID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5iZWdpbnRpbWVjaGFuZ2UpO1xuICAgICAgICAgICAgJHNjb3BlLnNpdGV1cGRhdGUuY29udHJhY3RfZW5kID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5lbmR0aW1lY2hhbmdlKTtcbiAgICAgICAgICAgICRzY29wZS5jaGVja0Zvck51bGwgPSByZXMuZGF0YS5ob3Vyc2FuZHNpdGU7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuY2hlY2tGb3JOdWxsKTtcbiAgICAgICAgICAgICRzY29wZS50aW1lcyA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICAgICAgfSlcbiAgICAgICAgJHN0YXRlLmdvKCd1cGRhdGVzaXRlLnVwZGF0ZWZ1bGxzaXRlJylcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VibWl0VXBkYXRlID0gZnVuY3Rpb24oc2l0ZSx0aW1lKXtcbiAgICAgIGNvbnNvbGUubG9nKHNpdGUpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aW1lKTtcbiAgICAgIHZhciBzaXRlSWROdW0gPSBzaXRlLnNpdGVfaWQ7XG4gICAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZXNpdGUoc2l0ZUlkTnVtLHNpdGUpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICB9KVxuICAgICAgdGltZS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG5cbiAgICAgICAgdmFyIHNpdGVJZCA9IHZhbC5jb250cmFjdF90aW1lX2lkO1xuICAgICAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZWhvdXJzKHNpdGVJZCx2YWwpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7fSk7XG4gICAgICAgIHNpdGVJZCA9MDtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdXBkYXRlU2VydmljZS5zaG93ZW1wbG95ZWUoKVxuICAgIC50aGVuKGZ1bmN0aW9uKGVtcCl7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlbXApO1xuXG4gICAgICAkc2NvcGUuZW1wbG95ZWUgPSBlbXAuZGF0YTtcbiAgICB9KVxuXG4gICAgJHNjb3BlLnVwZGF0ZUVtcCA9IGZ1bmN0aW9uKGVtcCl7XG4gICAgICAkc2NvcGUuc2hvd3VwZGF0ZSA9IGZhbHNlO1xuICAgICAgJHNjb3BlLmVtcHVwZGF0ZSA9IGVtcFxuICAgICAgY29uc29sZS5sb2coZW1wKTtcbiAgICAgICRzdGF0ZS5nbygnc2hvd2VtcGxveWVlLnVwZGF0ZWVtcGxveWVlJylcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VibWl0RW1wbG95ZWUgPSBmdW5jdGlvbihlbXBjaGFuZ2Upe1xuICAgICAgdmFyIGVtcGxveWVlSWQgPSBlbXBjaGFuZ2UudXNlcl9pZDtcbiAgICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlZW1wbG95ZWUoZW1wbG95ZWVJZCxlbXBjaGFuZ2UpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXMpe30pO1xuICAgIH1cblxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uYW5pbWF0aW9uKCcuc2xpZGUtZG93bicsIGZ1bmN0aW9uKCkge1xucmV0dXJuIHtcbiAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuICAgICAgVHdlZW5NYXguZnJvbShlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuICAgIH0sXG4gICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbiAgICAgIFR3ZWVuTWF4LnRvKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4gICAgfVxuICB9XG59KTtcblxuLy8gKCcubWFpbi1jb250ZW50JywgW2Z1bmN0aW9uKCl7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbi8vICAgICAgIFR3ZWVuTWF4LmZyb20oZWxlbWVudCwgMSwge29wYWNpdHk6MCwgeTo1MCwgb25Db21wbGV0ZTpkb25lfSlcbi8vICAgICB9LFxuLy8gICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lKSB7XG4vLyAgICAgICBUd2Vlbk1heC50byhlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfV0pXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbn0pIC8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmRpcmVjdGl2ZSgndGl0bGVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L3RpdGxlLmh0bWwnXG5cbiAgICAgIH1cblxufSkvL2VuZCBvZiBkaXJlY3RpdmVcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5zZXJ2aWNlKCdjcmVhdGVTZXJ2aWNlJywgY3JlYXRlU2VydmljZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2UoJGh0dHAsICRxKSB7XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzaXRlIHcvbyBkYXlzIGFuZCBob3Vyc1xuICAgIHZhciBzaXRlSWQ7XG4gICAgdGhpcy5zaGlmdHMgPSBbXTtcbiAgICB0aGlzLnNpdGU7XG4gICAgdGhpcy5jcmVhdGVzaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVzaXRlXCIsIGRhdGE6IG9ian0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBzaXRlSWQgPSByZXMuZGF0YVswXS5zaXRlX2lkO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSByZXN0IG9mIHRoZSBzaXRlIC0tIGRheXMgYW5kIGhvdXJzXG4gICAgdGhpcy5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNoaWZ0KTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZCA9IHNpdGVJZDtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZWRheWFuZGhvdXJzXCIsIGRhdGE6IHNoaWZ0fSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIGVtcGxveWVlXG4gICAgdmFyIGVtcGxveWVlSWQ7XG4gICAgdGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCkge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZW1wbG95ZWVcIiwgZGF0YTogZW1wfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIGVtcGxveWVlSWQgPSByZXMuZGF0YVswXS51c2VyX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZW1wbG95ZWVJZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhlIHNpdGUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe3RpdGxlOiBcIlNpdGUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoYXQgdGhlIGVtcGxveWVlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLmVtcGxveWVlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiRW1wbG95ZWUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5hZGR0b1NoaWZ0cyA9IGZ1bmN0aW9uKHNoaWZ0cykge1xuICAgICAgICB0aGlzLnNoaWZ0cy5wdXNoKHNoaWZ0cyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2hpZnRzKTtcblxuICAgIH07XG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbG9naW5TZXJ2aWNlJyxsb2dpblNlcnZpY2UpO1xuXG5cbmZ1bmN0aW9uIGxvZ2luU2VydmljZSgkaHR0cCl7XG5cbnRoaXMuZ2V0TG9naW4gPSBmdW5jdGlvbihsb2dpbil7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDonL2F1dGgvbG9naW4nLFxuICAgIGRhdGE6IGxvZ2luXG4gIH0pO1xufVxuXG5cblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdtYWlucGFnZVNlcnZpY2UnLG1haW5wYWdlU2VydmljZSk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlU2VydmljZSgkaHR0cCl7XG5cbnRoaXMuZ2V0Y3VycmVudCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOiBcIi9hdXRoL2N1cnJlbnRcIlxuICB9KVxufVxuXG50aGlzLmdldFVzZXJTaXRlcyA9IGZ1bmN0aW9uKHVzZXJTaXRlSWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9nZXRVc2VyU2l0ZXMvXCIgKyB1c2VyU2l0ZUlkXG4gIH0pXG59XG5cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnb3ZlcnZpZXdTZXJ2aWNlJyxvdmVydmlld1NlcnZpY2UpXG5cbmZ1bmN0aW9uIG92ZXJ2aWV3U2VydmljZSgkaHR0cCl7XG5cbnRoaXMub3ZlclZpZXdTaXRlcyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL3NpdGVvdmVydmlld1wiXG4gIH0pXG59XG5cbnRoaXMuc2hvd0RheXMgPSBmdW5jdGlvbihpZE51bSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL3NjaGVkdWxlRGF5cy9cIiArIGlkTnVtXG4gIH0pXG59XG5cbnRoaXMuc2hvd0hvdXJzID0gZnVuY3Rpb24oaWROdW0pe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDogXCIvc2NoZWR1bGVIb3Vycy9cIiArIGlkTnVtXG4gIH0pXG59XG5cbnRoaXMuZW1wbG95ZWVTY2hlZHVsZSA9IGZ1bmN0aW9uKHNjaGVkdWxlU2hpZnQpe1xuICAvLyBjb25zb2xlLmxvZyhzY2hlZHVsZVNoaWZ0KTtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJQT1NUXCIsXG4gICAgdXJsOlwiL2VtcGxveWVlc2NoZWR1bGVcIixcbiAgICBkYXRhOnNjaGVkdWxlU2hpZnRcbiAgfSlcbn1cblxudGhpcy5nZXRVc2VySW5mbyA9IGZ1bmN0aW9uKHVzZXJJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL2dldFVzZXJJbmZvL1wiICsgdXNlcklkXG4gIH0pXG59XG5cbnRoaXMuZ2V0VXNlcklkID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvYXV0aC9jdXJyZW50XCJcbiAgfSlcbn1cblxuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ3VwZGF0ZVNlcnZpY2UnLHVwZGF0ZVNlcnZpY2UpXG5cbmZ1bmN0aW9uIHVwZGF0ZVNlcnZpY2UoJGh0dHApe1xuXG50aGlzLnVwZGF0ZVNpdGUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDonL3NpdGVvdmVydmlldydcbiAgfSlcbn1cblxudGhpcy5hbGxTaXRlSW5mbyA9IGZ1bmN0aW9uKHNpdGVJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOicvZ2V0c2l0ZWFuZGhvdXJzLycgKyBzaXRlSWRcbiAgfSlcbn1cblxudGhpcy51cGRhdGVzaXRlID0gZnVuY3Rpb24odXBkYXRlSWQsdXBkYXRlU2l0ZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDonL3VwZGF0ZXNpdGUvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZVNpdGVcbiAgfSlcbn1cblxudGhpcy51cGRhdGVob3VycyA9IGZ1bmN0aW9uKHVwZGF0ZUlkLCB1cGRhdGVUaW1lKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgdXJsOicvdXBkYXRlaG91cnMvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZVRpbWVcbiAgfSlcbn1cblxudGhpcy51cGRhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKHVwZGF0ZUlkLCB1cGRhdGVFbXBsb3llZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDogJy91cGRhdGVlbXBsb3llZS8nICsgdXBkYXRlSWQsXG4gICAgZGF0YTogdXBkYXRlRW1wbG95ZWVcbiAgfSlcbn1cblxudGhpcy5zaG93ZW1wbG95ZWUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB1cmw6XCIvdmlld2VtcGxveWVlXCJcbiAgfSlcbn1cblxuXG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
