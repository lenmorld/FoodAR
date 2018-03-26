var Utils = function () {
    function round(decimal) {
        return Math.round(decimal * 100) / 100;
    }

    function getCommon(arr1, arr2, attr) {
        return arr1.filter(function(e) {return (arr2.filter(function(f) {return f[attr] === e[attr] }) ).length > 0 });
    }


    /*
        given array of food item objects list and list of keywords to look for
        return the keywords found on the objects list
     */
    function getCategoryKeywords(arr, keywordList) {
        return arr.filter(function(e) {return keywordList.includes(e.name) });
    }

    function smartLog(msg) {
        if(DEV_MODE) {
            console.log(msg.join(" "));
        } else {
            LOGS_VIEW.innerHTML = msg.join(" ");
        }
    }


    return {
        round: round,
        getCommon: getCommon,
        getCategoryKeywords: getCategoryKeywords,
        smartLog: smartLog
    }
}();

