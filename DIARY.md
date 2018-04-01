DESIGN DECISIONS, etc

[-] removed image-capture module
- captures last base64 image captured, keeps it in mem, and
displays in top right corner after successful "turnaround"

[+] added AR content -> FoofItemName and NutritionalInfo

[+] upgraded Heroku dyno to Hobby $7 / month,
improved performance, always on and reserved resources compared to free (pool of free resources)

[-] disable HTML FoodItemName and NutritionInfo

[+] must clear "view buffer" before activating it again

[ ] !!! test/ make the 3Dtext stay with food at all costs! even when camera moves away --> VERY BUGGY! works sometimes

[ ] improve performance of 3Dtext geometry loading

[ ] made CORE NUTRIENTS 7 instead of 5, to add SUGAR and SODIUM

[-] disabled the check for matching NUTRIENTS_FOR_DISPLAY (limited to 5/7), to let calling function decide
    on nect


[+] have 10 instead of 5 available global NUTRIENTS_FOR_DISPLAY, but always display 5 most important if available(possilby with rank of priority)
    so there would be a backup nutrient when some are not available
    -> always show at least 5 nutrients

[ ] fix 0 errors on line 012:103 on food-helper-module.js

[ ] add attribution Clarifai and Edamam
https://developer.edamam.com/attribution

[ ] BONUS: red font if bad, green font if good, i.e. if more than 15% DV is apparently a lot
https://www.canada.ca/en/health-canada/services/understanding-food-labels/percent-daily-value.html

[ ] BONUS: include dietLabels

[ ] try in different light conditions

[ ]


DOCU

-> can include brief three.js X,Y,Z axis
even just the pic

--> three.js 3d text geometry

-> simple mock (like the one drawn in paper)

-> flow (like the one in proposal)
    but now more of an async nature, using JS callbacks

    ANALYZE BUTTON press -> clear all AR content -> analyzeobject -> Clarifai -> processKeywords -> fetchNutritionalInfo -> display


-> rendered 3dtext gets in the way of the capture, so
    still have to use HTML layer



USER holding cam
---
HTML LAYER      - used for quick instructions and feedback, debugging
---
AR LAYER        - used solely for displaying AR content (since this is very expensive)
                    due to all the WebGL (via three.js) graphics stuff
---
CAMERA / FRAME   - this is the current "live reality" frame where AR is embedded
---
FOOD ITEM


/ no need for markers
X tracking is not as good (however, ARCore has lots of options to explore, less capable in we presently)


-> LECTURES : scan for possibly relevant topic to relate here
e.g. Fitt's law may not apply, but [AR framework] on 1st week would definitely be the backbone
    of discussion
