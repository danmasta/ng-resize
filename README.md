ngResize
========

Angular module for managing resize events in your applications. Some of goals of this project worth noting include:

* Be lightweight, flexible and easy to use
* Only bind resize event handler one time
* Throttle resize events

##Usage
ngResize is composed of a provider, a service, and a directive. The service can be injected into other modules and used to programatically bind resize events in angular applications. The provider can be injected into your app's configuration phase to set things like throttle time.

###Provider
```javascript
app.config(['resizeProvider', function(resizeProvider){
  resizeProvider.throttle = 100;
  resizeProvider.initBind = false;
}]);
```
####Properties
name | description
---- | ----
<pre>throttle</pre> | Throttle time for resize events, default is 100
<pre>initBind</pre> | Boolean to determine if we should bind resize event when service object is created, default is true

###Service
```javascript
app.directive('someDirective', ['resize', function(resize){
  return{
    controller: function($scope){
      $scope.setDimensions = function($event){
        $scope.width = $event.width;
        $scope.height = $event.height;
      }
    },
    link: function($scope, $element, $attributes, controller){
      $scope.$on('resize', function($event){
        $scope.setDimensions($event);
      });
    }
  };
}]);
```
####Methods
name | description
---- | ----
<pre>getThrottle()</pre> | Returns current throttle time
<pre>setThrottle(integer)</pre> | Sets current throttle time, applies to entire app
<pre>trigger($scope)</pre> | $broadcast a resize event, defaults from $rootScope, with option to trigger in specified $scope
<pre>bind()</pre> | Bind resize event to $window, only useful if initBind = false or event has been unbound
<pre>unbind()</pre> | Unbinds resize even from $window

###Directive
Something worth noting is that when the resize event is triggered, $timeout is used to debounce the expression to the end of the current $digest. This is to try and ensure that any costly calculations you might be doing won't interfere with the current $digest cycle. This approach was taken because resize events are often not crtical functionality points, but necessary to maintain ux/ ui stability. The goal is to provide efficient, useful access to resize events without crippling the ui.
```html
<div ng-resize="setDimensions($event)"></div>
```

##Roadmap
A few things I'm interested in pursuing with this project in the future are:

* option to disable $rootScope $broadcast
* ability to subscribe and unsubscribe $scopes from resize $broadcast
* ability to bind resize events to $elements
* manage detaching of $scopes and $elements when $destroyed
* set unique throttle time for each $scope or $element
