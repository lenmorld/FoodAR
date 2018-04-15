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



