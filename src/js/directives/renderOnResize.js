// Отправляет событие `renderRequired` при изменении размеров окна.
dataLab.directive('labRenderOnResize', function () {
    return {
        // Подключается к любому элементу.
        restrict: 'A',
        scope: {
            // Настройки `transition` передаются через аргумент с названием директивы.
            transition: '=labRenderOnResize'
        },
        link: function ($scope) {
            var $window = angular.element(window);

            function renderOnResize() {
                $scope.$emit('renderRequired', $scope.transition);
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