var app = angular.module('app', ['ngResize']);

app.directive('resizeTest', ['resize', function(resize){
  return{
    restrict:'A',
    controller: function($scope){
      $scope.$on('resize', function(data, $event){
        $scope.size = $event;
      });
    },
    template:'<li data-test-item ng-repeat="item in testitems">{{item.title}}</li>',
    link:function($scope, $element, $attribute){
      $scope.testitems = [];
      for( var i = 0; i < 500; i++){
        $scope.testitems.push({title:'test item ' + i, value:i});
      }
    }
  };
}]);

(function(window, document){
  var s = document.createElement('script'); 
  s.type = 'text/javascript'; 
  s.async = true;
  s.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(s);
})(window, window.document)
