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
            if (!PROD_RELEASE_MODE)
                LOGS_VIEW.innerHTML = msg.join(" ");
        }
    }


    function debug(msg) {
        if (!PROD_RELEASE_MODE)
            DEBUG_VIEW.innerHTML = msg;
    }

    function errorHandler(code) {

        /*
               Clarifai Error on image recognition: Error 2000
               Clarifai Error on image recognition: Error 2001

               Edamam error on searching food to get food uri  Error 4000
               Edamam error on getting nutrition info of food uri Error 4001
         */
    }



    return {
        round: round,
        getCommon: getCommon,
        getCategoryKeywords: getCategoryKeywords,
        smartLog: smartLog,
        errorHandler: errorHandler,
        debug: debug
    }
}();

