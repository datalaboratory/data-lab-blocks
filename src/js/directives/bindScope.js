// Помещает `$scope` в `datum` элемента. Даёт доступ к `$scope` в `D3`-обработчиках.
dataLab.directive('labBindScope', function (applyTransition) {
    return {
        // Подключается к любому элементу.
        restrict: 'A',
        link: function ($scope, $element) {
            var element = $element[0];
            var d3element = d3.select(element);
            d3element.datum($scope);
        }
    };
});