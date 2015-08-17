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
