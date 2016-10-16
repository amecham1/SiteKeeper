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
    .state('selectshift',{
      url:'/scheduleshifts',
      templateUrl:'app/components/schedule/scheduleshifts.html',
      controller:'schedulehoursCtrl'
    })
    .state('updatesite',{
      url:'/updatesite',
      templateUrl:'app/components/update_site/update_site.html',
      controller:'updateSiteCtrl'
    })
    .state('updatefullsite',{
      url:'/fullsiteupdate',
      templateUrl:'app/components/update_site/update_fullsite.html',
      controller:'fullsiteCtrl'
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

function scheduleCtrl($scope, overviewService, $state) {

    // var siteArray = [];

    overviewService.overViewSites().then(function(res) {
        var siteObj = res.data;
        $scope.siteoverview = res.data;
    });
    // function will hide sites and then bring in site info
    $scope.scheduleShift = function(idNum) {
      overviewService.idNumVar = 2;
      $state.go('selectshift')
    }


} //end of controller

angular.module('keeperApp').controller('schedulehoursCtrl', schedulehoursCtrl)

function schedulehoursCtrl($scope, overviewService, $state) {

    overviewService.showHours(overviewService.idNumVar).then(function(res) {
      console.log(overviewService.idNumVar);
        $scope.hours = res.data;
        $scope.shifts = res.data;

    })

    var selectedShifts = [];
    $scope.addShiftNum = function(contractId, shiftNum) {
      console.log(contractId,'contractId');
      console.log(shiftNum,'shiftNum');
        overviewService.getUserId().then(function(res) {
          console.log(res, 'getUserId');
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
      console.log('fired');
      console.log(selectedShifts);
        selectedShifts.forEach(function(val) {
            overviewService.employeeSchedule(val).then(function(response) {})
        })
        selectedShifts = [];
    }

} //end of controller

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope,loginService,$state){




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

angular.module('keeperApp').controller('fullsiteCtrl', fullsiteCtrl);

function fullsiteCtrl($scope, updateService, $state,$filter) {


    updateService.allSiteInfo(25).then(function(res) {
        console.log(res.data);
        $scope.siteupdate = res.data.site[0];
        $scope.begintimechange = res.data.site[0].contract_begin;
        $scope.endtimechange = res.data.site[0].contract_end;
        $scope.siteupdate.contract_begin = $filter('date')($scope.begintimechange);
        $scope.siteupdate.contract_end = $filter('date')($scope.endtimechange);
        // $scope.checkForNull = res.data.hoursandsite;
        // console.log($scope.checkForNull);
        console.log(res.data.hoursandsite);
        $scope.times = res.data.hoursandsite;
    });

    $scope.submitUpdate = function(site, time) {
        // console.log(site);
        // console.log(time);
        var siteIdNum = site.site_id;
        updateService.updatesite(siteIdNum, site).then(function(response) {});
        time.forEach(function(val) {

            var siteId = val.contract_time_id;
            updateService.updatehours(siteId, val).then(function(res) {});
            siteId = 0;
        });
    };

} //end of controller

angular.module('keeperApp').controller('updateSiteCtrl', updateSiteCtrl);

function updateSiteCtrl($scope, updateService, $state) {



    updateService.updateSite().then(function(response) {
        $scope.updatesites = response.data;
        // return updateService.siteView = response.data;
        // console.log(response.data);
    });

    // $scope.checkNull = true;

    $scope.updateSite = function(siteview) {
      console.log(siteview.site_id);
    //  updateService.getSiteId(siteview.site_id);
        // console.log(updateService.siteView);
        $state.go('updatefullsite');
  };

        // updateService.allSiteInfo(updateService.siteview.site_id).then(function(res) {
        //     // console.log(res.data);
        //     $scope.siteupdate = res.data.site[0];
        //     $scope.begintimechange = res.data.site[0].contract_begin;
        //     $scope.endtimechange = res.data.site[0].contract_end;
        //     $scope.siteupdate.contract_begin = $filter('date')($scope.begintimechange);
        //     $scope.siteupdate.contract_end = $filter('date')($scope.endtimechange);
        //     // $scope.checkForNull = res.data.hoursandsite;
        //     // console.log($scope.checkForNull);
        //     $scope.times = res.data.hoursandsite;
        // });



    // $scope.submitUpdate = function(site,time){
    //   // console.log(site);
    //     // console.log(time);
    //   var siteIdNum = site.site_id;
    //   updateService.updatesite(siteIdNum,site)
    //   .then(function(response){
    //   });
    //   time.forEach(function(val){
    //
    //     var siteId = val.contract_time_id;
    //     updateService.updatehours(siteId,val)
    //     .then(function(res){});
    //     siteId =0;
    //   });
    // };

    updateService.showemployee()
    .then(function(emp){
      // console.log(emp);

      $scope.employee = emp.data;
    });

    $scope.updateEmp = function(emp){
      $scope.showupdate = false;
      $scope.empupdate = emp;
      // console.log(emp);
      $state.go('showemployee.updateemployee');
    };

    $scope.submitEmployee = function(empchange){
      var employeeId = empchange.user_id;
      updateService.updateemployee(employeeId,empchange)
      .then(function(res){});
    };



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
this.idNumVar = 2
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

// this.siteView;
//
// this.getSiteId = function(val){
//   console.log(val);
//   return val;
// }
//
//   // this.siteView = val;
//   console.log(this.siteView);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVDdHJsLmpzIiwiY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZV9ob3Vyc0N0cmwuanMiLCJjb21wb25lbnRzL3NpZ25pbi9zaWduaW5DdHJsLmpzIiwiY29tcG9uZW50cy91cGRhdGVfc2l0ZS9mdWxsc2l0ZUN0cmwuanMiLCJjb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlQ3RybC5qcyIsInNoYXJlZC9hbmltYXRpb25zL3VpLXZpZXctYW5pbWF0aW9uLmpzIiwic2hhcmVkL21lbnUvbWVudS1kaXJlY3RpdmUuanMiLCJzaGFyZWQvbWVudS90aXRsZS1kaXJlY3RpdmUuanMiLCJzaGFyZWQvc2VydmljZXMvY3JlYXRlU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9sb2dpblNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvbWFpbnBhZ2VTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL292ZXJ2aWV3U2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy91cGRhdGVTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnLCBbJ3VpLnJvdXRlcicsJ3VpLmJvb3RzdHJhcCcsJ25nQW5pbWF0ZScsJ3NhdGVsbGl6ZXInXSlcbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlcikge1xuXG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnc2lnbmluJyx7XG4gICAgICB1cmw6Jy8nLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9zaWduaW4vc2lnbmluLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ3NpZ25pbkN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21haW5wYWdlJyx7XG4gICAgICB1cmw6Jy9tYWlucGFnZScsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL21haW4vbWFpbnBhZ2UuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnbWFpbnBhZ2VDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlJyx7XG4gICAgICB1cmw6Jy9jcmVhdGVzaXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZXNpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZWRheXMnLCB7XG4gICAgICB1cmw6ICcvZGF5cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZWRheXMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2hvdXInLHtcbiAgICAgIHVybDonL2hvdXJzJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZWhvdXJzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCd1cGRhdGVlbXBsb3llZScse1xuICAgICAgdXJsOicvdXBkYXRlZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J3VwZGF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVlbXBsb3llZScse1xuICAgICAgdXJsOicvY3JlYXRlZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3NjaGVkdWxlJyx7XG4gICAgICB1cmw6Jy9zY2hlZHVsZXNpdGVzJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J3NjaGVkdWxlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2VsZWN0c2hpZnQnLHtcbiAgICAgIHVybDonL3NjaGVkdWxlc2hpZnRzJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZXNoaWZ0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J3NjaGVkdWxlaG91cnNDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCd1cGRhdGVzaXRlJyx7XG4gICAgICB1cmw6Jy91cGRhdGVzaXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J3VwZGF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCd1cGRhdGVmdWxsc2l0ZScse1xuICAgICAgdXJsOicvZnVsbHNpdGV1cGRhdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9mdWxsc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2Z1bGxzaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hvd2VtcGxveWVlJyx7XG4gICAgICB1cmw6Jy92aWV3ZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3ZpZXdfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hvd2VtcGxveWVlLnVwZGF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy91cGRhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ3VwZGF0ZVNpdGVDdHJsJ1xuICAgIH0pXG5cblxuXG5cblxuXG59KTsvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdjcmVhdGVTaXRlQ3RybCcsIGNyZWF0ZVNpdGVDdHJsKVxuXG5mdW5jdGlvbiBjcmVhdGVTaXRlQ3RybCgkc2NvcGUsIGNyZWF0ZVNlcnZpY2UsICRzdGF0ZSkge1xuJHNjb3BlLnNob3dzaGlmdHMxID0gZmFsc2U7XG4gICAgLy8gR29lcyBmcm9tIGNyZWF0ZSBzaXRlIHRvIGNyZWF0ZSBkYXlzIGFsc28gY3JlYXRlcyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgc2l0ZVxuICAgICRzY29wZS5uZXh0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUobmFtZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLnNpdGVJZCA9IHJlc3BvbnNlLmRhdGFbMF0uc2l0ZV9pZDtcbiAgICAgICAgICAgIGNyZWF0ZVNlcnZpY2Uuc2l0ZT0kc2NvcGUuc2l0ZUlkO1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgLy8gT3BlbnMgc3VidmlldyBmcm9tIGNyZWF0ZSBkYXlzIGludG8gY3JlYXRlIGhvdXJzXG4gICAgJHNjb3BlLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oZGF5KSB7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuZGF5ID0gZGF5O1xuICAgICAgICAkc3RhdGUuZ28oJ2hvdXInKTtcbiAgICB9XG4gICAgLy8gY2xlYXJzIGFsbCBvZiB0aGUgY2xvY2sgaW5mb1xuICAgICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuc2hpZnQgPSBudWxsO1xuICAgIH07XG4gICAgLy8gY2xvY2sgc3RlcCBpbmNyZWFzZXNcbiAgICAkc2NvcGUuaHN0ZXAgPSAxO1xuICAgICRzY29wZS5tc3RlcCA9IDE1O1xuXG4gICAgLy8gY3JlYXRlcyB0aGUgc2hpZnQgb2JqZWN0IGFuZCB0aGVuIHB1c2hlcyBpdCBpbnRvIHRoZSBzZXJ2aWNlXG4gICAgJHNjb3BlLmdldE1vcmVIb3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG5cblxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNoaWZ0KSB7XG4gICAgICAgICAgICBzaGlmdFtwcm9wXSA9IChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldEhvdXJzKCkgKyAnOicgKyAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRNaW51dGVzKClcbiAgICAgICAgfVxuICAgICAgICBzaGlmdC5jb250cmFjdF9kYXkgPSBjcmVhdGVTZXJ2aWNlLmRheTtcbiAgICAgICAgc2hpZnQuc2l0ZUlkID0gY3JlYXRlU2VydmljZS5zaXRlO1xuICAgICAgICBzaGlmdC5zaXRlX2lkX2ZrID0gY3JlYXRlU2VydmljZS5zaXRlO1xuXG4gICAgICAgICRzY29wZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAgICAgfTtcblxuXG4gICAgJHNjb3BlLmVtcGxveWVlSWQ7XG4gICAgLy8gY3JlYXRlcyBhbiBlbXBsb3llZSBhbmQgcmV0dXJucyB0aGF0IGlkXG4gICAgJHNjb3BlLmNyZWF0ZUVtcGxveWVlID0gZnVuY3Rpb24oZW1wbG95ZWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVlbXBsb3llZShlbXBsb3llZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5lbXBsb3llZUlkID0gcmVzcG9uc2UuZGF0YVswXS51c2VyX2lkO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnQpe1xuICAgICAgY29uc29sZS5sb2coc2hpZnQpO1xuICAgICAgY3JlYXRlU2VydmljZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUuZ2V0VGltZXM9ZnVuY3Rpb24oKXtcbiAgICAgIGNyZWF0ZVNlcnZpY2Uuc2hpZnRzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcbiAgICAgICAgaWYoIXZhbCl7XG4gICAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWhvdXJzKHZhbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgICAgfVxuICAgICAgfSlcblxuICAgIH1cblxuXG4gICAgJHNjb3BlLnBpY2tTaGlmdCA9IGZ1bmN0aW9uKHYpe1xuXG4gICAgaWYodiA9PT0gMSl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czEgPSAhJHNjb3BlLnNob3dzaGlmdHMxO1xuICAgIH1cbiAgICBpZih2ID09PSAyKXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzMiA9ICEkc2NvcGUuc2hvd3NoaWZ0czI7XG4gICAgfVxuICAgIGlmKHYgPT09IDMpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHMzID0gISRzY29wZS5zaG93c2hpZnRzMztcbiAgICB9XG4gICAgaWYodiA9PT0gNCl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czQgPSAhJHNjb3BlLnNob3dzaGlmdHM0O1xuICAgIH1cblxuICAgIH1cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWlucGFnZUN0cmwnLG1haW5wYWdlQ3RybCk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlQ3RybCgkc2NvcGUsbWFpbnBhZ2VTZXJ2aWNlLG92ZXJ2aWV3U2VydmljZSl7XG5cbm1haW5wYWdlU2VydmljZS5nZXRjdXJyZW50KClcbi50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gIHZhciBzaXRlVXNlcklkID0gcmVzLmRhdGEucGFzc3BvcnQudXNlci51c2VyX2lkO1xuICAkc2NvcGUudXNlcnNpdGVzID0gcmVzLmRhdGEucGFzc3BvcnQudXNlcjtcbiAgbWFpbnBhZ2VTZXJ2aWNlLmdldFVzZXJTaXRlcyhzaXRlVXNlcklkKVxuICAudGhlbihmdW5jdGlvbih1c2VyU2l0ZXMpe1xuXG4gIGNvbnNvbGUubG9nKHVzZXJTaXRlcy5kYXRhKTtcblxuICB9KVxuXG5cbn0pXG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiXG5hbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignc2NoZWR1bGVDdHJsJywgc2NoZWR1bGVDdHJsKVxuXG5mdW5jdGlvbiBzY2hlZHVsZUN0cmwoJHNjb3BlLCBvdmVydmlld1NlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gdmFyIHNpdGVBcnJheSA9IFtdO1xuXG4gICAgb3ZlcnZpZXdTZXJ2aWNlLm92ZXJWaWV3U2l0ZXMoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICB2YXIgc2l0ZU9iaiA9IHJlcy5kYXRhO1xuICAgICAgICAkc2NvcGUuc2l0ZW92ZXJ2aWV3ID0gcmVzLmRhdGE7XG4gICAgfSk7XG4gICAgLy8gZnVuY3Rpb24gd2lsbCBoaWRlIHNpdGVzIGFuZCB0aGVuIGJyaW5nIGluIHNpdGUgaW5mb1xuICAgICRzY29wZS5zY2hlZHVsZVNoaWZ0ID0gZnVuY3Rpb24oaWROdW0pIHtcbiAgICAgIG92ZXJ2aWV3U2VydmljZS5pZE51bVZhciA9IDI7XG4gICAgICAkc3RhdGUuZ28oJ3NlbGVjdHNoaWZ0JylcbiAgICB9XG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignc2NoZWR1bGVob3Vyc0N0cmwnLCBzY2hlZHVsZWhvdXJzQ3RybClcblxuZnVuY3Rpb24gc2NoZWR1bGVob3Vyc0N0cmwoJHNjb3BlLCBvdmVydmlld1NlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgb3ZlcnZpZXdTZXJ2aWNlLnNob3dIb3VycyhvdmVydmlld1NlcnZpY2UuaWROdW1WYXIpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICBjb25zb2xlLmxvZyhvdmVydmlld1NlcnZpY2UuaWROdW1WYXIpO1xuICAgICAgICAkc2NvcGUuaG91cnMgPSByZXMuZGF0YTtcbiAgICAgICAgJHNjb3BlLnNoaWZ0cyA9IHJlcy5kYXRhO1xuXG4gICAgfSlcblxuICAgIHZhciBzZWxlY3RlZFNoaWZ0cyA9IFtdO1xuICAgICRzY29wZS5hZGRTaGlmdE51bSA9IGZ1bmN0aW9uKGNvbnRyYWN0SWQsIHNoaWZ0TnVtKSB7XG4gICAgICBjb25zb2xlLmxvZyhjb250cmFjdElkLCdjb250cmFjdElkJyk7XG4gICAgICBjb25zb2xlLmxvZyhzaGlmdE51bSwnc2hpZnROdW0nKTtcbiAgICAgICAgb3ZlcnZpZXdTZXJ2aWNlLmdldFVzZXJJZCgpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLCAnZ2V0VXNlcklkJyk7XG4gICAgICAgICAgICB2YXIgZW1wSWQgPSByZXMuZGF0YS5wYXNzcG9ydC51c2VyLnVzZXJfaWQ7XG4gICAgICAgICAgICBpZiAoc2hpZnROdW0pIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFNoaWZ0cy5wdXNoKHtzaGlmdF9udW06IHNoaWZ0TnVtLCBjb250cmFjdF90aW1lX2ZrOiBjb250cmFjdElkLCBzaXRlX2lkX2ZrOiAkc2NvcGUuc2hpZnRzWzBdLnNpdGVfaWRfZmssIHVzZXJfaWRfZms6IGVtcElkfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VsZWN0ZWRTaGlmdHMubWFwKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLmNvbnRyYWN0X3RpbWVfZms7XG4gICAgICAgICAgICAgICAgfSkuaW5kZXhPZihjb250cmFjdElkKTtcblxuICAgICAgICAgICAgICAgIHNlbGVjdGVkU2hpZnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXRFbXBTaGlmdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmaXJlZCcpO1xuICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRTaGlmdHMpO1xuICAgICAgICBzZWxlY3RlZFNoaWZ0cy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgb3ZlcnZpZXdTZXJ2aWNlLmVtcGxveWVlU2NoZWR1bGUodmFsKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSlcbiAgICAgICAgfSlcbiAgICAgICAgc2VsZWN0ZWRTaGlmdHMgPSBbXTtcbiAgICB9XG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2lnbmluQ3RybCcsc2lnbmluQ3RybClcblxuZnVuY3Rpb24gc2lnbmluQ3RybCgkc2NvcGUsbG9naW5TZXJ2aWNlLCRzdGF0ZSl7XG5cblxuXG5cbiRzY29wZS5sb2dpbiA9IHtcbiAgdXNlcm5hbWU6ICdhQGEuY29tJyxcbiAgcGFzc3dvcmQ6ICdhJ1xufVxuXG5cbiRzY29wZS5zdWJtaXRsb2dpbiA9IGZ1bmN0aW9uKGxvZ2luKXtcbiAgbG9naW5TZXJ2aWNlLmdldExvZ2luKGxvZ2luKVxuICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICBpZihyZXMuc3RhdHVzID09PSAyMDApICRzdGF0ZS5nbygnbWFpbnBhZ2UnKTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICB9KTtcbn1cblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignZnVsbHNpdGVDdHJsJywgZnVsbHNpdGVDdHJsKTtcblxuZnVuY3Rpb24gZnVsbHNpdGVDdHJsKCRzY29wZSwgdXBkYXRlU2VydmljZSwgJHN0YXRlLCRmaWx0ZXIpIHtcblxuXG4gICAgdXBkYXRlU2VydmljZS5hbGxTaXRlSW5mbygyNSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZSA9IHJlcy5kYXRhLnNpdGVbMF07XG4gICAgICAgICRzY29wZS5iZWdpbnRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2JlZ2luO1xuICAgICAgICAkc2NvcGUuZW5kdGltZWNoYW5nZSA9IHJlcy5kYXRhLnNpdGVbMF0uY29udHJhY3RfZW5kO1xuICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9iZWdpbiA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuYmVnaW50aW1lY2hhbmdlKTtcbiAgICAgICAgJHNjb3BlLnNpdGV1cGRhdGUuY29udHJhY3RfZW5kID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5lbmR0aW1lY2hhbmdlKTtcbiAgICAgICAgLy8gJHNjb3BlLmNoZWNrRm9yTnVsbCA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmNoZWNrRm9yTnVsbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLmhvdXJzYW5kc2l0ZSk7XG4gICAgICAgICRzY29wZS50aW1lcyA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zdWJtaXRVcGRhdGUgPSBmdW5jdGlvbihzaXRlLCB0aW1lKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNpdGUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aW1lKTtcbiAgICAgICAgdmFyIHNpdGVJZE51bSA9IHNpdGUuc2l0ZV9pZDtcbiAgICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVzaXRlKHNpdGVJZE51bSwgc2l0ZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgICAgICB0aW1lLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XG5cbiAgICAgICAgICAgIHZhciBzaXRlSWQgPSB2YWwuY29udHJhY3RfdGltZV9pZDtcbiAgICAgICAgICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlaG91cnMoc2l0ZUlkLCB2YWwpLnRoZW4oZnVuY3Rpb24ocmVzKSB7fSk7XG4gICAgICAgICAgICBzaXRlSWQgPSAwO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCd1cGRhdGVTaXRlQ3RybCcsIHVwZGF0ZVNpdGVDdHJsKTtcblxuZnVuY3Rpb24gdXBkYXRlU2l0ZUN0cmwoJHNjb3BlLCB1cGRhdGVTZXJ2aWNlLCAkc3RhdGUpIHtcblxuXG5cbiAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZVNpdGUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS51cGRhdGVzaXRlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIC8vIHJldHVybiB1cGRhdGVTZXJ2aWNlLnNpdGVWaWV3ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyAkc2NvcGUuY2hlY2tOdWxsID0gdHJ1ZTtcblxuICAgICRzY29wZS51cGRhdGVTaXRlID0gZnVuY3Rpb24oc2l0ZXZpZXcpIHtcbiAgICAgIGNvbnNvbGUubG9nKHNpdGV2aWV3LnNpdGVfaWQpO1xuICAgIC8vICB1cGRhdGVTZXJ2aWNlLmdldFNpdGVJZChzaXRldmlldy5zaXRlX2lkKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codXBkYXRlU2VydmljZS5zaXRlVmlldyk7XG4gICAgICAgICRzdGF0ZS5nbygndXBkYXRlZnVsbHNpdGUnKTtcbiAgfTtcblxuICAgICAgICAvLyB1cGRhdGVTZXJ2aWNlLmFsbFNpdGVJbmZvKHVwZGF0ZVNlcnZpY2Uuc2l0ZXZpZXcuc2l0ZV9pZCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcbiAgICAgICAgLy8gICAgICRzY29wZS5zaXRldXBkYXRlID0gcmVzLmRhdGEuc2l0ZVswXTtcbiAgICAgICAgLy8gICAgICRzY29wZS5iZWdpbnRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2JlZ2luO1xuICAgICAgICAvLyAgICAgJHNjb3BlLmVuZHRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2VuZDtcbiAgICAgICAgLy8gICAgICRzY29wZS5zaXRldXBkYXRlLmNvbnRyYWN0X2JlZ2luID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5iZWdpbnRpbWVjaGFuZ2UpO1xuICAgICAgICAvLyAgICAgJHNjb3BlLnNpdGV1cGRhdGUuY29udHJhY3RfZW5kID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5lbmR0aW1lY2hhbmdlKTtcbiAgICAgICAgLy8gICAgIC8vICRzY29wZS5jaGVja0Zvck51bGwgPSByZXMuZGF0YS5ob3Vyc2FuZHNpdGU7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuY2hlY2tGb3JOdWxsKTtcbiAgICAgICAgLy8gICAgICRzY29wZS50aW1lcyA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICAgICAgLy8gfSk7XG5cblxuXG4gICAgLy8gJHNjb3BlLnN1Ym1pdFVwZGF0ZSA9IGZ1bmN0aW9uKHNpdGUsdGltZSl7XG4gICAgLy8gICAvLyBjb25zb2xlLmxvZyhzaXRlKTtcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2codGltZSk7XG4gICAgLy8gICB2YXIgc2l0ZUlkTnVtID0gc2l0ZS5zaXRlX2lkO1xuICAgIC8vICAgdXBkYXRlU2VydmljZS51cGRhdGVzaXRlKHNpdGVJZE51bSxzaXRlKVxuICAgIC8vICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIC8vICAgfSk7XG4gICAgLy8gICB0aW1lLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAvL1xuICAgIC8vICAgICB2YXIgc2l0ZUlkID0gdmFsLmNvbnRyYWN0X3RpbWVfaWQ7XG4gICAgLy8gICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlaG91cnMoc2l0ZUlkLHZhbClcbiAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXt9KTtcbiAgICAvLyAgICAgc2l0ZUlkID0wO1xuICAgIC8vICAgfSk7XG4gICAgLy8gfTtcblxuICAgIHVwZGF0ZVNlcnZpY2Uuc2hvd2VtcGxveWVlKClcbiAgICAudGhlbihmdW5jdGlvbihlbXApe1xuICAgICAgLy8gY29uc29sZS5sb2coZW1wKTtcblxuICAgICAgJHNjb3BlLmVtcGxveWVlID0gZW1wLmRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUudXBkYXRlRW1wID0gZnVuY3Rpb24oZW1wKXtcbiAgICAgICRzY29wZS5zaG93dXBkYXRlID0gZmFsc2U7XG4gICAgICAkc2NvcGUuZW1wdXBkYXRlID0gZW1wO1xuICAgICAgLy8gY29uc29sZS5sb2coZW1wKTtcbiAgICAgICRzdGF0ZS5nbygnc2hvd2VtcGxveWVlLnVwZGF0ZWVtcGxveWVlJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5zdWJtaXRFbXBsb3llZSA9IGZ1bmN0aW9uKGVtcGNoYW5nZSl7XG4gICAgICB2YXIgZW1wbG95ZWVJZCA9IGVtcGNoYW5nZS51c2VyX2lkO1xuICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVlbXBsb3llZShlbXBsb3llZUlkLGVtcGNoYW5nZSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7fSk7XG4gICAgfTtcblxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uYW5pbWF0aW9uKCcuc2xpZGUtZG93bicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lKSB7XG4gICAgICBUd2Vlbk1heC5mcm9tKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4gICAgfSxcbiAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuICAgICAgVHdlZW5NYXgudG8oZWxlbWVudCwgMSwge29wYWNpdHk6MCwgeTo1MCwgb25Db21wbGV0ZTpkb25lfSlcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyAoJy5tYWluLWNvbnRlbnQnLCBbZnVuY3Rpb24oKXtcbi8vICAgcmV0dXJuIHtcbi8vICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuLy8gICAgICAgVHdlZW5NYXguZnJvbShlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuLy8gICAgIH0sXG4vLyAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbi8vICAgICAgIFR3ZWVuTWF4LnRvKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4vLyAgICAgfVxuLy8gICB9XG4vLyB9XSlcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5kaXJlY3RpdmUoJ21lbnVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L21lbnUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cblxufSkgLy9lbmQgb2YgZGlyZWN0aXZlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCd0aXRsZURpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvc2hhcmVkL21lbnUvdGl0bGUuaHRtbCdcblxuICAgICAgfVxuXG59KS8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLnNlcnZpY2UoJ2NyZWF0ZVNlcnZpY2UnLCBjcmVhdGVTZXJ2aWNlKTtcblxuZnVuY3Rpb24gY3JlYXRlU2VydmljZSgkaHR0cCwgJHEpIHtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNpdGUgdy9vIGRheXMgYW5kIGhvdXJzXG4gICAgdmFyIHNpdGVJZDtcbiAgICB0aGlzLnNoaWZ0cyA9IFtdO1xuICAgIHRoaXMuc2l0ZTtcbiAgICB0aGlzLmRheTtcbiAgICB0aGlzLmNyZWF0ZXNpdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZXNpdGVcIiwgZGF0YTogb2JqfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIHNpdGVJZCA9IHJlcy5kYXRhWzBdLnNpdGVfaWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgdGhlIHJlc3Qgb2YgdGhlIHNpdGUgLS0gZGF5cyBhbmQgaG91cnNcbiAgICB0aGlzLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oc2hpZnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coc2hpZnQpO1xuICAgICAgICBzaGlmdC5zaXRlX2lkID0gc2l0ZUlkO1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZGF5YW5kaG91cnNcIiwgZGF0YTogc2hpZnR9KTtcbiAgICB9O1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgYW4gZW1wbG95ZWVcbiAgICB2YXIgZW1wbG95ZWVJZDtcbiAgICB0aGlzLmNyZWF0ZWVtcGxveWVlID0gZnVuY3Rpb24oZW1wKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVlbXBsb3llZVwiLCBkYXRhOiBlbXB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgZW1wbG95ZWVJZCA9IHJlcy5kYXRhWzBdLnVzZXJfaWQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbXBsb3llZUlkKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyB0aGlzIG1ha2VzIGFuIGFsZXJ0IHNheWluZyB0aGUgc2l0ZSBoYXMgYmVlbiBjcmVhdGVkXG4gICAgdGhpcy5zaXRlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiU2l0ZSBDcmVhdGVkIVwiLCB0eXBlOiBcInN1Y2Nlc3NcIiwgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIiwgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWV9KTtcblxuICAgIH07XG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhhdCB0aGUgZW1wbG95ZWUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuZW1wbG95ZWVhbGVydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2FsKHt0aXRsZTogXCJFbXBsb3llZSBDcmVhdGVkIVwiLCB0eXBlOiBcInN1Y2Nlc3NcIiwgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIiwgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWV9KTtcblxuICAgIH07XG5cbiAgICB0aGlzLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnRzKSB7XG4gICAgICAgIHRoaXMuc2hpZnRzLnB1c2goc2hpZnRzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zaGlmdHMpO1xuXG4gICAgfTtcblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdsb2dpblNlcnZpY2UnLGxvZ2luU2VydmljZSk7XG5cblxuZnVuY3Rpb24gbG9naW5TZXJ2aWNlKCRodHRwKXtcblxudGhpcy5nZXRMb2dpbiA9IGZ1bmN0aW9uKGxvZ2luKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJQT1NUXCIsXG4gICAgdXJsOicvYXV0aC9sb2dpbicsXG4gICAgZGF0YTogbG9naW5cbiAgfSk7XG59XG5cblxuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ21haW5wYWdlU2VydmljZScsbWFpbnBhZ2VTZXJ2aWNlKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VTZXJ2aWNlKCRodHRwKXtcblxudGhpcy5nZXRjdXJyZW50ID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6IFwiL2F1dGgvY3VycmVudFwiXG4gIH0pXG59XG5cbnRoaXMuZ2V0VXNlclNpdGVzID0gZnVuY3Rpb24odXNlclNpdGVJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL2dldFVzZXJTaXRlcy9cIiArIHVzZXJTaXRlSWRcbiAgfSlcbn1cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdvdmVydmlld1NlcnZpY2UnLG92ZXJ2aWV3U2VydmljZSlcblxuZnVuY3Rpb24gb3ZlcnZpZXdTZXJ2aWNlKCRodHRwKXtcbnRoaXMuaWROdW1WYXIgPSAyXG50aGlzLm92ZXJWaWV3U2l0ZXMgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9zaXRlb3ZlcnZpZXdcIlxuICB9KVxufVxuXG50aGlzLnNob3dEYXlzID0gZnVuY3Rpb24oaWROdW0pe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9zY2hlZHVsZURheXMvXCIgKyBpZE51bVxuICB9KVxufVxuXG50aGlzLnNob3dIb3VycyA9IGZ1bmN0aW9uKGlkTnVtKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6IFwiL3NjaGVkdWxlSG91cnMvXCIgKyBpZE51bVxuICB9KVxufVxuXG50aGlzLmVtcGxveWVlU2NoZWR1bGUgPSBmdW5jdGlvbihzY2hlZHVsZVNoaWZ0KXtcbiAgLy8gY29uc29sZS5sb2coc2NoZWR1bGVTaGlmdCk7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDpcIi9lbXBsb3llZXNjaGVkdWxlXCIsXG4gICAgZGF0YTpzY2hlZHVsZVNoaWZ0XG4gIH0pXG59XG5cbnRoaXMuZ2V0VXNlckluZm8gPSBmdW5jdGlvbih1c2VySWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9nZXRVc2VySW5mby9cIiArIHVzZXJJZFxuICB9KVxufVxuXG50aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL2F1dGgvY3VycmVudFwiXG4gIH0pXG59XG5cblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCd1cGRhdGVTZXJ2aWNlJyx1cGRhdGVTZXJ2aWNlKVxuXG5mdW5jdGlvbiB1cGRhdGVTZXJ2aWNlKCRodHRwKXtcblxuLy8gdGhpcy5zaXRlVmlldztcbi8vXG4vLyB0aGlzLmdldFNpdGVJZCA9IGZ1bmN0aW9uKHZhbCl7XG4vLyAgIGNvbnNvbGUubG9nKHZhbCk7XG4vLyAgIHJldHVybiB2YWw7XG4vLyB9XG4vL1xuLy8gICAvLyB0aGlzLnNpdGVWaWV3ID0gdmFsO1xuLy8gICBjb25zb2xlLmxvZyh0aGlzLnNpdGVWaWV3KTtcblxudGhpcy51cGRhdGVTaXRlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6Jy9zaXRlb3ZlcnZpZXcnXG4gIH0pXG59XG5cbnRoaXMuYWxsU2l0ZUluZm8gPSBmdW5jdGlvbihzaXRlSWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDonL2dldHNpdGVhbmRob3Vycy8nICsgc2l0ZUlkXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlc2l0ZSA9IGZ1bmN0aW9uKHVwZGF0ZUlkLHVwZGF0ZVNpdGUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6Jy91cGRhdGVzaXRlLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVTaXRlXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlaG91cnMgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlVGltZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDonL3VwZGF0ZWhvdXJzLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVUaW1lXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlZW1wbG95ZWUgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlRW1wbG95ZWUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6ICcvdXBkYXRlZW1wbG95ZWUvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZUVtcGxveWVlXG4gIH0pXG59XG5cbnRoaXMuc2hvd2VtcGxveWVlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgdXJsOlwiL3ZpZXdlbXBsb3llZVwiXG4gIH0pXG59XG5cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
