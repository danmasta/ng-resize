(function(window, angular) {

    var ngResize = angular.module('ngResize', []);

    ngResize.provider('resize', function resizeProvider() {

        // default throttle time 30fps
        this.throttle = 32;

        // bind to window resize event when service created
        this.initBind = 1;

        // service object
        this.$get = function($rootScope, $window, $interval) {

            var resize = this;
            var bound = 0;
            var timer = 0;
            var resized = 0;
            var $w = angular.element($window);

            // api to set throttle amount
            function setThrottle(time) {
                resize.throttle = time;
            }

            // api to get current throttle amount
            function getThrottle() {
                return resize.throttle;
            }

            // trigger a resize event on provided $scope or $rootScope
            function trigger($scope) {

                $scope = $scope || $rootScope;

                $scope.$broadcast('resize', {
                    width: $window.innerWidth,
                    height: $window.innerHeight
                });

            }

            // bind to window resize event, will only ever be bound
            // one time for entire app
            function bind() {

                if (!bound) {

                    $w.on('resize', function() {

                        if (!resized) {
                            timer = $interval(function() {
                                if (resized) {
                                    resized = 0;
                                    $interval.cancel(timer);
                                    resize.trigger();
                                }
                            }, resize.throttle);
                        }

                        resized = 1;

                    });

                    bound = 1;

                    $w.triggerHandler('resize');

                }

            }

            // unbind window resize event
            function unbind() {

                if (bound) {
                    $w.off('resize');
                    bound = 0;
                }

            }

            this.getThrottle = getThrottle;
            this.setThrottle = setThrottle;
            this.trigger = trigger;
            this.bind = bind;
            this.unbind = unbind;

            // bind window resize event when service created
            if (resize.initBind) {
                resize.bind();
            }

        };

    });

    ngResize.directive('ngResize', function($parse, $timeout, resize) {

        return {

            compile: function compile(elem, attr) {

                var fn = $parse(attr['ngResize']);

                return function resizeDirective($scope, $elem, $attr) {
                    $scope.$on('resize', function($event, data) {
                        $timeout(function() {
                            $scope.$apply(function() {
                                fn($scope, { $event: $event, data: data });
                            });
                        });
                    });
                };

            }

        };

    });

})(window, window.angular);
