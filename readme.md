PROJECT NAME AND SUMMARY
-------------------------
Workout Routine Database
    Describe the context and goals of your project
    In this project are APIs of workout routines, a list of routine that are categorized depending on the routines you are looking. Could depend on your target workout, level of intensity, duration, equipment used as well as the arrays of exercises, the number of sets and repetitions the user is requiring. The goal of this database is to connect the coaches, and gym rats to collaborate to doing routines taht are effective, safe and custom based on the user's focus and fitness goal. 

FEATURES
----------



SAMPLE MONGO DOCUMENTS
------------------------
    1. routines
    2. user

API DOCUMENTATION
-------------------
Title : A short phrase describing what the API does
Method : Whether it is GET, POST, PATCH, PUT or DELETE
Endpoint Path : The endpoint URL with URL with the possible parameters in <>
Body : Expected JSON object for the body for POST, PATCH and PUT requests
Parameters : Description of the parameters in the body and the URL
Expected Response : Expected JSON object for the response

Title : Create a new routine
Method : Post
Endpoint Patch : /routines
Body : 
    {       
            "_id" : "12345"
            "mainGoal" : "Lose Fat",
            "workoutType": "Abdomen",
            "intensity": "Beginner, Intermmediate, Advanced"
            "equipmentNeeded": "cables, dumbbell, bodyweight, barbel"
            "durationInMinutes": 40,
            "exercises": 
                {
                    name : "push up"
                    set: 4
                    repetitions: 12
                }
    }

Parameters : 
    Main goal (string) : target body part to workout
    Workout type (string): focus
    intensity (string) : level of difficulty
    equipment Needed (string) : requirement for the workout
    duration In Minutes (int) : time to finish the routine
    exercises (array of string) : array of exercises and number of sets and repetitions

Expected Response : 

