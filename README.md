ngResize
========

Angular module for handling resize events in your angular js applications. Some of goals of this project worth noting include:

* Be lightweight, flexible and easy to use
* Only bind resize event handler one time
* Throttle resize events

#Usage
ngResize is composed of one factory and one directive. The factory can be injected into any controller, service, factory, or directive and be used to programatically bind resize events in your applications. The factory can be injected and used like so:

###Factory: resize
```javascript
app.directive('someDirective', ['resize', function(resize){
  return{
    controller: function($scope){
      $scope.setDimensions = function(data){
        $scope.width = data.width;
        $scope.height = data.height;
      }
    },
    link: function($scope, $element, $attributes, controller){
      resize.bind();
      $scope.$on('resize', function($event){
        $scope.setDimensions($event);
      });
    }
  };
}])
```
####Methods
name | description
---- | ----
<pre>checkBind()</pre> | Check's to see if the resize event handler has already been bound. Returns boolean.
<pre>setBind()</pre> | Binds and throttles the resize event handler to the window - this should not be used, instead use the bind method to bind resize programatically.
<pre>bind()</pre> | Makes sure resize event handler is set, if not then it will bind the event - Useful one liner to ensure event is bound, will bind event only one time.

###Directive: ng-resize
The directive approach is similar to default angular directives. Something worth noting is that when the resize event is triggered, $timeout is used to debounce the expression to the end of the current digest. The is to try and ensure any costly calculations you might be doing won't interfere with the current digest. This approach was taken because resize events are often not crtical functionality points in a project, but necessary nonetheless. The goal is to provide efficient, useful access to resize events without crippling the ui.

```html
<div ng-resize="setDimensions($event)"></div>
```
