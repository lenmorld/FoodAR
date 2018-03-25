var Utils = function () {
    function round(decimal) {
        return Math.round(decimal * 100) / 100;
    }

    function getCommon(arr1, arr2, attr) {
        return arr1.filter(function(e) {return (arr2.filter(function(f) {return f[attr] === e[attr] }) ).length > 0 });
    }


    function getFoodServings(arr) {
        return arr.filter(function(e) {return FOOD_SERVINGS_LIST.includes(e.name) });
    }


    return {
        round: round,
        getCommon: getCommon,
        getFoodServings: getFoodServings
    }
}();

