// Вызывает на переданном объекте `target` функции, которые указаны в ключах объекта `config`.
// Аргумент функции — значение соответствующего поля в конфигурации.
dataLab.value('callMethods', function callMethods(target, config) {
    Object.keys(config).forEach(function (key) {
        if (target[key]) target[key](config[key]);
    });
});