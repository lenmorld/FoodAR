var Utils = function () {
    function round(decimal) {
        return Math.round(decimal * 100) / 100;
    }

    return {
        round: round
    }
}();

