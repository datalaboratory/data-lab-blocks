// Вызов произвольной функции, обрабатывающей событие `render`.
angular.module('dataLab').directive('labRender', function () {
    return {
        // Подключается к элементу, который требуется отрисовать.
        restrict: 'A',
        scope: {
            cb: '=labRender'
        },
        link: function ($scope, $element) {
            // Срабатывает на `render`.
            $scope.$on('render', function ($event, render) {
                // Коллбек должен быть функцией.
                if (angular.isFunction($scope.cb))
                // Коллбек вызывается с аргументами `$event` и `render` — событием с мета-информацией и `render`.
                // Элемент, на котором используется директива передаётся через `this`.
                    $scope.cb.call($element[0], $event, render)
            })
        }
    }
});