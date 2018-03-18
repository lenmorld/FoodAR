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

