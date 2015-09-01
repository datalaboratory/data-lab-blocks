dataLab.value('getDatum', function getDatum(d3element) {
    var datum;
    var parent = d3element.node();

    while (!angular.isDefined(datum) && parent) {
        datum = d3.select(parent).datum();
        parent = parent.parentNode;
    }

    return datum;
});