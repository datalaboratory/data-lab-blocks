dataLab.directive('labAxis', function (callMethods, applyTransition) {
    return {
        restrict: 'A',
        scope: {
            config: '=labAxis'
        },
        link: function ($scope, $element) {
            var element = $element[0];
            var d3element = d3.select(element);

            var $svg = $element.parents('svg');

            var axis = d3.svg.axis();

            var prevGrid = false;

            $scope.$on('render', function ($event, render, transition) {
                if (!$scope.config) return;
                var config = $scope.config;
                if (!config.scale) return;
                if (!config.orient) return;

                callMethods(config, axis);

                Object.keys(config).forEach(function (key) {
                    if (axis[key]) axis[key](config[key]);
                });
                var width = $svg.width() - render.margin.left - render.margin.right;
                var height = $svg.height() - render.margin.top - render.margin.bottom;

                var isVertical = config.orient == 'top' || config.orient == 'bottom';
                if (config.grid)
                    axis.tickSize(-(isVertical ? height : width), 0);
                else
                    axis.tickSize(0, 0);

                var target;
                if (prevGrid == config.grid)
                    target = applyTransition(d3element, transition);
                else
                    target = d3element;
                prevGrid = config.grid;

                if (config.orient == 'right') {
                    target.attr('transform', 'translate(' + width + ',0)');
                } else if (config.orient == 'bottom') {
                    target.attr('transform', 'translate(0,' + height + ')');
                } else {
                    target.attr('transform', 'translate(0,0)');
                }
                target.call(axis);
            });
        }
    };
});