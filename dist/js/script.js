var dataLab = angular.module('dataLab', []);
dataLab.directive('backedText', function(removePrototype) {
    return {
        restrict: 'E',
        templateNamespace: 'svg',
        replace: true,
        templateUrl: 'backedText/backedText.html',
        scope: {
            paddingX: '=',
            paddingY: '=',
            padding: '=',
            radiusX: '=',
            radiusY: '=',
            radius: '='
        },
        transclude: true,
        link: function($scope, $element) {
            var $text = $element.find('text');
            var $rect = $element.find('rect');
            var text = $text[0];
            var bbox = function() {
                return removePrototype(text.getBBox());
            };
            $scope.$watch(bbox, function(box) {
                var paddingX = $scope.paddingX || $scope.padding || 0;
                var paddingY = $scope.paddingY || $scope.padding || 0;
                var radiusX = $scope.radiusX || $scope.radius || 0;
                var radiusY = $scope.radiusY || $scope.radius || 0;
                $rect.attr({
                    x: box.x - paddingX,
                    y: box.y - paddingY,
                    rx: radiusX,
                    ry: radiusY,
                    width: box.width + paddingX * 2,
                    height: box.height + paddingY * 2
                });
            }, true);
        }
    };
});
dataLab.directive('bottomLine', function(removePrototype) {
    return {
        restrict: 'E',
        templateNamespace: 'svg',
        replace: true,
        templateUrl: 'bottomLine/bottomLine.html',
        scope: {
            stroke: '=',
            padding: '='
        },
        transclude: true,
        link: function($scope, $element) {
            var $text = $element.find('text');
            var $line = $element.find('line');
            var $svg = $element.parents('svg').first();
            var text = $text[0];
            var bbox = function() {
                return removePrototype(text.getBBox());
            };
            $scope.$watch(bbox, function(box) {
                $line.attr({
                    x1: box.x,
                    y1: box.y + box.height + $scope.padding,
                    x2: box.x,
                    y2: $svg.height()
                });
            }, true);
        }
    };
});
dataLab.directive('labDropdownFilter', function ($parse) {
    return {
        restrict: 'E',
        templateUrl: 'dropdownFilter/dropdownFilter.html',
        replace: true,
        scope: {
            config: '='
        },
        link: function link($scope, $element) {
            $scope.toggleList = function () {
                if ($scope.state == 'open') {
                    $scope.state = 'closed'
                } else $scope.state = 'open';
            };
            $scope.closeList = function () {
                $scope.state = 'closed';
            };

            $scope.$watch('config', function (config) {
                if (!config) return;
                $scope.values = config.values;
                if (angular.isArray($scope.values)) {
                    var values = {};
                    $scope.values.forEach(function (value) {
                        values[value] = value;
                    });
                    $scope.values = values;
                }
                var getModel = $parse(config.model);
                var setModel = getModel.assign;

                $scope.select = function (id) {
                    setModel($scope.$parent, id);
                    $scope.closeList();
                };

                $scope.$parent.$watch($scope.config.model, updateValue);
                $scope.$watch('config.allValues', function () {
                    updateValue($scope.currentId);
                });

                function updateValue(id) {
                    $scope.currentId = id;
                    if (id == null) {
                        $scope.currentValue = $scope.config.allValues
                    } else $scope.currentValue = $scope.values[id];

                }
            }, true);
        }
    };
});
dataLab.directive('labAxis', function (callMethods, applyTransition) {
    return {
        restrict: 'A',
        scope: {
            config: '=labAxis'
        },
        link: function ($scope, $element) {
            var element = $element[0];
            var d3element = d3.select(element);

            var $svg = $element.parents('svg');

            var axis = d3.svg.axis();

            var prevGrid = false;

            $scope.$on('render', function ($event, render, transition) {
                if (!$scope.config) return;
                var config = $scope.config;
                if (!config.scale) return;
                if (!config.orient) return;

                callMethods(config, axis);

                Object.keys(config).forEach(function (key) {
                    if (axis[key]) axis[key](config[key]);
                });
                var width = $svg.width() - render.margin.left - render.margin.right;
                var height = $svg.height() - render.margin.top - render.margin.bottom;

                var isVertical = config.orient == 'top' || config.orient == 'bottom';
                if (config.grid)
                    axis.tickSize(-(isVertical ? height : width), 0);
                else
                    axis.tickSize(0, 0);

                var target;
                if (prevGrid == config.grid)
                    target = applyTransition(d3element, transition);
                else
                    target = d3element;
                prevGrid = config.grid;

                if (config.orient == 'right') {
                    target.attr('transform', 'translate(' + width + ',0)');
                } else if (config.orient == 'bottom') {
                    target.attr('transform', 'translate(0,' + height + ')');
                } else {
                    target.attr('transform', 'translate(0,0)');
                }
                target.call(axis);
            });
        }
    };
});
// Директива задаёт прямоугольнику размеры рабочей области.
dataLab.directive('labFillSvg', function () {
    return {
        restrict: 'A',
        scope: {},
        link: function ($scope, $element) {
            var element = $element[0];
            var d3element = d3.select(element);

            var $svg = $element.parents('svg');

            // Срабатывает на `render`.
            $scope.$on('render', function ($event, render) {
                var width = $svg.width() - render.margin.left - render.margin.right;
                var height = $svg.height() - render.margin.top - render.margin.bottom;

                d3element
                    .attr('width', width)
                    .attr('height', height);
            })
        }
    }
});
// Сдвигает целевой `SVG`-элемент на отступ, указанный в параметрах `render`.
dataLab.directive('labMargin', function () {
    return {
        // Обычно подключается к `<g>`.
        restrict: 'A',
        link: function ($scope, $element) {
            var element = $element[0];
            var d3element = d3.select(element);

            // Срабатывает на `render`.
            $scope.$on('render', function onRender($event, render) {
                // Добавляет свойство `transform` со значением `translate`,
                // сдвигая группу на указанные в `margin` координаты `top` и `left`.
                var translate = 'translate('
                    + render.margin.left + ',' + render.margin.top + ')';
                d3element.attr('transform', translate)
            })
        }
    }
});
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
// Отправляет на `$rootScope` событие `startRender` после получения одного или нескольких `renderRequired`.
dataLab.directive('labRenderLoop', function ($rootScope, $timeout) {
    return {
        // Подключается к любому элементу.
        restrict: 'A',
        link: function () {
            var renderRequired = false;
            $rootScope.$on('renderRequired', function onRenderRequired($event, transition) {
                if (renderRequired) return;
                renderRequired = true;
                // Отправка события `startRender` происходит в следующем `$digest`.
                $timeout(function emitStartRender() {
                    renderRequired = false;
                    $rootScope.$emit('startRender', transition);
                });
            });
        }
    };
});
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
// Заменяет `NaN` на `undefined`.
dataLab.filter('preventNaN', function () {
    return function (number) {
        if (isNaN(number)) return undefined;
        return number;
    }
});

