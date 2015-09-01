dataLab.value('objectToArray', function objectToArray(o) {
    return Object.keys(o).map(function (k) {
        return o[k];
    });
});