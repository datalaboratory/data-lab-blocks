// Отправляет на `$rootScope` событие `startRender` после получения одного или нескольких `renderRequired`.
dataLab.directive('labRenderLoop', function ($rootScope, $timeout) {
    return {
        // Подключается к любому элементу.
        restrict: 'A',
        link: function () {
            var renderRequired = false;
            $rootScope.$on('renderRequired', function onRenderRequired() {
                if (renderRequired) return;
                renderRequired = true;
                // Отправка события `startRender` происходит в следующем `$digest`.
                $timeout(function emitStartRender() {
                    renderRequired = false;
                    $rootScope.$emit('startRender');
                });
            });
        }
    };
});