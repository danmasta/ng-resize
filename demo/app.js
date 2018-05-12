var app = angular.module('app', ['ngResize']);

app.directive('resizeTest', ['resize', function(resize) {
    return {
        restrict: 'A',
        controller: function($scope) {

            $scope.$on('resize', function($event, data) {
                $scope.size = data;
            });

        },
        link: function($scope, $elem, $attr) {

        }
    };
}]);
