// Вызов произвольной функции, обрабатывающей событие `render`.
// Элемент, на котором используется директива передаётся через `this`.
angular.module('dataLab').directive('labRender', function () {
    return {
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
                    $scope.cb.call($element[0], $event, render)
            })
        }
    }
});