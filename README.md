ngResize
========

Angular module for managing resize events in your applications. Some of goals of this project worth noting include:

* Be lightweight, flexible and easy to use
* Only bind resize event handler one time
* Throttle resize events

## Usage
ngResize is composed of a provider, a service, and a directive. The service can be injected into other modules and used to programatically bind resize events in angular applications. The provider can be injected into your app's configuration phase to set things like throttle time.

Set `ngResize` as a dependency in your module:

```javascript
var app = angular.module('YourApp', ['ngResize']);
```

### Provider
```javascript
app.config(['resizeProvider', function(resizeProvider){
	
	// set throttle time
	resizeProvider.throttle = 100;
	
	// don't bind resize events on service innitialization
	resizeProvider.initBind = false;
}]);
```

#### Properties
name | description
---- | ----
`throttle` | Throttle time for resize events, default is 100
`initBind` | Boolean to determine if we should bind resize event when service object is created, default is true

### Service
```javascript
app.directive('someDirective', ['resize', function(resize){
	return{
		controller: function($scope){
		
			// sets current window dimensions on $scope
			$scope.setDimensions = function($event){
				$scope.width = $event.width;
				$scope.height = $event.height;
			};
		},
		link: function($scope, $element, $attributes, controller){
			
			// on resize event, set dimensions
			$scope.$on('resize', function($event){
				$scope.setDimensions($event);
			});
		}
	};
}]);
```

#### Methods
name | description
---- | ----
`getThrottle()` | Returns current throttle time
`setThrottle(integer)` | Sets current throttle time, applies to entire app
`trigger($scope)` | $broadcast a resize event, defaults from $rootScope, with option to trigger in specified $scope
`bind()` | Bind resize event to $window, only useful if initBind = false or event has been unbound
`unbind()` | Unbinds resize even from $window

### Directive
Something worth noting is that when the resize event is triggered, $timeout is used to debounce the expression to the end of the current $digest. This is to try and ensure that any costly calculations you might be doing won't interfere with the current $digest cycle. This approach was taken because resize events are often not crtical functionality points, but necessary to maintain ux/ ui stability. The goal is to provide efficient, useful access to resize events without crippling the ui.
```html
<div ng-resize="setDimensions($event)"></div>
```

## Roadmap
A few things I'm interested in pursuing with this project in the future are:

* option to disable $rootScope $broadcast
* ability to subscribe and unsubscribe $scopes from resize $broadcast
* ability to bind resize events to $elements
* manage detaching of $scopes and $elements when $destroyed
* set unique throttle time for each $scope or $element
