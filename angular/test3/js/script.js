var app = angular.module('website', ['ngMaterial', 'ngMdIcons']);

app.controller('AppCtrl', ['$scope', function($scope) {

    $scope.menu = [
        {
            link: '',
            title: 'Dashboard',
            icon: 'dashboard'
        }
    ]

    $scope.isOpen = function() { return false };

    $scope.leftOpen = function () { return "$mdMedia('gt-lg')"; };
    $scope.leftButtonOpen = function () {
        if(!$scope.leftOpen())
            $scope.leftOpen = function () { return "$mdMedia('gt-lg')"; };
        else
            $scope.leftOpen = function () { return false; }
    }
}]);

app.config(function($mdThemingProvider) {
    var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});

