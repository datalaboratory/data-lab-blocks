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