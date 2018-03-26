IDEA 1:

if successful capture,
put image of last captured image (possible since we have base64 copy of image)

and put in top right corner

still allowing for next search

-> DONE!


IDEA 2:

modify WebAROnARCore browser to
- default to a URL given in the code (can do this in JS instead of native app)

- change icon to give it a more personal feel


IDEA 3:

next big feature

-> capturing "food_serving"
    can be auto. captured by Clarifai and analyzed by Edamam

    must get as much food_serving to sniff as possible, since its not always the #1 in the keyword results

option:

if single food item or "food serving"
determine nutrition

or if multiple food items
-> suggest recipe


IDEA 4:

-> capturing multiple food items
-> searching recipes of multiple food items

one way to do it:
check General results for RECIPES_KEYWORD_LIST
such as 'preparation', 'cooking'

if obtained, then
get all (how many?) from Food results


OR

scenario:
if detect multiple (using keywords from General)
-> fetch and display nutrient info of #1 ingredient
-> offer recipe suggestion if possible


OR (least confusing)
have 3 options, or a combination of these
try to have a smart decision based on results

[ANALYZE SINGLE]
[ANALYZE MULTIPLE]  - sum the food items and get aggregate nut. info
[SEARCH RECIPE]


suggested flow:
must decide on use case

- user can scan one item
- user can scan multiple food items or fridge
    -> offer recipe or analyze multiple

user captures
-> if recipe found (i.e. RECIPE_KEYWORDS found in General)
    get top 5 from Food model, get aggregate nut. info
    -> offer option to [SEARCH RECIPE] and [ANALYZE SINGLE]

-> if food serving found (i.e. FOOD_SERVING_KEYWORDS found in either model) -> search food serving
    if food serving failed
        -> fallback to top #1 item
        -> offer option to [ANALYZE MULTIPLE]

-> neither of the two
    most likely single or multiple

    -> search top #1 item
    -> offer to [ANALYZE MULTIPLE]


since Analyze single is the most reliable, focus on that
Analyze Multiple will be based on un-stable keywords like 'meal', 'lunch', 'dinner'

This might help
https://en.wikipedia.org/wiki/Lists_of_foods


OTHERS:

-> limit API requests
-> speed up, very slow!
-> maybe add a 'spinner' to compensate for all the waiting
    esp. on initial load