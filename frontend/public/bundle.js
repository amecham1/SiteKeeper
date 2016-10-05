angular.module('keeperApp', ['ui.router','ui.bootstrap','ngAnimate','satellizer'])
.config(function($stateProvider, $urlRouterProvider, $authProvider) {


    $urlRouterProvider.otherwise('/')

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
// Begininning of satellizer





})//end of angular app

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

$scope.test='hello is this working';

}//end of homeCtrl

angular.module('keeperApp')
.controller('site_modalCtrl',site_modalCtrl)


function site_modalCtrl($scope,$uibModalInstance,createService){


  $scope.submit = function(site){
    createService.createsite(site)
    .then(function(response){
    })
    $uibModalInstance.close(
      createService.sitealert()
    );
  }



$scope.cancel= function(){
  $uibModalInstance.dismiss();
}

$scope.ok=function(){
  $uibModalInstance.close('Test');
}

}

angular.module('keeperApp')
.controller('employee_modalCtrl',employee_modalCtrl)


function employee_modalCtrl($scope,$uibModalInstance,createService){



  $scope.submit = function(employee){
    createService.createemployee(employee)
    .then(function(response){
    })
    $uibModalInstance.close(
      createService.employeealert()
    );
  }



$scope.cancel= function(){
  $uibModalInstance.dismiss();
}

$scope.ok=function(){
  $uibModalInstance.close('Test');
}

}

angular.module('keeperApp').directive('menuDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/menu.html',
        controller: function($scope, $uibModal) {
            // opens create site modal
            $scope.siteopen = function() {
                var modalInstance = $uibModal.open({
                    size: 'md', templateUrl: 'app/shared/createsite/createsitemodal.html', controller: 'site_modalCtrl',
                    // windowTemplateUrl:'app/shared/createsite/createsitemodal.html'
                })
            };
            // opens create employee modal
            $scope.employeeopen = function() {
                var modalInstance = $uibModal.open({size: 'md', templateUrl: 'app/shared/create_employee/employee_modal.html', controller: 'employee_modalCtrl'})
            };
        }
    }

})//end of directive

angular.module('keeperApp')
.service('createService',createService)

function createService($http,$q){

this.createsite = function(obj){
  return $http({
    method:"POST",
    url:"/createsite",
    data:obj
  })
};

this.createemployee = function(emp){
  return $http({
    method:"POST",
    url:"/createemployee",
    data:emp
  })
};


this.sitealert = function(){swal({
    title: "Site Created!",
    type: "success",
    confirmButtonText: "Ok",
    allowOutsideClick: true
  });

};

this.employeealert = function(){swal({
    title: "Employee Created!",
    type: "success",
    confirmButtonText: "Ok",
    allowOutsideClick: true
  });

};



}//end of service

angular.module('keeperApp')
.service('mainpageService',mainpageService);

