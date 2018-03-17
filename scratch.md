NON-AR apps

FoodSwitch - scan barcode
	    color code for high, medium, and low values of total fat, saturated fat, sugar and salt
		database of food products

Show me the sugar - scan barcode
		database of food products
		track daily intake
		only for US

EZ Sugar tracker -

========================
AR apps

Apple AR - AR that shows nutritional content of food
	  not based on label

AR for food nutritional value

ROAR - more for marketing, price and ordering
	provides some nutritional info but not all


Augmented-Sugar intake
 - AR, scanning the food label
 - integrate Mexican database of UPSB
 - displays how many teaspoons of sugar
 - user provides his personal height, system calculates "Ideal Weight" suggested by WHO
  x limited food in the database

 1. trigger AR by pointing to product logos,
	get USPB info, data interpretation of labeled products, advice of consume

2. display how many sugar spoons can be ingested (well known by Mexicans)
3. highest, ideal spoons recommend for user's hgieht
4. can navigate through several similar products


Nutritional Info Vis using Mobile AR

- regulate diet plan, improve health of users
- visualize nutritional information
- vision-based AR tracking
- nutriotional info calories (carbs, protein, fat)


1. scan image
2. display object in 3d (e.g. 3d virtual apple)
	- contains some info about the image
3. visualize info using visualized graph using a gauge meter
	so user can understand info visually

details:
scan initial object
track scanned image -> determine object id contained in scanned image
- every image scanned has specific id and info
after tracking object ID, 3d objects are displayed


X image detection requires more work, have to reposition camera
X generating 3d objects is pretty useless
X when the AR info is ready it completely covers the screen ???
	object is not visible anymore
(less AR experience)


AR tracking
1. sensor-based
2. vision-based
3. hybrid


==============================
scope and limitations:
- no database of food, only get nutritional info (dynamic or hard-coded) from WHO, other health sites

1. scan image of food
2. provide info: general
3. vision based
4. put the info directly in the real image (no need for 3d object of image)
5. true AR, not covering the entire screen

2 main papers
a few apps online (some available in google play store), but are not well documented

