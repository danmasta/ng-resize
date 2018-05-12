# ngResize

Angular module for managing resize events in your applications. Some of goals of this project worth noting include:

* Lightweight, flexible and easy to use
* Bind resize event handler one time for entire app
* Throttle window resize events

## Usage
ngResize is composed of a `provider`, a `service`, and a `directive`. The service can be injected into other modules and used to programatically bind `resize` events in angular applications. The `provider` can be injected into your app's configuration phase to set things like throttle time.

Set `ngResize` as a dependency in your module:

```javascript
var app = angular.module('YourApp', ['ngResize']);
```

### Provider
```javascript
app.config(function(resizeProvider) {

    // set throttle time
    resizeProvider.throttle = 100;

    // don't bind resize events on service initialization
    resizeProvider.initBind = false;

});
```

#### Properties
name | description
---- | ----
`throttle` | Throttle time for resize events, default is `32` (30 fps)
`initBind` | Boolean to determine if we should bind resize event when service object is created, default is `true`

### Service
```javascript
app.directive('someDirective', function(resize) {
    return {
        controller: function($scope) {

        },
        link: function($scope, $elem, $attr, ctrl) {

            // on resize event, set dimensions
            // $event, and data arguments are available
            $scope.$on('resize', function($event, data) {
                $scope.width = data.width;
                $scope.height = data.height;
            });

        }
    };
});
```
*The event listener callback accepts two arguments: `$event`, and `data`*

#### Methods
name | description
---- | ----
`getThrottle()` | Returns current throttle time
`setThrottle(integer)` | Sets current throttle time, applies to entire app
`trigger([$scope])` | `$broadcast` a `resize` event from specified `$scope` or `$rootScope`
`bind()` | Bind resize event to `$window`, only useful if `initBind = false` or if event has been previously unbound
`unbind()` | Unbinds `resize` even from `$window`

### Directive
Something worth noting is that when the `resize` event is triggered, `$timeout` is used to debounce the expression to the end of the current `$digest`. This is to try and ensure that any costly calculations you might be doing won't interfere with the current `$digest` cycle. This approach was taken because resize events are often not critical functionality points, but necessary to maintain ui/ux stability. The goal is to provide efficient, useful access to `resize` events without crippling the ui.

```html
<div ng-resize="setDimensions($event, data)"></div>
```
*Two arguments are available to directive expressions: `$event`, and `data`*

## Roadmap
A few things I'm interested in pursuing with this project in the future are:

* option to disable `$rootScope` `$broadcast`
* ability to subscribe and unsubscribe `$scopes` from resize `$broadcast`
* ability to bind `resize` events to `$elements`
* manage detaching of `$scopes` and `$elements` when `$destroyed`
* set unique throttle time for each `$scope` or `$element`