function mainpageService(){




}//end of service

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJzaGFyZWQvY3JlYXRlc2l0ZS9zaXRlLW1vZGFsQ3RybC5qcyIsInNoYXJlZC9jcmVhdGVfZW1wbG95ZWUvZW1wbG95ZWVfbW9kYWxfY3RybC5qcyIsInNoYXJlZC9tZW51L21lbnUtZGlyZWN0aXZlLmpzIiwic2hhcmVkL3NlcnZpY2VzL2NyZWF0ZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvbWFpbnBhZ2VTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnLCBbJ3VpLnJvdXRlcicsJ3VpLmJvb3RzdHJhcCcsJ25nQW5pbWF0ZScsJ3NhdGVsbGl6ZXInXSlcbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlcikge1xuXG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJylcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdzaWduaW4nLHtcbiAgICAgIHVybDonLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL3NpZ25pbi9zaWduaW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnc2lnbmluQ3RybCdcbiAgICB9KVxuXG4gICAgLnN0YXRlKCdtYWlucGFnZScse1xuICAgICAgdXJsOicvbWFpbnBhZ2UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9tYWluL21haW5wYWdlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ21haW5wYWdlQ3RybCdcbiAgICB9KVxuLy8gQmVnaW5pbm5pbmcgb2Ygc2F0ZWxsaXplclxuXG5cblxuXG5cbn0pLy9lbmQgb2YgYW5ndWxhciBhcHBcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5DdHJsJyxtYWluQ3RybClcblxuZnVuY3Rpb24gbWFpbkN0cmwoJHNjb3BlKXtcblxuJHNjb3BlLnRlc3Q9XCJoZWxsb1wiXG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWlucGFnZUN0cmwnLG1haW5wYWdlQ3RybCk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlQ3RybCgpe1xuXG5cblxuXG5cbn0vL2VuZCBvZiBtYWlucGFnZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ3NpZ25pbkN0cmwnLHNpZ25pbkN0cmwpXG5cbmZ1bmN0aW9uIHNpZ25pbkN0cmwoJHNjb3BlKXtcblxuJHNjb3BlLnRlc3Q9J2hlbGxvIGlzIHRoaXMgd29ya2luZyc7XG5cbn0vL2VuZCBvZiBob21lQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2l0ZV9tb2RhbEN0cmwnLHNpdGVfbW9kYWxDdHJsKVxuXG5cbmZ1bmN0aW9uIHNpdGVfbW9kYWxDdHJsKCRzY29wZSwkdWliTW9kYWxJbnN0YW5jZSxjcmVhdGVTZXJ2aWNlKXtcblxuXG4gICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbihzaXRlKXtcbiAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUoc2l0ZSlcbiAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgfSlcbiAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZShcbiAgICAgIGNyZWF0ZVNlcnZpY2Uuc2l0ZWFsZXJ0KClcbiAgICApO1xuICB9XG5cblxuXG4kc2NvcGUuY2FuY2VsPSBmdW5jdGlvbigpe1xuICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG59XG5cbiRzY29wZS5vaz1mdW5jdGlvbigpe1xuICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgnVGVzdCcpO1xufVxuXG59XG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdlbXBsb3llZV9tb2RhbEN0cmwnLGVtcGxveWVlX21vZGFsQ3RybClcblxuXG5mdW5jdGlvbiBlbXBsb3llZV9tb2RhbEN0cmwoJHNjb3BlLCR1aWJNb2RhbEluc3RhbmNlLGNyZWF0ZVNlcnZpY2Upe1xuXG5cblxuICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oZW1wbG95ZWUpe1xuICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlZW1wbG95ZWUoZW1wbG95ZWUpXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIH0pXG4gICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoXG4gICAgICBjcmVhdGVTZXJ2aWNlLmVtcGxveWVlYWxlcnQoKVxuICAgICk7XG4gIH1cblxuXG5cbiRzY29wZS5jYW5jZWw9IGZ1bmN0aW9uKCl7XG4gICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoKTtcbn1cblxuJHNjb3BlLm9rPWZ1bmN0aW9uKCl7XG4gICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCdUZXN0Jyk7XG59XG5cbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5kaXJlY3RpdmUoJ21lbnVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L21lbnUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJHVpYk1vZGFsKSB7XG4gICAgICAgICAgICAvLyBvcGVucyBjcmVhdGUgc2l0ZSBtb2RhbFxuICAgICAgICAgICAgJHNjb3BlLnNpdGVvcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XG4gICAgICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9jcmVhdGVzaXRlL2NyZWF0ZXNpdGVtb2RhbC5odG1sJywgY29udHJvbGxlcjogJ3NpdGVfbW9kYWxDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gd2luZG93VGVtcGxhdGVVcmw6J2FwcC9zaGFyZWQvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlbW9kYWwuaHRtbCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIG9wZW5zIGNyZWF0ZSBlbXBsb3llZSBtb2RhbFxuICAgICAgICAgICAgJHNjb3BlLmVtcGxveWVlb3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe3NpemU6ICdtZCcsIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9jcmVhdGVfZW1wbG95ZWUvZW1wbG95ZWVfbW9kYWwuaHRtbCcsIGNvbnRyb2xsZXI6ICdlbXBsb3llZV9tb2RhbEN0cmwnfSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbn0pLy9lbmQgb2YgZGlyZWN0aXZlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdjcmVhdGVTZXJ2aWNlJyxjcmVhdGVTZXJ2aWNlKVxuXG5mdW5jdGlvbiBjcmVhdGVTZXJ2aWNlKCRodHRwLCRxKXtcblxudGhpcy5jcmVhdGVzaXRlID0gZnVuY3Rpb24ob2JqKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJQT1NUXCIsXG4gICAgdXJsOlwiL2NyZWF0ZXNpdGVcIixcbiAgICBkYXRhOm9ialxuICB9KVxufTtcblxudGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDpcIi9jcmVhdGVlbXBsb3llZVwiLFxuICAgIGRhdGE6ZW1wXG4gIH0pXG59O1xuXG5cbnRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKXtzd2FsKHtcbiAgICB0aXRsZTogXCJTaXRlIENyZWF0ZWQhXCIsXG4gICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIixcbiAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZVxuICB9KTtcblxufTtcblxudGhpcy5lbXBsb3llZWFsZXJ0ID0gZnVuY3Rpb24oKXtzd2FsKHtcbiAgICB0aXRsZTogXCJFbXBsb3llZSBDcmVhdGVkIVwiLFxuICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxuICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsXG4gICAgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWVcbiAgfSk7XG5cbn07XG5cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbWFpbnBhZ2VTZXJ2aWNlJyxtYWlucGFnZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBtYWlucGFnZVNlcnZpY2UoKXtcblxuXG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
