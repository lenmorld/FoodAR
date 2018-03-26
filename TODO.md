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
