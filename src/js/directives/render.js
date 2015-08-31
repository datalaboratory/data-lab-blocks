// Вызов произвольной функции, обрабатывающей событие `render`.
angular.module('dataLab').directive('labRender', function (applyTransition) {
    return {
        // Подключается к элементу, который требуется отрисовать.
        restrict: 'A',
        scope: {
            // Коллбек передаётся через аргумент с названием директивы.
            cb: '=labRender'
        },
        link: function ($scope, $element) {
            var element = $element[0];
            var d3element = d3.select(element);
            // Срабатывает на `render`.
            $scope.$on('render', function ($event, render, transition) {
                // Автоматически применяет `transition`, анимируя все изменения.
                var target = applyTransition(d3element, transition);
                // Коллбек должен быть функцией.
                if (angular.isFunction($scope.cb))
                // Коллбек вызывается с аргументами `$event` и `render` — событием с мета-информацией и `render`.
                // Элемент, на котором используется директива передаётся через `this`.
                    $scope.cb.call(target, $event, render);
            });
        }
    };
});