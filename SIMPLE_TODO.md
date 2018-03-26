to make it simple, focus on the strongest feature of the system
and just offer secondary alternatives when 'evidence' is strong
in order of reliability


always show top #1 food item / ingredient
    and pick one of these conditions:  FOOD_SERVING_LIST and RECIPE_KEYWORD_LIST and MEAL_KEYWORD list

    if found in FOOD_SERVING_LIST (GENERAL model) search that first, then fallback to top #1 food item/ingredient
        (FOOD_SERVING_LIST is reliable since it's hand-picked, MUST ADD LOTS TO LIST, but only the ones searchable in Edamam)

    else if RECIPE_KEYWORD (FOOD model) -> offer a recipe search, by getting Top 5 (or 10) ingredients in FOOD model

    [hardest]
    else, if MEAL_KEYWORD found -> offer an ANALYZE MULTIPLE option
        this will sum up all the FOOD_SERVINGS and/or Top 5 (or 10) items in FOOD model



these 3 must be processed in order, that is, if FOOD_SERVING is found, don't look for RECIPE
and if RECIPE found, don't look for MEAL



        /*
            3 cases for now

            1. if recipe keyword found in GENERAL model, get all ingredients from FOOD model
                display nut.info of #1 ingredient, and offer to
                    a) display recipe
                    b) sum up all ingredients (decide on how many), then display total nut.info (may have to manually calc daily)
            2. if food serving keyword found in either of the models, search that food serving
                fallback to #1 ingredient if nut. fetch failed for food serving
            3. if not either of the 2,
                either get nutrients info of top item, or do 1b) [based on what?]

                TODO: must decide algorithm on deciding if multiple, based on keywords or accuracy
         */


         case 3


            // TODO: sum up top 5 nutrient info if decided multiple -> find condition to decide if multiple
            // else assume individual
            // TODO: must have a way to determine multiple food items in photo (to get each one)
            // or just one item that resulted to different concepts (to get only one)