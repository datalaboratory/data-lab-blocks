dataLab.value('callMethods', function callMethods(config, target) {
    Object.keys(config).forEach(function (key) {
        if (target[key]) target[key](config[key]);
    });
});