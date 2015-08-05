dataLab.directive('labMargin', function () {
    return {
        // Обычно подключается к `<g>`.
        restrict: 'A',
        // Не использует `$scope`.
        scope: {},
        link: function ($scope, $element) {
            var element = $element[0];
            var d3element = d3.select(element);

            // Срабатывает на `render`.
            $scope.$on('render', function ($event, render) {
                // Добавляет свойство `transform` со значением `translate`,
                // сдвигая группу на указанные в `margin` координаты `top` и `left`.
                var translate = 'translate('
                    + render.margin.left + ',' + render.margin.top + ')';
                d3element.attr('transform', translate)
            })
        }
    }
});