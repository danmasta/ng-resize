/**
 * @license ngResize.js v1.0.0
 * (c) 2014 Daniel Smith http://www.danmasta.com
 * License: MIT
 */
(function(window, angular, undefined) { 'use strict';

/**
 * @name ngResize
 * @description
 *
 * # ngResize
 *
 * The ngResize module provides an angular directive for handling resize events
 * expression is run when the window resizes.
 * The implementation is the same as default angular event handlers.
 * Event object is available as $event.
 */

// define ngResize module
var ngResize = angular.module('ngResize', []);

// Factory for checking and binding resize event to window.
//
// Broadcasts 'resize' event from $rootScope which gets inherited
// by all child scopes
ngResize.factory('resize', ['$window', '$interval', '$rootScope', function($window, $interval, $rootScope) {
  return {
    checkBind: function() {
      if (angular.isUndefined($rootScope.catchResize)) return false;
      return $rootScope.catchResize;
    },
    setBind: function() {
      var w = angular.element($window);
      var resizeThrottle = 100;
      var resized = false;
      var timer = false;
      w.on('resize', function(event) {
        if (!resized) {
          timer = $interval(function() {
            if (resized) {
              resized = false;
              $interval.cancel(timer);
              $rootScope.$broadcast('resize', {
                width: $window.innerWidth,
                height: $window.innerHeight
              });
            }
          }, resizeThrottle);
        }
        resized = true;
      });
      w.triggerHandler('resize');
      $rootScope.catchResize = true;
    },
    bind: function(){
      if (!this.checkBind()) return this.setBind();
    }
  };
}]);

// ngResize directive, uses throttled resize event bound to window; will bind event only once.
// Broadcasts 'resize' event from $rootScope
//
// Usage: ng-resize="expression()"
// Event data is available as $event
// Timeout is used to debounce any expressions to the end of the current digest
ngResize.directive('ngResize', ['$parse', '$timeout', 'resize', function($parse, $timeout, resize) {
  return {
    compile: function($element, attr) {
      var fn = $parse(attr['ngResize']);
      return function(scope, element, attr) {
        resize.bind();
        scope.$on('resize', function(event, data) {
          $timeout(function() {
            scope.$apply(function() {
              fn(scope, { $event: data });
            });
          });
        });
      };
    }
  };
}]);

})(window, window.angular);
