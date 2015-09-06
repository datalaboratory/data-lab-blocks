// Задаёт `range` переданным шкалам на основе размеров элемента с учётом отступов.
dataLab.directive('labSizeToScales', function ($parse) {
    return {
        // Подключается к `<svg>`.
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            // Обязательный параметр — объект со шкалами в параметре `data-lab-size-to-scales`.
            var getScales = $parse($attrs.labSizeToScales);

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

                var scales = getScales($scope);

                // Это ОК, если ключа `x` или `y` нет в объекте — работаем с тем, что есть.
                if (scales.x) {
                    // Если по ключу нашёлся массив шкал — проставим значения в каждую из них.
                    if (angular.isArray(scales.x))
                        scales.x.forEach(setWidth);
                    // Если шкала одна — проставим в неё.
                    else
                        setWidth(scales.x);
                }

                if (scales.y) {
                    if (angular.isArray(scales.y))
                        scales.y.forEach(setHeight);
                    else
                        setHeight(scales.y);
                }
            })
        }
    };
});