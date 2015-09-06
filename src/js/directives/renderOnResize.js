// Отправляет событие `renderRequired` при изменении размеров окна.
dataLab.directive('labRenderOnResize', function ($parse) {
    return {
        // Подключается к любому элементу.
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            var $window = angular.element(window);
            // Настройки `transition` передаются через аргумент `data-lab-render-on-resize`.
            var getTransition = $parse($attrs.labRenderOnResize);

            function renderOnResize() {
                $scope.$emit('renderRequired', getTransition($scope));
            }

            // Функция цепляется на событие `resize` окна.
            $window.on('resize', renderOnResize);
            // При уничтожении `$scope` перестаём слушать событие.
            $scope.$on('$destroy', function () {
                $window.off('resize', renderOnResize);
            });
        }
    };
});