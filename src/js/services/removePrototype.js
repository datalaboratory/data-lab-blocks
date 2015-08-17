dataLab.value('removePrototype', function removePrototype(object) {
    var result = {};
    for (var key in object) {
        result[key] = object[key];
    }
    return result;
});