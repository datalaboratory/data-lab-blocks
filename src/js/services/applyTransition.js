dataLab.factory('applyTransition', function (callMethods) {
    return function applyTransition(d3element, transition) {
        if (!transition) return d3element;

        d3element = d3element.transition();
        callMethods(transition, d3element);
        return d3element;
    };
});