// Этот код «превращает» сервисы в фильтры, чтобы их можно было использовать в шаблонах.
var servicesAsFilters = [
// Включён для этих сервисов:
    'last',
    'numberDeclension'
];
servicesAsFilters.forEach(function (filter) {
    dataLab.filter(filter, function ($injector) {
        return $injector.get(filter);
    });
});

// Фильтр для прохода ангуляровской [проверки](https://docs.angularjs.org/api/ng/service/$sce) небезопасного контента.
dataLab.filter('trust', function ($sce) {
    return function (html) {
        // Есть эксперементальная поддержка промисов.
        if (angular.isObject(html)) {
            if (html.$$state.value) {
                console.log('trusting promise', html.$$state.value);
                return $sce.trustAsHtml(html.$$state.value);
            }
            else
                return 'UNRESOLVED PROMISE'
        }
        return $sce.trustAsHtml(html);
    }
});

// Библиотека data-lab-blocks.

// # Блоки
// Блоки как в БЭМ, переиспользуемые компоненты.
// * [backedText](/docs/backedText.html) — текст с настраиваемой подложкой;
// * [dropdownFilter](/docs/backedText.html) — выпадающий фильтр;
// * [bottomLine](/docs/bottomLine.html) — линия от текстового элемента до низа контейнера.

// # Директивы
// «Строительные блоки» `angular`-страниц.
// * [renderLoop](/docs/renderLoop.html) — обеспечивает рассылку `render`-сообщений;
// * [margin](/docs/margin.html) — сдвигает целевой `SVG`-элемент на отступ, указанный в параметрах `render`;
// * [sizeToScales](/docs/sizeToScales.html) — задаёт `range` переданным шкалам на основе размеров элемента с учётом отступов.

// # Сервисы
// Полезные функции.
// * [multifilter](/docs/multifilter.html) — стандартный фильтр, удобен для проверки массива объектов на соответствие набору свойств;
// * [numberDeclension](/docs/numberDeclension.html) — склоняет числа;
// * [removePrototype](/docs/removePrototype.html) — превращает специфичный объект (например, результат `getBBox()`) в обычный;
// * [roundTo](/docs/roundTo.html) — округляет числа до заданной точности;
// * [toGrayscale](/docs/toGrayscale.html) — приводит цвет к серому оттенку.

// # Фильтры
// Доступные в любом `angular`-шаблоне функции.
// * [preventNaN](/docs/preventNaN.html) — заменяет `NaN` на `undefined`;
// * [trust](/docs/trust.html) — фильтр для прохода ангуляровской [проверки](https://docs.angularjs.org/api/ng/service/$sce) небезопасного контента;
// * [services](/docs/services.html) — «превращает» сервисы в фильтры.

