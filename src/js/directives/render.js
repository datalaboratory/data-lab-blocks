// Вызов произвольной функции, обрабатывающей событие `render`.
dataLab.directive('labRender', function ($parse, applyTransition) {
    return {
        // Подключается к элементу, который требуется отрисовать.
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            var element = $element[0];
            var d3element = d3.select(element);

            // Коллбек передаётся через аргумент `data-lab-render`.
            var getCallback = $parse($attrs.labRender);
            // Срабатывает на `render`.
            $scope.$on('render', function ($event, render, transition) {
                // Автоматически применяет `transition`, анимируя все изменения.
                var target = applyTransition(d3element, transition);
                // Коллбек должен быть функцией.
                var cb = getCallback($scope);
                if (angular.isFunction(cb))
                // Коллбек вызывается с аргументами `$event` и `render` — событием с мета-информацией и `render`.
                // Элемент, на котором используется директива передаётся через `this`.
                    cb.call(target, $event, render);
            });
        }
    };
});