// Директива задаёт прямоугольнику размеры рабочей области.
dataLab.directive('labFillSvg', function () {
    return {
        // Подключается к `<rect>`.
        restrict: 'A',
        link: function ($scope, $element) {
            var element = $element[0];
            var d3element = d3.select(element);

            var $svg = $element.parents('svg');

            // Срабатывает на `render`.
            $scope.$on('render', function ($event, render) {
                var width = $svg.width() - render.margin.left - render.margin.right;
                var height = $svg.height() - render.margin.top - render.margin.bottom;

                d3element
                    .attr('width', width)
                    .attr('height', height);
            });
        }
    };
});