// Также используйте навигацию в правом-верхнем углу экрана.
dataLab.factory('applyTransition', function (callMethods) {
    return function applyTransition(d3element, transition) {
        if (!transition) return d3element;

        d3element = d3element.transition();
        callMethods(transition, d3element);
        return d3element;
    };
});
dataLab.value('callMethods', function callMethods(config, target) {
    Object.keys(config).forEach(function (key) {
        if (target[key]) target[key](config[key]);
    });
});
// Возвращает последний элемент массива.
dataLab.value('last', function last(array) {
    return array[array.length - 1];
});
// Стандартный фильтр, удобен для проверки массива объектов на соответствие набору свойств.
dataLab.value('multifilter', function (items, filters) {
    if (!items || !filters) return;
    var keys = Object.keys(filters);
    return items.filter(function (item) {
        return keys.every(function (key) {
            var filter = filters[key];
            if (filter === null) return true;
            return filter == item[key];
        });
    });
});
// Сервис для склонения чисел.
// Принимает два аргумента — число и набор склонений.
dataLab.value('numberDeclension', function (number, titles) {
    if (!angular.isDefined(number) || !titles) return 'no declension';
    // Набор склонений может быть строкой, разделённой запятыми или массивом.
    if (angular.isString(titles)) titles = titles.split(',');
    // Для русскоязычного склонения нужно три формы.
    // Рассмотрим на примере `["бегун", "бегуна", "бегунов"]`.
    if (titles.length == 3) {
        // 0 бегунов, 1 бегун, 2-3-4 бегуна, 5 бегунов.
        var cases = [2, 0, 1, 1, 1, 2];
        // Берём остаток от деления на сотню.
        number %= 100;
        // По умолчанию предполагаем третью форму, встречается чаще всего, если остаток меньше 5 или больше 19.
        var title = 2;
        // В остальных случаях подбираем форму.
        if (number < 5 || number > 19) {
            // Берём остаток от деления на десять.
            number %= 10;
            // 6-7-8-9 считаем как 5
            if (number > 5) number = 5;
            // и берём нужный вариант из `cases`.
            title = cases[number];
        }
        return titles[title];
    }
    // Для англоязычного формы две, единственная и множественная.
    if (titles.length == 2) {
        return titles[number == 1 ? 0 : 1];
    }
    // Остальные случаи обработать не пытаемся.
    return 'no declension';
});

// Сервис, превращающий специфичный объект (например, результат `getBBox()`) в обычный.
// Возвращает объект без прототипа, со всеми свойствами переданного объекта.
dataLab.value('removePrototype', function removePrototype(object) {
    var result = {};
    for (var key in object) {
        result[key] = object[key];
    }
    return result;
});
// Округление чисел до заданной точности.
// Функция `roundTo` принимает число в качестве аргумента, значения точности и возвращает округляющую функцию.
dataLab.value('roundTo', function roundTo(precision) {
    var log2 = Math.log2(precision);
    // Если точность меньше единицы и не является степенью двойки…
    if (log2 < 0 && Math.floor(log2) != Math.ceil(log2)) {
        var fixed = precision.toString().length - 2;
        // …вернём специальную функцию, обрезающую число.
        // Это несколько медленнее, но избавляет от ошибок, вида roundTo(0.05)(1.65) → 1.6500000000000001
        return function (value) {
            value = precision * Math.round(value / precision);
            return parseFloat(value.toFixed(fixed));
        }
    }
    // В остальных случаях вернём простую округляющую функцию.
    return function (value) {
        return precision * Math.round(value / precision);
    }
});
// Приведение `d3`-совместимого цвета к соответствующему серому оттенку.
dataLab.value('toGrayscale', function (color) {
    var hcl = d3.hcl(color);
    hcl.c = 0;
    return hcl.toString()
});

angular.module('dataLab').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('backedText/backedText.html',
    "<g class=\"backed-text\">\n" +
    "    <rect></rect>\n" +
    "    <g ng-transclude></g>\n" +
    "</g>"
  );


  $templateCache.put('bottomLine/bottomLine.html',
    "<g class=\"bottom-line\">\n" +
    "    <line data-ng-attr-stroke=\"{{stroke}}\"></line>\n" +
    "    <g ng-transclude></g>\n" +
    "</g>"
  );


  $templateCache.put('dropdownFilter/dropdownFilter.html',
    "<div\n" +
    "        class=\"dropdown-filter\"\n" +
    "        data-ng-class=\"{ 'dropdown-filter--open': state == 'open' }\">\n" +
    "    <span\n" +
    "            class=\"dropdown-filter__current-value\"\n" +
    "            tabindex=\"0\"\n" +
    "            data-ng-bind-html=\"currentValue|trust\"\n" +
    "            data-ng-click=\"toggleList()\"\n" +
    "            data-ng-blur=\"closeList()\"></span>\n" +
    "    <ul class=\"dropdown-filter__list\">\n" +
    "        <li\n" +
    "                data-ng-if=\"config.allValues\"\n" +
    "                data-ng-mousedown=\"select(null)\"\n" +
    "                data-ng-bind-html=\"config.allValues|trust\"\n" +
    "                data-ng-class=\"{'dropdown-filter__item--active': currentId == null }\"\n" +
    "                class=\"dropdown-filter__item\"></li>\n" +
    "        <li\n" +
    "                data-ng-repeat=\"(id, text) in values\"\n" +
    "                data-ng-mousedown=\"select(id)\"\n" +
    "                data-ng-bind-html=\"text|trust\"\n" +
    "                data-ng-class=\"{'dropdown-filter__item--active': currentId == id }\"\n" +
    "                class=\"dropdown-filter__item\"></li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );

}]);
