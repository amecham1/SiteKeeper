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
        createService.day = day;
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
        shift.contract_day = createService.day;
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
      console.log(shift);
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
    this.day;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVDdHJsLmpzIiwiY29tcG9uZW50cy9zaWduaW4vc2lnbmluQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGVDdHJsLmpzIiwic2hhcmVkL2FuaW1hdGlvbnMvdWktdmlldy1hbmltYXRpb24uanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9tZW51L3RpdGxlLWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9jcmVhdGVTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL2xvZ2luU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9tYWlucGFnZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvb3ZlcnZpZXdTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3VwZGF0ZVNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJywgWyd1aS5yb3V0ZXInLCd1aS5ib290c3RyYXAnLCduZ0FuaW1hdGUnLCdzYXRlbGxpemVyJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIpIHtcblxuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ3NpZ25pbicse1xuICAgICAgdXJsOicvJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvc2lnbmluL3NpZ25pbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzaWduaW5DdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtYWlucGFnZScse1xuICAgICAgdXJsOicvbWFpbnBhZ2UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9tYWluL21haW5wYWdlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ21haW5wYWdlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZScse1xuICAgICAgdXJsOicvY3JlYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGVkYXlzJywge1xuICAgICAgdXJsOiAnL2RheXMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZXNpdGVkYXlzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdob3VyJyx7XG4gICAgICB1cmw6Jy9ob3VycycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVob3Vycy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgndXBkYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL3VwZGF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL2NyZWF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzY2hlZHVsZScse1xuICAgICAgdXJsOicvc2NoZWR1bGVzaXRlcycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3NjaGVkdWxlLnNlbGVjdHNoaWZ0Jyx7XG4gICAgICB1cmw6Jy9zY2hlZHVsZXNoaWZ0cycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVzaGlmdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUnLHtcbiAgICAgIHVybDonL3VwZGF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUudXBkYXRlZnVsbHNpdGUnLHtcbiAgICAgIHVybDonL2Z1bGxzaXRldXBkYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZnVsbHNpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hvd2VtcGxveWVlJyx7XG4gICAgICB1cmw6Jy92aWV3ZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3ZpZXdfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hvd2VtcGxveWVlLnVwZGF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy91cGRhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ3VwZGF0ZVNpdGVDdHJsJ1xuICAgIH0pXG5cblxuXG5cblxuXG59KTsvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdjcmVhdGVTaXRlQ3RybCcsIGNyZWF0ZVNpdGVDdHJsKVxuXG5mdW5jdGlvbiBjcmVhdGVTaXRlQ3RybCgkc2NvcGUsIGNyZWF0ZVNlcnZpY2UsICRzdGF0ZSkge1xuJHNjb3BlLnNob3dzaGlmdHMxID0gZmFsc2U7XG4gICAgLy8gR29lcyBmcm9tIGNyZWF0ZSBzaXRlIHRvIGNyZWF0ZSBkYXlzIGFsc28gY3JlYXRlcyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgc2l0ZVxuICAgICRzY29wZS5uZXh0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUobmFtZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLnNpdGVJZCA9IHJlc3BvbnNlLmRhdGFbMF0uc2l0ZV9pZDtcbiAgICAgICAgICAgIGNyZWF0ZVNlcnZpY2Uuc2l0ZT0kc2NvcGUuc2l0ZUlkO1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgLy8gT3BlbnMgc3VidmlldyBmcm9tIGNyZWF0ZSBkYXlzIGludG8gY3JlYXRlIGhvdXJzXG4gICAgJHNjb3BlLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oZGF5KSB7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuZGF5ID0gZGF5O1xuICAgICAgICAkc3RhdGUuZ28oJ2hvdXInKTtcbiAgICB9XG4gICAgLy8gY2xlYXJzIGFsbCBvZiB0aGUgY2xvY2sgaW5mb1xuICAgICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuc2hpZnQgPSBudWxsO1xuICAgIH07XG4gICAgLy8gY2xvY2sgc3RlcCBpbmNyZWFzZXNcbiAgICAkc2NvcGUuaHN0ZXAgPSAxO1xuICAgICRzY29wZS5tc3RlcCA9IDE1O1xuXG4gICAgLy8gY3JlYXRlcyB0aGUgc2hpZnQgb2JqZWN0IGFuZCB0aGVuIHB1c2hlcyBpdCBpbnRvIHRoZSBzZXJ2aWNlXG4gICAgJHNjb3BlLmdldE1vcmVIb3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG5cblxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNoaWZ0KSB7XG4gICAgICAgICAgICBzaGlmdFtwcm9wXSA9IChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldEhvdXJzKCkgKyAnOicgKyAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRNaW51dGVzKClcbiAgICAgICAgfVxuICAgICAgICBzaGlmdC5jb250cmFjdF9kYXkgPSBjcmVhdGVTZXJ2aWNlLmRheTtcbiAgICAgICAgc2hpZnQuc2l0ZUlkID0gY3JlYXRlU2VydmljZS5zaXRlO1xuICAgICAgICBzaGlmdC5zaXRlX2lkX2ZrID0gY3JlYXRlU2VydmljZS5zaXRlO1xuXG4gICAgICAgICRzY29wZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAgICAgfTtcblxuXG4gICAgJHNjb3BlLmVtcGxveWVlSWQ7XG4gICAgLy8gY3JlYXRlcyBhbiBlbXBsb3llZSBhbmQgcmV0dXJucyB0aGF0IGlkXG4gICAgJHNjb3BlLmNyZWF0ZUVtcGxveWVlID0gZnVuY3Rpb24oZW1wbG95ZWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVlbXBsb3llZShlbXBsb3llZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5lbXBsb3llZUlkID0gcmVzcG9uc2UuZGF0YVswXS51c2VyX2lkO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnQpe1xuICAgICAgY29uc29sZS5sb2coc2hpZnQpO1xuICAgICAgY3JlYXRlU2VydmljZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUuZ2V0VGltZXM9ZnVuY3Rpb24oKXtcbiAgICAgIGNyZWF0ZVNlcnZpY2Uuc2hpZnRzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcbiAgICAgICAgaWYoIXZhbCl7XG4gICAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWhvdXJzKHZhbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgICAgfVxuICAgICAgfSlcblxuICAgIH1cblxuXG4gICAgJHNjb3BlLnBpY2tTaGlmdCA9IGZ1bmN0aW9uKHYpe1xuXG4gICAgaWYodiA9PT0gMSl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czEgPSAhJHNjb3BlLnNob3dzaGlmdHMxO1xuICAgIH1cbiAgICBpZih2ID09PSAyKXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzMiA9ICEkc2NvcGUuc2hvd3NoaWZ0czI7XG4gICAgfVxuICAgIGlmKHYgPT09IDMpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHMzID0gISRzY29wZS5zaG93c2hpZnRzMztcbiAgICB9XG4gICAgaWYodiA9PT0gNCl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czQgPSAhJHNjb3BlLnNob3dzaGlmdHM0O1xuICAgIH1cblxuICAgIH1cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWlucGFnZUN0cmwnLG1haW5wYWdlQ3RybCk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlQ3RybCgkc2NvcGUsbWFpbnBhZ2VTZXJ2aWNlLG92ZXJ2aWV3U2VydmljZSl7XG5cbm1haW5wYWdlU2VydmljZS5nZXRjdXJyZW50KClcbi50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gIHZhciBzaXRlVXNlcklkID0gcmVzLmRhdGEucGFzc3BvcnQudXNlci51c2VyX2lkO1xuICAkc2NvcGUudXNlcnNpdGVzID0gcmVzLmRhdGEucGFzc3BvcnQudXNlcjtcbiAgbWFpbnBhZ2VTZXJ2aWNlLmdldFVzZXJTaXRlcyhzaXRlVXNlcklkKVxuICAudGhlbihmdW5jdGlvbih1c2VyU2l0ZXMpe1xuXG4gIGNvbnNvbGUubG9nKHVzZXJTaXRlcy5kYXRhKTtcblxuICB9KVxuXG5cbn0pXG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ3NjaGVkdWxlQ3RybCcsIHNjaGVkdWxlQ3RybClcblxuZnVuY3Rpb24gc2NoZWR1bGVDdHJsKCRzY29wZSwgb3ZlcnZpZXdTZXJ2aWNlLCAkc3RhdGUsIGNyZWF0ZVNlcnZpY2UpIHtcblxuICAgIHZhciBzaXRlQXJyYXkgPSBbXTtcblxuICAgIG92ZXJ2aWV3U2VydmljZS5vdmVyVmlld1NpdGVzKCkudGhlbihmdW5jdGlvbihyZXMpIHtcblxuICAgICAgICB2YXIgc2l0ZU9iaiA9IHJlcy5kYXRhO1xuXG4gICAgICAgIHZhciBjdXJyZW50TmFtZTtcbiAgICAgICAgdmFyIHRpdGxlcyA9IFtdXG4gICAgICAgICRzY29wZS5zaXRlb3ZlcnZpZXcgPSByZXMuZGF0YTtcbiAgICAgICAgJHNjb3BlLnNob3dTaXRlcyA9IHRydWU7XG5cbiAgICB9KTtcbiAgICAvLyBmdW5jdGlvbiB3aWxsIGhpZGUgc2l0ZXMgYW5kIHRoZW4gYnJpbmcgaW4gc2l0ZSBpbmZvXG4gICAgJHNjb3BlLnNjaGVkdWxlU2hpZnQgPSBmdW5jdGlvbihpZE51bSkge1xuICAgICAgICAkc2NvcGUuc2hvd1NpdGVzID0gZmFsc2U7XG5cbiAgICAgICAgb3ZlcnZpZXdTZXJ2aWNlLnNob3dIb3VycyhpZE51bS5zaXRlX2lkKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgJHNjb3BlLmhvdXJzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAkc2NvcGUuc2hpZnRzID0gcmVzLmRhdGE7XG5cbiAgICAgICAgfSlcbiAgICAgICAgJHN0YXRlLmdvKCdzY2hlZHVsZS5zZWxlY3RzaGlmdCcpXG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGVkU2hpZnRzID0gW107XG4gICAgJHNjb3BlLmFkZFNoaWZ0TnVtID0gZnVuY3Rpb24oY29udHJhY3RJZCwgc2hpZnROdW0pIHtcbiAgICAgIG92ZXJ2aWV3U2VydmljZS5nZXRVc2VySWQoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgdmFyIGVtcElkID0gcmVzLmRhdGEucGFzc3BvcnQudXNlci51c2VyX2lkO1xuICAgICAgICBpZiAoc2hpZnROdW0pIHtcbiAgICAgICAgICAgIHNlbGVjdGVkU2hpZnRzLnB1c2goe3NoaWZ0X251bTogc2hpZnROdW0sIGNvbnRyYWN0X3RpbWVfZms6IGNvbnRyYWN0SWQsIHNpdGVfaWRfZms6ICRzY29wZS5zaGlmdHNbMF0uc2l0ZV9pZF9maywgdXNlcl9pZF9mazogZW1wSWR9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VsZWN0ZWRTaGlmdHMubWFwKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWwuY29udHJhY3RfdGltZV9maztcbiAgICAgICAgICAgIH0pLmluZGV4T2YoY29udHJhY3RJZCk7XG5cbiAgICAgICAgICAgIHNlbGVjdGVkU2hpZnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgfSlcblxuICAgIH1cblxuXG5cblxuICAgICRzY29wZS5zdWJtaXRFbXBTaGlmdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRTaGlmdHMpO1xuICAgICAgICBzZWxlY3RlZFNoaWZ0cy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2hlbGxvJyk7XG4gICAgICAgICAgICBvdmVydmlld1NlcnZpY2UuZW1wbG95ZWVTY2hlZHVsZSh2YWwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHt9KVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgc2VsZWN0ZWRTaGlmdHMgPSBbXTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc2VsZWN0ZWRTaGlmdHMpO1xuICAgIH1cblxuXG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdzaWduaW5DdHJsJyxzaWduaW5DdHJsKVxuXG5mdW5jdGlvbiBzaWduaW5DdHJsKCRzY29wZSxsb2dpblNlcnZpY2UsJHN0YXRlKXtcblxuLy8kc2NvcGUubG9naW4gPSBmYWxzZTtcbiRzY29wZS5kb25lID0gZmFsc2U7XG4kc2NvcGUucmVhbGJ1dHRvbiA9IGZhbHNlO1xuXG4kc2NvcGUuYmVnaW5sb2dpbiA9IGZ1bmN0aW9uKCl7XG4gIC8vIFR3ZWVuTWF4LnN0YWdnZXJUbyhcIi5sb2dpbi1idXR0b25cIiwgMSwge3JvdGF0aW9uOjM2MCwgeTo1MH0sIC4xKTtcbiAgLy8gJHNjb3BlLmxvZ2luID0gZmFsc2U7XG4gICRzY29wZS5kb25lID0gdHJ1ZTtcbiAgLy8gJHNjb3BlLnJlYWxidXR0b24gPSBmYWxzZTtcbn1cblxuJHNjb3BlLmxvZ2luID0ge1xuICB1c2VybmFtZTogJ2FAYS5jb20nLFxuICBwYXNzd29yZDogJ2EnXG59XG5cblxuJHNjb3BlLnN1Ym1pdGxvZ2luID0gZnVuY3Rpb24obG9naW4pe1xuICBsb2dpblNlcnZpY2UuZ2V0TG9naW4obG9naW4pXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgIGlmKHJlcy5zdGF0dXMgPT09IDIwMCkgJHN0YXRlLmdvKCdtYWlucGFnZScpO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgIH0pO1xufVxuXG59Ly9lbmQgb2YgaG9tZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCd1cGRhdGVTaXRlQ3RybCcsIHVwZGF0ZVNpdGVDdHJsKTtcblxuZnVuY3Rpb24gdXBkYXRlU2l0ZUN0cmwoJHNjb3BlLCB1cGRhdGVTZXJ2aWNlLCAkc3RhdGUsICRmaWx0ZXIpIHtcbiAgICAkc2NvcGUuc2hvd3VwZGF0ZSA9IHRydWU7XG4gICAgdXBkYXRlU2VydmljZS51cGRhdGVTaXRlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUudXBkYXRlc2l0ZXMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmNoZWNrTnVsbCA9IHRydWU7XG5cbiAgICAkc2NvcGUudXBkYXRlU2l0ZSA9IGZ1bmN0aW9uKHNpdGV2aWV3KSB7XG4gICAgICAgICRzY29wZS5zaG93dXBkYXRlID0gZmFsc2U7XG4gICAgICAgIHVwZGF0ZVNlcnZpY2UuYWxsU2l0ZUluZm8oc2l0ZXZpZXcuc2l0ZV9pZCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcbiAgICAgICAgICAgICRzY29wZS5zaXRldXBkYXRlID0gcmVzLmRhdGEuc2l0ZVswXTtcbiAgICAgICAgICAgICRzY29wZS5iZWdpbnRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2JlZ2luXG4gICAgICAgICAgICAkc2NvcGUuZW5kdGltZWNoYW5nZSA9IHJlcy5kYXRhLnNpdGVbMF0uY29udHJhY3RfZW5kXG4gICAgICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9iZWdpbiA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuYmVnaW50aW1lY2hhbmdlKTtcbiAgICAgICAgICAgICRzY29wZS5zaXRldXBkYXRlLmNvbnRyYWN0X2VuZCA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuZW5kdGltZWNoYW5nZSk7XG4gICAgICAgICAgICAkc2NvcGUuY2hlY2tGb3JOdWxsID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmNoZWNrRm9yTnVsbCk7XG4gICAgICAgICAgICAkc2NvcGUudGltZXMgPSByZXMuZGF0YS5ob3Vyc2FuZHNpdGU7XG4gICAgICAgIH0pXG4gICAgICAgICRzdGF0ZS5nbygndXBkYXRlc2l0ZS51cGRhdGVmdWxsc2l0ZScpXG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Ym1pdFVwZGF0ZSA9IGZ1bmN0aW9uKHNpdGUsdGltZSl7XG4gICAgICBjb25zb2xlLmxvZyhzaXRlKTtcbiAgICAgICAgY29uc29sZS5sb2codGltZSk7XG4gICAgICB2YXIgc2l0ZUlkTnVtID0gc2l0ZS5zaXRlX2lkO1xuICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVzaXRlKHNpdGVJZE51bSxzaXRlKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgfSlcbiAgICAgIHRpbWUuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuXG4gICAgICAgIHZhciBzaXRlSWQgPSB2YWwuY29udHJhY3RfdGltZV9pZDtcbiAgICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVob3VycyhzaXRlSWQsdmFsKVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe30pO1xuICAgICAgICBzaXRlSWQgPTA7XG4gICAgICB9KVxuICAgIH1cblxuICAgIHVwZGF0ZVNlcnZpY2Uuc2hvd2VtcGxveWVlKClcbiAgICAudGhlbihmdW5jdGlvbihlbXApe1xuICAgICAgLy8gY29uc29sZS5sb2coZW1wKTtcblxuICAgICAgJHNjb3BlLmVtcGxveWVlID0gZW1wLmRhdGE7XG4gICAgfSlcblxuICAgICRzY29wZS51cGRhdGVFbXAgPSBmdW5jdGlvbihlbXApe1xuICAgICAgJHNjb3BlLnNob3d1cGRhdGUgPSBmYWxzZTtcbiAgICAgICRzY29wZS5lbXB1cGRhdGUgPSBlbXBcbiAgICAgIGNvbnNvbGUubG9nKGVtcCk7XG4gICAgICAkc3RhdGUuZ28oJ3Nob3dlbXBsb3llZS51cGRhdGVlbXBsb3llZScpXG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Ym1pdEVtcGxveWVlID0gZnVuY3Rpb24oZW1wY2hhbmdlKXtcbiAgICAgIHZhciBlbXBsb3llZUlkID0gZW1wY2hhbmdlLnVzZXJfaWQ7XG4gICAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZWVtcGxveWVlKGVtcGxveWVlSWQsZW1wY2hhbmdlKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXt9KTtcbiAgICB9XG5cblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmFuaW1hdGlvbignLnNsaWRlLWRvd24nLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuICAgICAgVHdlZW5NYXguZnJvbShlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuICAgIH0sXG4gICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbiAgICAgIFR3ZWVuTWF4LnRvKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4gICAgfVxuICB9XG59KTtcblxuLy8gKCcubWFpbi1jb250ZW50JywgW2Z1bmN0aW9uKCl7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbi8vICAgICAgIFR3ZWVuTWF4LmZyb20oZWxlbWVudCwgMSwge29wYWNpdHk6MCwgeTo1MCwgb25Db21wbGV0ZTpkb25lfSlcbi8vICAgICB9LFxuLy8gICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lKSB7XG4vLyAgICAgICBUd2Vlbk1heC50byhlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfV0pXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbn0pIC8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmRpcmVjdGl2ZSgndGl0bGVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L3RpdGxlLmh0bWwnXG5cbiAgICAgIH1cblxufSkvL2VuZCBvZiBkaXJlY3RpdmVcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5zZXJ2aWNlKCdjcmVhdGVTZXJ2aWNlJywgY3JlYXRlU2VydmljZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2UoJGh0dHAsICRxKSB7XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzaXRlIHcvbyBkYXlzIGFuZCBob3Vyc1xuICAgIHZhciBzaXRlSWQ7XG4gICAgdGhpcy5zaGlmdHMgPSBbXTtcbiAgICB0aGlzLnNpdGU7XG4gICAgdGhpcy5kYXk7XG4gICAgdGhpcy5jcmVhdGVzaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVzaXRlXCIsIGRhdGE6IG9ian0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBzaXRlSWQgPSByZXMuZGF0YVswXS5zaXRlX2lkO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSByZXN0IG9mIHRoZSBzaXRlIC0tIGRheXMgYW5kIGhvdXJzXG4gICAgdGhpcy5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNoaWZ0KTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZCA9IHNpdGVJZDtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZWRheWFuZGhvdXJzXCIsIGRhdGE6IHNoaWZ0fSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIGVtcGxveWVlXG4gICAgdmFyIGVtcGxveWVlSWQ7XG4gICAgdGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCkge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZW1wbG95ZWVcIiwgZGF0YTogZW1wfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIGVtcGxveWVlSWQgPSByZXMuZGF0YVswXS51c2VyX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZW1wbG95ZWVJZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhlIHNpdGUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe3RpdGxlOiBcIlNpdGUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoYXQgdGhlIGVtcGxveWVlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLmVtcGxveWVlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiRW1wbG95ZWUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5hZGR0b1NoaWZ0cyA9IGZ1bmN0aW9uKHNoaWZ0cykge1xuICAgICAgICB0aGlzLnNoaWZ0cy5wdXNoKHNoaWZ0cyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2hpZnRzKTtcblxuICAgIH07XG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbG9naW5TZXJ2aWNlJyxsb2dpblNlcnZpY2UpO1xuXG5cbmZ1bmN0aW9uIGxvZ2luU2VydmljZSgkaHR0cCl7XG5cbnRoaXMuZ2V0TG9naW4gPSBmdW5jdGlvbihsb2dpbil7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDonL2F1dGgvbG9naW4nLFxuICAgIGRhdGE6IGxvZ2luXG4gIH0pO1xufVxuXG5cblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdtYWlucGFnZVNlcnZpY2UnLG1haW5wYWdlU2VydmljZSk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlU2VydmljZSgkaHR0cCl7XG5cbnRoaXMuZ2V0Y3VycmVudCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOiBcIi9hdXRoL2N1cnJlbnRcIlxuICB9KVxufVxuXG50aGlzLmdldFVzZXJTaXRlcyA9IGZ1bmN0aW9uKHVzZXJTaXRlSWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9nZXRVc2VyU2l0ZXMvXCIgKyB1c2VyU2l0ZUlkXG4gIH0pXG59XG5cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnb3ZlcnZpZXdTZXJ2aWNlJyxvdmVydmlld1NlcnZpY2UpXG5cbmZ1bmN0aW9uIG92ZXJ2aWV3U2VydmljZSgkaHR0cCl7XG5cbnRoaXMub3ZlclZpZXdTaXRlcyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL3NpdGVvdmVydmlld1wiXG4gIH0pXG59XG5cbnRoaXMuc2hvd0RheXMgPSBmdW5jdGlvbihpZE51bSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL3NjaGVkdWxlRGF5cy9cIiArIGlkTnVtXG4gIH0pXG59XG5cbnRoaXMuc2hvd0hvdXJzID0gZnVuY3Rpb24oaWROdW0pe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDogXCIvc2NoZWR1bGVIb3Vycy9cIiArIGlkTnVtXG4gIH0pXG59XG5cbnRoaXMuZW1wbG95ZWVTY2hlZHVsZSA9IGZ1bmN0aW9uKHNjaGVkdWxlU2hpZnQpe1xuICAvLyBjb25zb2xlLmxvZyhzY2hlZHVsZVNoaWZ0KTtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJQT1NUXCIsXG4gICAgdXJsOlwiL2VtcGxveWVlc2NoZWR1bGVcIixcbiAgICBkYXRhOnNjaGVkdWxlU2hpZnRcbiAgfSlcbn1cblxudGhpcy5nZXRVc2VySW5mbyA9IGZ1bmN0aW9uKHVzZXJJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL2dldFVzZXJJbmZvL1wiICsgdXNlcklkXG4gIH0pXG59XG5cbnRoaXMuZ2V0VXNlcklkID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvYXV0aC9jdXJyZW50XCJcbiAgfSlcbn1cblxuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ3VwZGF0ZVNlcnZpY2UnLHVwZGF0ZVNlcnZpY2UpXG5cbmZ1bmN0aW9uIHVwZGF0ZVNlcnZpY2UoJGh0dHApe1xuXG50aGlzLnVwZGF0ZVNpdGUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDonL3NpdGVvdmVydmlldydcbiAgfSlcbn1cblxudGhpcy5hbGxTaXRlSW5mbyA9IGZ1bmN0aW9uKHNpdGVJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOicvZ2V0c2l0ZWFuZGhvdXJzLycgKyBzaXRlSWRcbiAgfSlcbn1cblxudGhpcy51cGRhdGVzaXRlID0gZnVuY3Rpb24odXBkYXRlSWQsdXBkYXRlU2l0ZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDonL3VwZGF0ZXNpdGUvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZVNpdGVcbiAgfSlcbn1cblxudGhpcy51cGRhdGVob3VycyA9IGZ1bmN0aW9uKHVwZGF0ZUlkLCB1cGRhdGVUaW1lKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgdXJsOicvdXBkYXRlaG91cnMvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZVRpbWVcbiAgfSlcbn1cblxudGhpcy51cGRhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKHVwZGF0ZUlkLCB1cGRhdGVFbXBsb3llZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDogJy91cGRhdGVlbXBsb3llZS8nICsgdXBkYXRlSWQsXG4gICAgZGF0YTogdXBkYXRlRW1wbG95ZWVcbiAgfSlcbn1cblxudGhpcy5zaG93ZW1wbG95ZWUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB1cmw6XCIvdmlld2VtcGxveWVlXCJcbiAgfSlcbn1cblxuXG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiJdfQ==
