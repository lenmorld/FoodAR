// moved to ViewModule
// var FOOD_ITEM_VIEW = document.getElementById('food_item');
// var NUTR_INFO_VIEW = document.getElementById('nut_info');

var LOGS_VIEW = document.getElementById('logs');
var DEBUG_VIEW = document.getElementById('debug');

var DEV_MODE = false;        // if true, display stuff in Browser DOM instead of AR

var PROD_RELEASE_MODE = true;

// var IMAGE_CAPTURED = $("#img_captured");
// var IMAGE_CAPTURED_THUMB = $("#img_captured_thumb");

var KEYWORD_LIMIT = 5;
var PREV_IMAGE_THUMBNAIL = null;

var CORE_NUTRIENTS_FOR_DISPLAY = ['CHOCDF', 'ENERC_KCAL', 'FAT', 'FIBTG', 'PROCNT', 'SUGAR', 'NA'];
var OTHER_CORE_NUTRIENTS_FOR_DISPLAY = ['CHOLE', 'CA', 'FE', 'FATRN', 'FASAT', 'VITA_RAE', 'VITC'];
var ALL_ELSE = ['K', 'FAMS', 'MG', 'NIA', 'P', 'RIBF', 'THIA', 'TOCPHA', 'VITB12', 'VITB6A', 'VITD', 'VITK1', 'ZN'];

var DESIRED_NUTRIENTS_LENGTH = 7;       // depends on how much 3D text can be rendered

// most food servings cannot be processed by Edamam
var FOOD_SERVINGS_LIST = ['soup','fruit salad', 'pasta', 'burger', 'hamburger', 'sandwich'];

var MEALS_KEYWORD_LIST = ['meal', 'lunch', 'dinner'];

var RECIPES_KEYWORD_LIST = ['cooking', 'preparation'];      // to use for General model