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




