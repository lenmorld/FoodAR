not very good on not very popular food
(probably ethnic, etc)

empanada
https://assets.marthastewart.com/styles/wmax-1500/d17/empanadas-a100668/empanadas-a100668_horiz.jpg?itok=dchZhyzQ

not detected by
Clarifai


future work

[ ] auto focus of ARCore camera
"Currently ARCore uses a fixed focus to ensure stable camera intrinsics.
We may introduce autofocus or focus control in the future."

https://github.com/google-ar/arcore-android-sdk/issues/200


[ ] in generic Food Servings like soup, sandwich (millions of kinds)
  that is successfully identified by Clarifai, but not specific enough to be searched for nutrition

  -> edamam fails to get nutrition on general Food Servings like this

  temporary solution: since Clarifai gets the ingredients of the Food Serving, from the most dominant to least
    e.g. for a chicken soup that has quite some chicken on it
    Clarifai produces [soup, chicken, parsely, etc]

    each keyword is then used to fetch info in Edamam
    and if it fails, then the next one is searched

  -> failing keywords are also recorded to avoid mistakes in subsequent searches
    (although does not persist between sessions since no DB for now)

sample: 'soup'

edamam_food_search
https://api.edamam.com/api/food-database/parser?ingr=soup&app_id=2abaf7e9&app_key=46bc3f1de63bac5841f9a1c211cdec59&page=0
-> parsed = [], one of the hints: http://www.edamam.com/ontologies/edamam.owl#Food_USDABR_45001901

eadmam_nutrients_fetch
curl -d '{"yield": 1, "ingredients": [{"quantity": 1,
"measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_unit",
"foodURI": "http://www.edamam.com/ontologies/edamam.owl#Food_USDABR_45001901"}]}'
-H "Content-Type: application/json"
"https://api.edamam.com/api/food-database/nutrients?app_id=2abaf7e9&app_key=46bc3f1de63bac5841f9a1c211cdec59"

[ ] Clarifai also does not have a standard grouping keyword
    making it impossible to accurately recognize

[ ] slow performance is mostly due to the 3d text rendering
   three.js does not provide a "Text Group" object
   thus, must render each 3d text object independently

   also because each character is a special 3d object by itself
   and not like a cube that can be cloned easily

   see spawn-at-camera.html that is very fast because of 3d object cloning

