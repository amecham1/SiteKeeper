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
    // .state('updateemployee',{
    //   url:'/updateemployee',
    //   templateUrl:'app/components/update_site/update_employee.html',
    //   controller:'updateSiteCtrl'
    // })
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
      templateUrl:'app/components/update_employee/view_employee.html',
      controller:'empupdateCtrl'
    })
    .state('updateemployee',{
      url:'/updateemployee',
      templateUrl:'app/components/update_employee/update_employee.html',
      controller: 'fullempupdateCtrl'
    })
    .state('requestchange',{
      url:'/requestchange',
      templateUrl:'app/components/request_change/request_change.html',
      controller:'requestchangeCtrl'
    });






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
  $scope.username = res.data.passport.user;
  mainpageService.getUserSites(siteUserId)
  .then(function(userSites){
    $scope.usersites = userSites.data;
  console.log(userSites.data);

  })


})





}//end of mainpageCtrl

angular.module('keeperApp')
.controller('empupdateCtrl',empupdateCtrl)


function empupdateCtrl($scope,updateService,$state){


  updateService.showemployee()
  .then(function(emp){
    console.log(emp);

    $scope.employee = emp.data;
  });

  $scope.updateEmp = function(data){
    updateService.setEmpId(data);
    $state.go('updateemployee');
  };





}//end of controller

angular.module('keeperApp')
.controller('fullempupdateCtrl',fullempupdateCtrl)


function fullempupdateCtrl($scope,updateService,$state){

var getEmpId = updateService.getEmpId();

console.log(getEmpId);

$scope.empupdate = getEmpId;

$scope.submitEmployee = function(data){
updateService.updateemployee(data)
.then(function(response){});

}





}//end of controller

angular.module('keeperApp')
.controller('requestchangeCtrl', requestchangeCtrl)


function requestchangeCtrl($scope){





}//end of controller


angular.module('keeperApp').controller('scheduleCtrl', scheduleCtrl)

function scheduleCtrl($scope, overviewService, $state) {

    // var siteArray = [];

    overviewService.overViewSites().then(function(res) {
      // console.log(res.data);
        var siteObj = res.data;
        $scope.siteoverview = res.data;
    });
    // function will hide sites and then bring in site info
    $scope.scheduleShift = function(idNum) {
      console.log(idNum.site_id);
      // overviewService.idNumVar(idNum.site_id);
      // console.log(idNum.site_id);
      overviewService.setSiteId(idNum.site_id);
      $state.go('selectshift')
    }


} //end of controller

angular.module('keeperApp').controller('schedulehoursCtrl', schedulehoursCtrl)

