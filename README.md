middleware that will check if the keyword obtained from Clarifai
is a proper food item, searchable in Edamam


Single food

General model
- can determine if it's a fruit (not always first result)

but food model

- cannot know Fruit
- 'banana' or 'apple' always first


fruit salad
General -> fruit, health
food model -> strawberry, berry, sweet, fruit salad

pasta
food -> pasta as 3rd, sauce, spaghetti


===

EDAMAM api

-> have to develop server-side that would query API
since they don't allow CORS requests

CURL testing

curl -d '{"yield": 1, "ingredients": [{"quantity": 1, "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_unit", "foodURI": "http://www.edamam.com/ontologies/edamam.owl#Food_09003"}]}' -H "Content-Type: application/json" "https://api.edamam.com/api/food-database/nutrients?app_id=2abaf7e9&app_key=46bc3f1de63bac5841f9a1c211cdec59"


====
Heroku

[heroku login]
[heroku create]

$ heroku local web    // Start your app locally
$ git push heroku master    // deploy

$ heroku logs --tail
$ heroku restart



====
before:

USDA API
https://ndb.nal.usda.gov/ndb/doc/apilist/API-SEARCH.md

- limitations of returning 'peanut butter' when searching 'butter'

sample: https://api.nal.usda.gov/ndb/search/?format=json&q=butter&sort=n&max=25&
offset=0&api_key=DEMO_KEY&ds=Standard+Reference


nutrients fetch:
https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=DEMO_KEY&
nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno=45258948


====

food serving search is very iffy
-> 'fruit salad' image: https://www.clarifai.com/models/food-image-recognition-model-bd367be194cf45149e75f01d59f77ba7

# Clarifai
returns (in order of accuracy)
- strawberry, berry, sweet, fruit salad

we have a list of 'food servings' - fruit salad is one of them
to try to avoid searching one by one the ingredients and
searching as a whole

# Edamam
no totalDaily, no totalNutrients

FIX: fallback to the first ingredient (strawberry)
and search it in Edamam

