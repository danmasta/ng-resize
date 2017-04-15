var app = angular.module('app', ['ngResize']);

app.directive('resizeTest', ['resize', function(resize){
    return{
        restrict:'A',
        controller: function($scope){

            $scope.$on('resize', function(data, $event){
                $scope.size = $event;
            });

        },
        link:function($scope, $element, $attribute){

        }
    };
}]);
