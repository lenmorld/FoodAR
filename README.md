
### Demo


[https://streamable.com/ub0k7] Food AR on apple



### Abstract

This study aims to determine the feasibility of a mobile Food Augmented Reality (AR) web
application (webapp). The app’s objective is to increase awareness of users on the foods they
eat, by utilizing AR to digitally present nutritional information. The app allows user to capture food
items through mobile device camera, then augments the food item with digital information.

##### Preview
![alt text](https://raw.githubusercontent.com/lenmorld/FoodAR/master/UX_design.PNG)

The implementation of the app prototype can be divided into three main modules, with their
respective frameworks and libraries for rapid prototyping. Food module handles food object
recognition and generating keywords from images using Clarifai API. Nutrition module obtains
nutritional information on a given food name using Edamam API. Lastly, View module handles
the preparation and augmentation of digital AR content to the physical AR target, using WebAR
and ARCore for Android devices.

##### Design
![alt text](https://raw.githubusercontent.com/lenmorld/FoodAR/master/FoodAR.png)


The app prototype was evaluated by nine participants, in order to assess its feasibility in
accomplishing the objectives. The evaluation consisted of a pre-test questionnaire that
determines users’ background and interest in AR and nutrition, a set of tasks performed by the
users on the app, and a post-test questionnaire that assesses user experience based on the apps’
three feasibility aspects: viability, functionality, and usability.

The quantitative data from user evaluation resulted to above average scores for functionality
(3.62), usability (4.09) and viability (3.78). The app’s overall feasibility, obtained from averaging
the three results, is 3.83. This signifies that the app is acceptably functional, usable, and viable
for the users to increase their awareness in nutrition and make informed food choices. The
qualitative data provided various insights and ideas for improvements. Both quantitative and
qualitative results of the user evaluation will be indispensable in the future development of Food
AR webapp.





### How to run

first check if device is here:

[https://developers.google.com/ar/discover/](ARCore supported devices)


complete instructions on running the app here:
[https://goo.gl/forms/SoISrkKScSndpHLA3](Google Form)

rundown:

1. Download and Install ARCore APK
https://github.com/google-ar/arcore-android-sdk/releases/download/sdk-preview/arcore-preview.apk

2. Download and Install WebArOnArCore browser
https://github.com/google-ar/WebARonARCore/raw/webarcore_57.0.2987.5/apk/WebARonARCore.apk

3. Open WebArOnArCore app on your phone. 
WebArOnArCore browser opens and loads a generic starting page.
Replace the URL address at the top with this URL:
  https://goo.gl/pkqroC

Go/enter URL.  
You should be redirected to the webapp. 



deployed in a Heroku Dyno at
https://tranquil-ravine-83977.herokuapp.com/


### dev mode

to run locally

```
node server.js
```