function schedulehoursCtrl($scope, overviewService, $state) {

var selectedShiftId = overviewService.getSiteId()
console.log(selectedShiftId);
    overviewService.showHours(selectedShiftId).then(function(res) {
        $scope.hours = res.data;
        $scope.shifts = res.data;

    })

    var selectedShifts = [];
    $scope.addShiftNum = function(contractId, shiftNum) {
      // console.log(contractId,'contractId');
      // console.log(shiftNum,'shiftNum');
        overviewService.getUserId().then(function(res) {
          // console.log(res, 'getUserId');
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

angular.module('keeperApp').controller('fullsiteCtrl', fullsiteCtrl);

function fullsiteCtrl($scope, updateService, $state,$filter) {

// var siteService = updateService.siteView
// console.log(siteService);

var selectedSiteId = updateService.getSiteId()


    updateService.allSiteInfo(selectedSiteId).then(function(res) {
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
        console.log(siteview);
      updateService.selectedSiteId = siteview.site_id;
      updateService.setSiteId(siteview.site_id);

    //  updateService.showHours(siteview.site_id);
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

    // updateService.showemployee()
    // .then(function(emp){
    //   console.log(emp);
    //
    //   $scope.employee = emp.data;
    // });

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

var selectedShiftId ={};

if(localStorage.getItem("selectedShiftId")){
selectedShiftId = JSON.parse(localStorage.getItem("selectedShiftId"));
}
this.getSiteId = function(){
  return selectedShiftId;
}
this.setSiteId = function(data){
  selectedShiftId = data;
  localStorage.setItem("selectedShiftId",JSON.stringify(selectedShiftId));
}

console.log(this.idNumVar);

// this.siteView = {};
// console.log(this.siteView);


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
  // console.log(idNum);
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

var selectedSiteId ={};


if(localStorage.getItem("selectedSiteId")){
selectedSiteId = JSON.parse(localStorage.getItem("selectedSiteId"));
}
this.getSiteId = function(){
  return selectedSiteId;
}
this.setSiteId = function(data){
  selectedSiteId = data;
  localStorage.setItem("selectedSiteId",JSON.stringify(selectedSiteId));
}


var selectedEmpId ={};


if(localStorage.getItem("selectedEmpId")){
selectedEmpId = JSON.parse(localStorage.getItem("selectedEmpId"));
}
this.getEmpId = function(){
  return selectedEmpId;
}
this.setEmpId = function(data){
  selectedEmpId = data;
  localStorage.setItem("selectedEmpId",JSON.stringify(selectedEmpId));
}

this.siteView = {};
console.log(this.siteView);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX2VtcGxveWVlL2VtcHVwZGF0ZUN0cmwuanMiLCJjb21wb25lbnRzL3VwZGF0ZV9lbXBsb3llZS9mdWxsZW1wdXBkYXRlQ3RybC5qcyIsImNvbXBvbmVudHMvcmVxdWVzdF9jaGFuZ2UvcmVxdWVzdF9jaGFuZ2VDdHJsLmpzIiwiY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZUN0cmwuanMiLCJjb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlX2hvdXJzQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvZnVsbHNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfc2l0ZUN0cmwuanMiLCJzaGFyZWQvYW5pbWF0aW9ucy91aS12aWV3LWFuaW1hdGlvbi5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9tZW51L3RpdGxlLWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9jcmVhdGVTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL2xvZ2luU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9tYWlucGFnZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvb3ZlcnZpZXdTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3VwZGF0ZVNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcsIFsndWkucm91dGVyJywndWkuYm9vdHN0cmFwJywnbmdBbmltYXRlJywnc2F0ZWxsaXplciddKVxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyKSB7XG5cblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdzaWduaW4nLHtcbiAgICAgIHVybDonLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL3NpZ25pbi9zaWduaW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnc2lnbmluQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWFpbnBhZ2UnLHtcbiAgICAgIHVybDonL21haW5wYWdlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvbWFpbi9tYWlucGFnZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdtYWlucGFnZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGUnLHtcbiAgICAgIHVybDonL2NyZWF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlZGF5cycsIHtcbiAgICAgIHVybDogJy9kYXlzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlZGF5cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnaG91cicse1xuICAgICAgdXJsOicvaG91cnMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlaG91cnMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAvLyAuc3RhdGUoJ3VwZGF0ZWVtcGxveWVlJyx7XG4gICAgLy8gICB1cmw6Jy91cGRhdGVlbXBsb3llZScsXG4gICAgLy8gICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgIC8vICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgLy8gfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy9jcmVhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2NoZWR1bGUnLHtcbiAgICAgIHVybDonL3NjaGVkdWxlc2l0ZXMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonc2NoZWR1bGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzZWxlY3RzaGlmdCcse1xuICAgICAgdXJsOicvc2NoZWR1bGVzaGlmdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlc2hpZnRzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonc2NoZWR1bGVob3Vyc0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUnLHtcbiAgICAgIHVybDonL3VwZGF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZWZ1bGxzaXRlJyx7XG4gICAgICB1cmw6Jy9mdWxsc2l0ZXVwZGF0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2Z1bGxzaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonZnVsbHNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzaG93ZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL3ZpZXdlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX2VtcGxveWVlL3ZpZXdfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidlbXB1cGRhdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCd1cGRhdGVlbXBsb3llZScse1xuICAgICAgdXJsOicvdXBkYXRlZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9lbXBsb3llZS91cGRhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnZnVsbGVtcHVwZGF0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3JlcXVlc3RjaGFuZ2UnLHtcbiAgICAgIHVybDonL3JlcXVlc3RjaGFuZ2UnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3JlcXVlc3RfY2hhbmdlL3JlcXVlc3RfY2hhbmdlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjoncmVxdWVzdGNoYW5nZUN0cmwnXG4gICAgfSk7XG5cblxuXG5cblxuXG59KTsvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdjcmVhdGVTaXRlQ3RybCcsIGNyZWF0ZVNpdGVDdHJsKVxuXG5mdW5jdGlvbiBjcmVhdGVTaXRlQ3RybCgkc2NvcGUsIGNyZWF0ZVNlcnZpY2UsICRzdGF0ZSkge1xuJHNjb3BlLnNob3dzaGlmdHMxID0gZmFsc2U7XG4gICAgLy8gR29lcyBmcm9tIGNyZWF0ZSBzaXRlIHRvIGNyZWF0ZSBkYXlzIGFsc28gY3JlYXRlcyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgc2l0ZVxuICAgICRzY29wZS5uZXh0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUobmFtZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLnNpdGVJZCA9IHJlc3BvbnNlLmRhdGFbMF0uc2l0ZV9pZDtcbiAgICAgICAgICAgIGNyZWF0ZVNlcnZpY2Uuc2l0ZT0kc2NvcGUuc2l0ZUlkO1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgLy8gT3BlbnMgc3VidmlldyBmcm9tIGNyZWF0ZSBkYXlzIGludG8gY3JlYXRlIGhvdXJzXG4gICAgJHNjb3BlLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oZGF5KSB7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuZGF5ID0gZGF5O1xuICAgICAgICAkc3RhdGUuZ28oJ2hvdXInKTtcbiAgICB9XG4gICAgLy8gY2xlYXJzIGFsbCBvZiB0aGUgY2xvY2sgaW5mb1xuICAgICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuc2hpZnQgPSBudWxsO1xuICAgIH07XG4gICAgLy8gY2xvY2sgc3RlcCBpbmNyZWFzZXNcbiAgICAkc2NvcGUuaHN0ZXAgPSAxO1xuICAgICRzY29wZS5tc3RlcCA9IDE1O1xuXG4gICAgLy8gY3JlYXRlcyB0aGUgc2hpZnQgb2JqZWN0IGFuZCB0aGVuIHB1c2hlcyBpdCBpbnRvIHRoZSBzZXJ2aWNlXG4gICAgJHNjb3BlLmdldE1vcmVIb3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG5cblxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNoaWZ0KSB7XG4gICAgICAgICAgICBzaGlmdFtwcm9wXSA9IChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldEhvdXJzKCkgKyAnOicgKyAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRNaW51dGVzKClcbiAgICAgICAgfVxuICAgICAgICBzaGlmdC5jb250cmFjdF9kYXkgPSBjcmVhdGVTZXJ2aWNlLmRheTtcbiAgICAgICAgc2hpZnQuc2l0ZUlkID0gY3JlYXRlU2VydmljZS5zaXRlO1xuICAgICAgICBzaGlmdC5zaXRlX2lkX2ZrID0gY3JlYXRlU2VydmljZS5zaXRlO1xuXG4gICAgICAgICRzY29wZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAgICAgfTtcblxuXG4gICAgJHNjb3BlLmVtcGxveWVlSWQ7XG4gICAgLy8gY3JlYXRlcyBhbiBlbXBsb3llZSBhbmQgcmV0dXJucyB0aGF0IGlkXG4gICAgJHNjb3BlLmNyZWF0ZUVtcGxveWVlID0gZnVuY3Rpb24oZW1wbG95ZWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVlbXBsb3llZShlbXBsb3llZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5lbXBsb3llZUlkID0gcmVzcG9uc2UuZGF0YVswXS51c2VyX2lkO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnQpe1xuICAgICAgY29uc29sZS5sb2coc2hpZnQpO1xuICAgICAgY3JlYXRlU2VydmljZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUuZ2V0VGltZXM9ZnVuY3Rpb24oKXtcbiAgICAgIGNyZWF0ZVNlcnZpY2Uuc2hpZnRzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcbiAgICAgICAgaWYoIXZhbCl7XG4gICAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWhvdXJzKHZhbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgICAgfVxuICAgICAgfSlcblxuICAgIH1cblxuXG4gICAgJHNjb3BlLnBpY2tTaGlmdCA9IGZ1bmN0aW9uKHYpe1xuXG4gICAgaWYodiA9PT0gMSl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czEgPSAhJHNjb3BlLnNob3dzaGlmdHMxO1xuICAgIH1cbiAgICBpZih2ID09PSAyKXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzMiA9ICEkc2NvcGUuc2hvd3NoaWZ0czI7XG4gICAgfVxuICAgIGlmKHYgPT09IDMpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHMzID0gISRzY29wZS5zaG93c2hpZnRzMztcbiAgICB9XG4gICAgaWYodiA9PT0gNCl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czQgPSAhJHNjb3BlLnNob3dzaGlmdHM0O1xuICAgIH1cblxuICAgIH1cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWlucGFnZUN0cmwnLG1haW5wYWdlQ3RybCk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlQ3RybCgkc2NvcGUsbWFpbnBhZ2VTZXJ2aWNlLG92ZXJ2aWV3U2VydmljZSl7XG5cbm1haW5wYWdlU2VydmljZS5nZXRjdXJyZW50KClcbi50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gIHZhciBzaXRlVXNlcklkID0gcmVzLmRhdGEucGFzc3BvcnQudXNlci51c2VyX2lkO1xuICAkc2NvcGUudXNlcm5hbWUgPSByZXMuZGF0YS5wYXNzcG9ydC51c2VyO1xuICBtYWlucGFnZVNlcnZpY2UuZ2V0VXNlclNpdGVzKHNpdGVVc2VySWQpXG4gIC50aGVuKGZ1bmN0aW9uKHVzZXJTaXRlcyl7XG4gICAgJHNjb3BlLnVzZXJzaXRlcyA9IHVzZXJTaXRlcy5kYXRhO1xuICBjb25zb2xlLmxvZyh1c2VyU2l0ZXMuZGF0YSk7XG5cbiAgfSlcblxuXG59KVxuXG5cblxuXG5cbn0vL2VuZCBvZiBtYWlucGFnZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ2VtcHVwZGF0ZUN0cmwnLGVtcHVwZGF0ZUN0cmwpXG5cblxuZnVuY3Rpb24gZW1wdXBkYXRlQ3RybCgkc2NvcGUsdXBkYXRlU2VydmljZSwkc3RhdGUpe1xuXG5cbiAgdXBkYXRlU2VydmljZS5zaG93ZW1wbG95ZWUoKVxuICAudGhlbihmdW5jdGlvbihlbXApe1xuICAgIGNvbnNvbGUubG9nKGVtcCk7XG5cbiAgICAkc2NvcGUuZW1wbG95ZWUgPSBlbXAuZGF0YTtcbiAgfSk7XG5cbiAgJHNjb3BlLnVwZGF0ZUVtcCA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIHVwZGF0ZVNlcnZpY2Uuc2V0RW1wSWQoZGF0YSk7XG4gICAgJHN0YXRlLmdvKCd1cGRhdGVlbXBsb3llZScpO1xuICB9O1xuXG5cblxuXG5cbn0vL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdmdWxsZW1wdXBkYXRlQ3RybCcsZnVsbGVtcHVwZGF0ZUN0cmwpXG5cblxuZnVuY3Rpb24gZnVsbGVtcHVwZGF0ZUN0cmwoJHNjb3BlLHVwZGF0ZVNlcnZpY2UsJHN0YXRlKXtcblxudmFyIGdldEVtcElkID0gdXBkYXRlU2VydmljZS5nZXRFbXBJZCgpO1xuXG5jb25zb2xlLmxvZyhnZXRFbXBJZCk7XG5cbiRzY29wZS5lbXB1cGRhdGUgPSBnZXRFbXBJZDtcblxuJHNjb3BlLnN1Ym1pdEVtcGxveWVlID0gZnVuY3Rpb24oZGF0YSl7XG51cGRhdGVTZXJ2aWNlLnVwZGF0ZWVtcGxveWVlKGRhdGEpXG4udGhlbihmdW5jdGlvbihyZXNwb25zZSl7fSk7XG5cbn1cblxuXG5cblxuXG59Ly9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcigncmVxdWVzdGNoYW5nZUN0cmwnLCByZXF1ZXN0Y2hhbmdlQ3RybClcblxuXG5mdW5jdGlvbiByZXF1ZXN0Y2hhbmdlQ3RybCgkc2NvcGUpe1xuXG5cblxuXG5cbn0vL2VuZCBvZiBjb250cm9sbGVyXG4iLCJcbmFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdzY2hlZHVsZUN0cmwnLCBzY2hlZHVsZUN0cmwpXG5cbmZ1bmN0aW9uIHNjaGVkdWxlQ3RybCgkc2NvcGUsIG92ZXJ2aWV3U2VydmljZSwgJHN0YXRlKSB7XG5cbiAgICAvLyB2YXIgc2l0ZUFycmF5ID0gW107XG5cbiAgICBvdmVydmlld1NlcnZpY2Uub3ZlclZpZXdTaXRlcygpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XG4gICAgICAgIHZhciBzaXRlT2JqID0gcmVzLmRhdGE7XG4gICAgICAgICRzY29wZS5zaXRlb3ZlcnZpZXcgPSByZXMuZGF0YTtcbiAgICB9KTtcbiAgICAvLyBmdW5jdGlvbiB3aWxsIGhpZGUgc2l0ZXMgYW5kIHRoZW4gYnJpbmcgaW4gc2l0ZSBpbmZvXG4gICAgJHNjb3BlLnNjaGVkdWxlU2hpZnQgPSBmdW5jdGlvbihpZE51bSkge1xuICAgICAgY29uc29sZS5sb2coaWROdW0uc2l0ZV9pZCk7XG4gICAgICAvLyBvdmVydmlld1NlcnZpY2UuaWROdW1WYXIoaWROdW0uc2l0ZV9pZCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhpZE51bS5zaXRlX2lkKTtcbiAgICAgIG92ZXJ2aWV3U2VydmljZS5zZXRTaXRlSWQoaWROdW0uc2l0ZV9pZCk7XG4gICAgICAkc3RhdGUuZ28oJ3NlbGVjdHNoaWZ0JylcbiAgICB9XG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignc2NoZWR1bGVob3Vyc0N0cmwnLCBzY2hlZHVsZWhvdXJzQ3RybClcblxuZnVuY3Rpb24gc2NoZWR1bGVob3Vyc0N0cmwoJHNjb3BlLCBvdmVydmlld1NlcnZpY2UsICRzdGF0ZSkge1xuXG52YXIgc2VsZWN0ZWRTaGlmdElkID0gb3ZlcnZpZXdTZXJ2aWNlLmdldFNpdGVJZCgpXG5jb25zb2xlLmxvZyhzZWxlY3RlZFNoaWZ0SWQpO1xuICAgIG92ZXJ2aWV3U2VydmljZS5zaG93SG91cnMoc2VsZWN0ZWRTaGlmdElkKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAkc2NvcGUuaG91cnMgPSByZXMuZGF0YTtcbiAgICAgICAgJHNjb3BlLnNoaWZ0cyA9IHJlcy5kYXRhO1xuXG4gICAgfSlcblxuICAgIHZhciBzZWxlY3RlZFNoaWZ0cyA9IFtdO1xuICAgICRzY29wZS5hZGRTaGlmdE51bSA9IGZ1bmN0aW9uKGNvbnRyYWN0SWQsIHNoaWZ0TnVtKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhjb250cmFjdElkLCdjb250cmFjdElkJyk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhzaGlmdE51bSwnc2hpZnROdW0nKTtcbiAgICAgICAgb3ZlcnZpZXdTZXJ2aWNlLmdldFVzZXJJZCgpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLCAnZ2V0VXNlcklkJyk7XG4gICAgICAgICAgICB2YXIgZW1wSWQgPSByZXMuZGF0YS5wYXNzcG9ydC51c2VyLnVzZXJfaWQ7XG4gICAgICAgICAgICBpZiAoc2hpZnROdW0pIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFNoaWZ0cy5wdXNoKHtzaGlmdF9udW06IHNoaWZ0TnVtLCBjb250cmFjdF90aW1lX2ZrOiBjb250cmFjdElkLCBzaXRlX2lkX2ZrOiAkc2NvcGUuc2hpZnRzWzBdLnNpdGVfaWRfZmssIHVzZXJfaWRfZms6IGVtcElkfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VsZWN0ZWRTaGlmdHMubWFwKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLmNvbnRyYWN0X3RpbWVfZms7XG4gICAgICAgICAgICAgICAgfSkuaW5kZXhPZihjb250cmFjdElkKTtcblxuICAgICAgICAgICAgICAgIHNlbGVjdGVkU2hpZnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXRFbXBTaGlmdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmaXJlZCcpO1xuICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRTaGlmdHMpO1xuICAgICAgICBzZWxlY3RlZFNoaWZ0cy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgb3ZlcnZpZXdTZXJ2aWNlLmVtcGxveWVlU2NoZWR1bGUodmFsKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSlcbiAgICAgICAgfSlcbiAgICAgICAgc2VsZWN0ZWRTaGlmdHMgPSBbXTtcbiAgICB9XG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ2Z1bGxzaXRlQ3RybCcsIGZ1bGxzaXRlQ3RybCk7XG5cbmZ1bmN0aW9uIGZ1bGxzaXRlQ3RybCgkc2NvcGUsIHVwZGF0ZVNlcnZpY2UsICRzdGF0ZSwkZmlsdGVyKSB7XG5cbi8vIHZhciBzaXRlU2VydmljZSA9IHVwZGF0ZVNlcnZpY2Uuc2l0ZVZpZXdcbi8vIGNvbnNvbGUubG9nKHNpdGVTZXJ2aWNlKTtcblxudmFyIHNlbGVjdGVkU2l0ZUlkID0gdXBkYXRlU2VydmljZS5nZXRTaXRlSWQoKVxuXG5cbiAgICB1cGRhdGVTZXJ2aWNlLmFsbFNpdGVJbmZvKHNlbGVjdGVkU2l0ZUlkKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XG4gICAgICAgICRzY29wZS5zaXRldXBkYXRlID0gcmVzLmRhdGEuc2l0ZVswXTtcbiAgICAgICAgJHNjb3BlLmJlZ2ludGltZWNoYW5nZSA9IHJlcy5kYXRhLnNpdGVbMF0uY29udHJhY3RfYmVnaW47XG4gICAgICAgICRzY29wZS5lbmR0aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9lbmQ7XG4gICAgICAgICRzY29wZS5zaXRldXBkYXRlLmNvbnRyYWN0X2JlZ2luID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5iZWdpbnRpbWVjaGFuZ2UpO1xuICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9lbmQgPSAkZmlsdGVyKCdkYXRlJykoJHNjb3BlLmVuZHRpbWVjaGFuZ2UpO1xuICAgICAgICAvLyAkc2NvcGUuY2hlY2tGb3JOdWxsID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuY2hlY2tGb3JOdWxsKTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEuaG91cnNhbmRzaXRlKTtcbiAgICAgICAgJHNjb3BlLnRpbWVzID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnN1Ym1pdFVwZGF0ZSA9IGZ1bmN0aW9uKHNpdGUsIHRpbWUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc2l0ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRpbWUpO1xuICAgICAgICB2YXIgc2l0ZUlkTnVtID0gc2l0ZS5zaXRlX2lkO1xuICAgICAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZXNpdGUoc2l0ZUlkTnVtLCBzaXRlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgICAgIHRpbWUuZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcblxuICAgICAgICAgICAgdmFyIHNpdGVJZCA9IHZhbC5jb250cmFjdF90aW1lX2lkO1xuICAgICAgICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVob3VycyhzaXRlSWQsIHZhbCkudGhlbihmdW5jdGlvbihyZXMpIHt9KTtcbiAgICAgICAgICAgIHNpdGVJZCA9IDA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ3VwZGF0ZVNpdGVDdHJsJywgdXBkYXRlU2l0ZUN0cmwpO1xuXG5mdW5jdGlvbiB1cGRhdGVTaXRlQ3RybCgkc2NvcGUsIHVwZGF0ZVNlcnZpY2UsICRzdGF0ZSkge1xuXG5cblxuICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlU2l0ZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLnVwZGF0ZXNpdGVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgLy8gcmV0dXJuIHVwZGF0ZVNlcnZpY2Uuc2l0ZVZpZXcgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICB9KTtcblxuICAgIC8vICRzY29wZS5jaGVja051bGwgPSB0cnVlO1xuXG4gICAgJHNjb3BlLnVwZGF0ZVNpdGUgPSBmdW5jdGlvbihzaXRldmlldykge1xuICAgICAgICBjb25zb2xlLmxvZyhzaXRldmlldyk7XG4gICAgICB1cGRhdGVTZXJ2aWNlLnNlbGVjdGVkU2l0ZUlkID0gc2l0ZXZpZXcuc2l0ZV9pZDtcbiAgICAgIHVwZGF0ZVNlcnZpY2Uuc2V0U2l0ZUlkKHNpdGV2aWV3LnNpdGVfaWQpO1xuXG4gICAgLy8gIHVwZGF0ZVNlcnZpY2Uuc2hvd0hvdXJzKHNpdGV2aWV3LnNpdGVfaWQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh1cGRhdGVTZXJ2aWNlLnNpdGVWaWV3KTtcbiAgICAgICAgJHN0YXRlLmdvKCd1cGRhdGVmdWxsc2l0ZScpO1xuICB9O1xuXG4gICAgICAgIC8vIHVwZGF0ZVNlcnZpY2UuYWxsU2l0ZUluZm8odXBkYXRlU2VydmljZS5zaXRldmlldy5zaXRlX2lkKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgICAvLyAgICAgJHNjb3BlLnNpdGV1cGRhdGUgPSByZXMuZGF0YS5zaXRlWzBdO1xuICAgICAgICAvLyAgICAgJHNjb3BlLmJlZ2ludGltZWNoYW5nZSA9IHJlcy5kYXRhLnNpdGVbMF0uY29udHJhY3RfYmVnaW47XG4gICAgICAgIC8vICAgICAkc2NvcGUuZW5kdGltZWNoYW5nZSA9IHJlcy5kYXRhLnNpdGVbMF0uY29udHJhY3RfZW5kO1xuICAgICAgICAvLyAgICAgJHNjb3BlLnNpdGV1cGRhdGUuY29udHJhY3RfYmVnaW4gPSAkZmlsdGVyKCdkYXRlJykoJHNjb3BlLmJlZ2ludGltZWNoYW5nZSk7XG4gICAgICAgIC8vICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9lbmQgPSAkZmlsdGVyKCdkYXRlJykoJHNjb3BlLmVuZHRpbWVjaGFuZ2UpO1xuICAgICAgICAvLyAgICAgLy8gJHNjb3BlLmNoZWNrRm9yTnVsbCA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5jaGVja0Zvck51bGwpO1xuICAgICAgICAvLyAgICAgJHNjb3BlLnRpbWVzID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuICAgICAgICAvLyB9KTtcblxuXG5cbiAgICAvLyAkc2NvcGUuc3VibWl0VXBkYXRlID0gZnVuY3Rpb24oc2l0ZSx0aW1lKXtcbiAgICAvLyAgIC8vIGNvbnNvbGUubG9nKHNpdGUpO1xuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyh0aW1lKTtcbiAgICAvLyAgIHZhciBzaXRlSWROdW0gPSBzaXRlLnNpdGVfaWQ7XG4gICAgLy8gICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZXNpdGUoc2l0ZUlkTnVtLHNpdGUpXG4gICAgLy8gICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgLy8gICB9KTtcbiAgICAvLyAgIHRpbWUuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBzaXRlSWQgPSB2YWwuY29udHJhY3RfdGltZV9pZDtcbiAgICAvLyAgICAgdXBkYXRlU2VydmljZS51cGRhdGVob3VycyhzaXRlSWQsdmFsKVxuICAgIC8vICAgICAudGhlbihmdW5jdGlvbihyZXMpe30pO1xuICAgIC8vICAgICBzaXRlSWQgPTA7XG4gICAgLy8gICB9KTtcbiAgICAvLyB9O1xuXG4gICAgLy8gdXBkYXRlU2VydmljZS5zaG93ZW1wbG95ZWUoKVxuICAgIC8vIC50aGVuKGZ1bmN0aW9uKGVtcCl7XG4gICAgLy8gICBjb25zb2xlLmxvZyhlbXApO1xuICAgIC8vXG4gICAgLy8gICAkc2NvcGUuZW1wbG95ZWUgPSBlbXAuZGF0YTtcbiAgICAvLyB9KTtcblxuICAgICRzY29wZS51cGRhdGVFbXAgPSBmdW5jdGlvbihlbXApe1xuICAgICAgJHNjb3BlLnNob3d1cGRhdGUgPSBmYWxzZTtcbiAgICAgICRzY29wZS5lbXB1cGRhdGUgPSBlbXA7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlbXApO1xuICAgICAgJHN0YXRlLmdvKCdzaG93ZW1wbG95ZWUudXBkYXRlZW1wbG95ZWUnKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN1Ym1pdEVtcGxveWVlID0gZnVuY3Rpb24oZW1wY2hhbmdlKXtcbiAgICAgIHZhciBlbXBsb3llZUlkID0gZW1wY2hhbmdlLnVzZXJfaWQ7XG4gICAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZWVtcGxveWVlKGVtcGxveWVlSWQsZW1wY2hhbmdlKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXt9KTtcbiAgICB9O1xuXG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5hbmltYXRpb24oJy5zbGlkZS1kb3duJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbiAgICAgIFR3ZWVuTWF4LmZyb20oZWxlbWVudCwgMSwge29wYWNpdHk6MCwgeTo1MCwgb25Db21wbGV0ZTpkb25lfSlcbiAgICB9LFxuICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lKSB7XG4gICAgICBUd2Vlbk1heC50byhlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuICAgIH1cbiAgfVxufSk7XG5cbi8vICgnLm1haW4tY29udGVudCcsIFtmdW5jdGlvbigpe1xuLy8gICByZXR1cm4ge1xuLy8gICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lKSB7XG4vLyAgICAgICBUd2Vlbk1heC5mcm9tKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4vLyAgICAgfSxcbi8vICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuLy8gICAgICAgVHdlZW5NYXgudG8oZWxlbWVudCwgMSwge29wYWNpdHk6MCwgeTo1MCwgb25Db21wbGV0ZTpkb25lfSlcbi8vICAgICB9XG4vLyAgIH1cbi8vIH1dKVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2lnbmluQ3RybCcsc2lnbmluQ3RybClcblxuZnVuY3Rpb24gc2lnbmluQ3RybCgkc2NvcGUsbG9naW5TZXJ2aWNlLCRzdGF0ZSl7XG5cblxuXG5cbiRzY29wZS5sb2dpbiA9IHtcbiAgdXNlcm5hbWU6ICdhQGEuY29tJyxcbiAgcGFzc3dvcmQ6ICdhJ1xufVxuXG5cbiRzY29wZS5zdWJtaXRsb2dpbiA9IGZ1bmN0aW9uKGxvZ2luKXtcbiAgbG9naW5TZXJ2aWNlLmdldExvZ2luKGxvZ2luKVxuICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICBpZihyZXMuc3RhdHVzID09PSAyMDApICRzdGF0ZS5nbygnbWFpbnBhZ2UnKTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICB9KTtcbn1cblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbn0pIC8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmRpcmVjdGl2ZSgndGl0bGVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L3RpdGxlLmh0bWwnXG5cbiAgICAgIH1cblxufSkvL2VuZCBvZiBkaXJlY3RpdmVcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5zZXJ2aWNlKCdjcmVhdGVTZXJ2aWNlJywgY3JlYXRlU2VydmljZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2UoJGh0dHAsICRxKSB7XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzaXRlIHcvbyBkYXlzIGFuZCBob3Vyc1xuICAgIHZhciBzaXRlSWQ7XG4gICAgdGhpcy5zaGlmdHMgPSBbXTtcbiAgICB0aGlzLnNpdGU7XG4gICAgdGhpcy5kYXk7XG4gICAgdGhpcy5jcmVhdGVzaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVzaXRlXCIsIGRhdGE6IG9ian0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBzaXRlSWQgPSByZXMuZGF0YVswXS5zaXRlX2lkO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSByZXN0IG9mIHRoZSBzaXRlIC0tIGRheXMgYW5kIGhvdXJzXG4gICAgdGhpcy5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNoaWZ0KTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZCA9IHNpdGVJZDtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZWRheWFuZGhvdXJzXCIsIGRhdGE6IHNoaWZ0fSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIGVtcGxveWVlXG4gICAgdmFyIGVtcGxveWVlSWQ7XG4gICAgdGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCkge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZW1wbG95ZWVcIiwgZGF0YTogZW1wfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIGVtcGxveWVlSWQgPSByZXMuZGF0YVswXS51c2VyX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZW1wbG95ZWVJZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhlIHNpdGUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe3RpdGxlOiBcIlNpdGUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoYXQgdGhlIGVtcGxveWVlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLmVtcGxveWVlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiRW1wbG95ZWUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5hZGR0b1NoaWZ0cyA9IGZ1bmN0aW9uKHNoaWZ0cykge1xuICAgICAgICB0aGlzLnNoaWZ0cy5wdXNoKHNoaWZ0cyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2hpZnRzKTtcblxuICAgIH07XG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbG9naW5TZXJ2aWNlJyxsb2dpblNlcnZpY2UpO1xuXG5cbmZ1bmN0aW9uIGxvZ2luU2VydmljZSgkaHR0cCl7XG5cbnRoaXMuZ2V0TG9naW4gPSBmdW5jdGlvbihsb2dpbil7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDonL2F1dGgvbG9naW4nLFxuICAgIGRhdGE6IGxvZ2luXG4gIH0pO1xufVxuXG5cblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdtYWlucGFnZVNlcnZpY2UnLG1haW5wYWdlU2VydmljZSk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlU2VydmljZSgkaHR0cCl7XG5cbnRoaXMuZ2V0Y3VycmVudCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOiBcIi9hdXRoL2N1cnJlbnRcIlxuICB9KVxufVxuXG50aGlzLmdldFVzZXJTaXRlcyA9IGZ1bmN0aW9uKHVzZXJTaXRlSWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9nZXRVc2VyU2l0ZXMvXCIgKyB1c2VyU2l0ZUlkXG4gIH0pXG59XG5cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnb3ZlcnZpZXdTZXJ2aWNlJyxvdmVydmlld1NlcnZpY2UpXG5cbmZ1bmN0aW9uIG92ZXJ2aWV3U2VydmljZSgkaHR0cCl7XG5cbnZhciBzZWxlY3RlZFNoaWZ0SWQgPXt9O1xuXG5pZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNlbGVjdGVkU2hpZnRJZFwiKSl7XG5zZWxlY3RlZFNoaWZ0SWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2VsZWN0ZWRTaGlmdElkXCIpKTtcbn1cbnRoaXMuZ2V0U2l0ZUlkID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHNlbGVjdGVkU2hpZnRJZDtcbn1cbnRoaXMuc2V0U2l0ZUlkID0gZnVuY3Rpb24oZGF0YSl7XG4gIHNlbGVjdGVkU2hpZnRJZCA9IGRhdGE7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2VsZWN0ZWRTaGlmdElkXCIsSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRTaGlmdElkKSk7XG59XG5cbmNvbnNvbGUubG9nKHRoaXMuaWROdW1WYXIpO1xuXG4vLyB0aGlzLnNpdGVWaWV3ID0ge307XG4vLyBjb25zb2xlLmxvZyh0aGlzLnNpdGVWaWV3KTtcblxuXG50aGlzLm92ZXJWaWV3U2l0ZXMgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9zaXRlb3ZlcnZpZXdcIlxuICB9KVxufVxuXG50aGlzLnNob3dEYXlzID0gZnVuY3Rpb24oaWROdW0pe1xuXG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL3NjaGVkdWxlRGF5cy9cIiArIGlkTnVtXG4gIH0pXG59XG5cbnRoaXMuc2hvd0hvdXJzID0gZnVuY3Rpb24oaWROdW0pe1xuICAvLyBjb25zb2xlLmxvZyhpZE51bSk7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOiBcIi9zY2hlZHVsZUhvdXJzL1wiICsgaWROdW1cbiAgfSlcbn1cblxudGhpcy5lbXBsb3llZVNjaGVkdWxlID0gZnVuY3Rpb24oc2NoZWR1bGVTaGlmdCl7XG4gIC8vIGNvbnNvbGUubG9nKHNjaGVkdWxlU2hpZnQpO1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIlBPU1RcIixcbiAgICB1cmw6XCIvZW1wbG95ZWVzY2hlZHVsZVwiLFxuICAgIGRhdGE6c2NoZWR1bGVTaGlmdFxuICB9KVxufVxuXG50aGlzLmdldFVzZXJJbmZvID0gZnVuY3Rpb24odXNlcklkKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvZ2V0VXNlckluZm8vXCIgKyB1c2VySWRcbiAgfSlcbn1cblxudGhpcy5nZXRVc2VySWQgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9hdXRoL2N1cnJlbnRcIlxuICB9KVxufVxuXG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgndXBkYXRlU2VydmljZScsdXBkYXRlU2VydmljZSlcblxuZnVuY3Rpb24gdXBkYXRlU2VydmljZSgkaHR0cCl7XG5cbnZhciBzZWxlY3RlZFNpdGVJZCA9e307XG5cblxuaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzZWxlY3RlZFNpdGVJZFwiKSl7XG5zZWxlY3RlZFNpdGVJZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzZWxlY3RlZFNpdGVJZFwiKSk7XG59XG50aGlzLmdldFNpdGVJZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBzZWxlY3RlZFNpdGVJZDtcbn1cbnRoaXMuc2V0U2l0ZUlkID0gZnVuY3Rpb24oZGF0YSl7XG4gIHNlbGVjdGVkU2l0ZUlkID0gZGF0YTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzZWxlY3RlZFNpdGVJZFwiLEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkU2l0ZUlkKSk7XG59XG5cblxudmFyIHNlbGVjdGVkRW1wSWQgPXt9O1xuXG5cbmlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2VsZWN0ZWRFbXBJZFwiKSl7XG5zZWxlY3RlZEVtcElkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNlbGVjdGVkRW1wSWRcIikpO1xufVxudGhpcy5nZXRFbXBJZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBzZWxlY3RlZEVtcElkO1xufVxudGhpcy5zZXRFbXBJZCA9IGZ1bmN0aW9uKGRhdGEpe1xuICBzZWxlY3RlZEVtcElkID0gZGF0YTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzZWxlY3RlZEVtcElkXCIsSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRFbXBJZCkpO1xufVxuXG50aGlzLnNpdGVWaWV3ID0ge307XG5jb25zb2xlLmxvZyh0aGlzLnNpdGVWaWV3KTtcblxudGhpcy51cGRhdGVTaXRlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6Jy9zaXRlb3ZlcnZpZXcnXG4gIH0pXG59XG5cbnRoaXMuYWxsU2l0ZUluZm8gPSBmdW5jdGlvbihzaXRlSWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDonL2dldHNpdGVhbmRob3Vycy8nICsgc2l0ZUlkXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlc2l0ZSA9IGZ1bmN0aW9uKHVwZGF0ZUlkLHVwZGF0ZVNpdGUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6Jy91cGRhdGVzaXRlLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVTaXRlXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlaG91cnMgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlVGltZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDonL3VwZGF0ZWhvdXJzLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVUaW1lXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlZW1wbG95ZWUgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlRW1wbG95ZWUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6ICcvdXBkYXRlZW1wbG95ZWUvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZUVtcGxveWVlXG4gIH0pXG59XG5cbnRoaXMuc2hvd2VtcGxveWVlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgdXJsOlwiL3ZpZXdlbXBsb3llZVwiXG4gIH0pXG59XG5cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
