var FOOD_ITEM_VIEW = document.getElementById('food_item');
var NUTR_INFO_VIEW = document.getElementById('nut_info');
var LOGS_VIEW = document.getElementById('logs');
var DEBUG_VIEW = document.getElementById('debug');


var ANALYZE_BUTTON = $("#btn-analyze");
var IMAGE_CAPTURED = $("#img_captured");
var IMAGE_CAPTURED_THUMB = $("#img_captured_thumb");

var KEYWORD_LIMIT = 5;
var PREV_IMAGE_THUMBNAIL = null;

var NUTRIENTS_FOR_DISPLAY = ['CHOCDF', 'ENERC_KCAL', 'FAT', 'FIBTG', 'PROCNT'];
var FOOD_SERVINGS_LIST = ['fruit salad', 'pasta'];