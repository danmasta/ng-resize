/**
* @license ngResize.js v1.1.0
* (c) 2014 Daniel Smith http://www.danmasta.com
* License: MIT
*/
(function(window, angular, undefined){

	/**
	* @name ngResize
	* @description
	*
	* # ngResize
	*
	* ngResize module provides an angular directive, provider,
	* and service for managing resize events in applications
	*
	* expressions are run when the window resizes and debounced
	* event object is available as $event.
	*/

	// define ngResize module
	var ngResize = angular.module('ngResize', []);

	/*
	* ngResize Provider and Service
	*
	* provider allows to set throttle in config
	* and wether or not to bind on service initialization
	*
	* $broadcasts 'resize' event from $rootScope
	* which gets inherited by all child scopes
	*/
	ngResize.provider('resize', [function resizeProvider(){

		// store throttle time
		this.throttle = 100;

		// by default bind window resize event when service
		// is initialize/ injected for first time
		this.initBind = 1;

		// service object
		this.$get = ['$rootScope', '$window', '$interval',  function($rootScope, $window, $interval){

			var _this = this;

			// api to set throttle amount
			function setThrottle(throttle){
				_this.throttle = throttle
			};

			// api to get current throttle amount
			function getThrottle(){
				return _this.throttle;
			};

			// trigger a resize event on provided $scope or $rootScope
			function trigger($scope){
				var $scope = $scope || $rootScope;
				$scope.$broadcast('resize', {
					width: $window.innerWidth,
					height: $window.innerHeight
				});
			};

			// bind to window resize event, will only ever be bound
			// one time for entire app
			var bound = 0;
			var timer = 0;
			var resized = 0;
			function bind(){
				if(!bound){
					var w = angular.element($window);
					w.on('resize', function(event){
						if(!resized){
							timer = $interval(function(){
								if(resized){
									resized = 0;
									$interval.cancel(timer);
									trigger();
								}
							}, _this.throttle);
						}
						resized = 1;
					});
					bound = 1;
					w.triggerHandler('resize');
				}
			};

			// unbind window scroll event
			function unbind(){
				if(bound){
					var w = angular.element($window);
					w.off('resize');
					bound = 0;
				}
			};

			// by default bind resize event when service is created
			if(_this.initBind){
				bind();
			}

			// return api
			return{
				getThrottle: getThrottle,
				setThrottle: setThrottle,
				trigger: trigger,
				bind: bind,
				unbind: unbind
			};

		}];

	}]);

	/*
	* ngResize Directive
	*
	* uses a throttled resize event bound to $window;
	* will bind event only once for entire app
	* broadcasts 'resize' event from $rootScope
	*
	* usage: ng-resize="expression()"
	* event data is available as $event
	* $timeout is used to debounce any expressions
	* to the end of the current digest
	*/
	ngResize.directive('ngResize', ['$parse', '$timeout', 'resize', function($parse, $timeout, resize){
		return {
			compile: function($element, attr){
				var fn = $parse(attr['ngResize']);
				return function(scope, element, attr){
					scope.$on('resize', function(event, data){
						$timeout(function(){
							scope.$apply(function(){
								fn(scope, { $event: data });
							});
						});
					});
				};
			}
		};
	}]);

})(window, window.angular);
