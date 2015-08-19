// Задаёт `range` переданным шкалам на основе размеров элемента с учётом отступов.
dataLab.directive('labSizeToScales', function () {
    return {
        // Обычно подключается к `<svg>`.
        restrict: 'A',
        scope: {
            // Обязательный параметр — объект со шкалами.
            scales: '=labSizeToScales'
        },
        link: function ($scope, $element) {
            // Срабатывает на `render`.
            $scope.$on('render', function onRender($event, render) {
                // В `range` шкал попадают размеры «рабочей области» элемента —
                // реальные размеры минус отступы, описанные в `margin`.
                var width = $element.width()
                    - render.margin.left - render.margin.right;
                var height = $element.height()
                    - render.margin.top - render.margin.bottom;

                var setWidth = function (scale) {
                    // У горизонтальных шкал начало отсчёта слева.
                    scale.range([0, width]);
                };

                var setHeight = function (scale) {
                    // У вертикальных — снизу.
                    scale.range([height, 0]);
                };

                // Это ОК, если ключа `x` или `y` нет в объекте — работаем с тем, что есть.
                if ($scope.scales.x) {
                    // Если по ключу нашёлся массив шкал — проставим значения в каждую из них.
                    if (angular.isArray($scope.scales.x))
                        $scope.scales.x.forEach(setWidth);
                    // Если шкала одна — проставим в неё.
                    else
                        setWidth($scope.scales.x);
                }

                if ($scope.scales.y) {
                    if (angular.isArray($scope.scales.y))
                        $scope.scales.y.forEach(setHeight);
                    else
                        setHeight($scope.scales.y);
                }
            })
        }
    }
});