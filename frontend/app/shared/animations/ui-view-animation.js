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
