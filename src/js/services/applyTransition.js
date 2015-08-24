// Применяет описанный `transition` к `d3`-выборке, возвращая новую выборку.
dataLab.factory('applyTransition', function (callMethods) {
    return function applyTransition(d3element, transition) {
        if (!transition) return d3element;

        d3element = d3element.transition();
        callMethods(d3element, transition);
        return d3element;
    };
});