dataLab.value('numberDeclension', function (number, titles) {
    if (!angular.isDefined(number) || !titles) return 'no declension';
    if (angular.isString(titles)) titles = titles.split(',');
    if (titles.length == 3) {
        var cases = [2, 0, 1, 1, 1, 2];
        var n1 = (number % 100 > 4 && number % 100 < 20);
        var n2 = cases[(number % 10 < 5) ? number % 10 : 5];
        var title = (n1 ? 2 : n2);
        return titles[title];
    }
    if (titles.length == 2) {
        return number == 1 ? titles[0] : titles[1]
    }
    return 'no declension';
});
