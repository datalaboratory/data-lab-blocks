// Сдвигает целевой `SVG`-элемент на отступ, указанный в параметрах `render`.
dataLab.directive('labMargin', function () {
    return {
        // Подключается к `<g>`.
        restrict: 'A',
        link: function ($scope, $element) {
            var element = $element[0];
            var d3element = d3.select(element);

            // Срабатывает на `render`.
            $scope.$on('render', function onRender($event, render) {
                // Добавляет свойство `transform` со значением `translate`,
                // сдвигая группу на указанные в `margin` координаты `top` и `left`.
                var translate = 'translate('
                    + render.margin.left + ',' + render.margin.top + ')';
                d3element.attr('transform', translate)
            })
        }
    };
});