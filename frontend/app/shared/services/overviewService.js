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
