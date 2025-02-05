interface DB {
    // save a logged workout for a specific date 
    // save also updates it if it exists
    function saveWorkout(): void
    // get a workout for a specific date → workout history
    getWorkout(date, );
    // delete logged workout for a specific date
    deleteWorkout();
    // get an exercise for the workout
    getExerciseList();
    //
    getExerciseHistory(ExerciseName);
    // for adding custom exercises
    AddExercise();
    // delete selected exercise
    deleteExercise();
    // calendar view
    getCalendarView();
}

// implements interface for json
class json_db implements DB {

}

// implements interace for sql
class sql_db implements DB {

}


// types -- typescript representation of json/sql data


// Our JSON 
/*
{
    “Chest”: [Exercises] // array of exercise objects
    “Back” : [Exercises]
    //etc for each muscle group
}


{
    “exerciseName” : string;
    “muscleGroup” : string; 
    “exerciseNote” : string //optional
// “exerciseType” : string 	//Not in MVP but may be useful in future
}


{
    “Date” : String or int; //keep track for later graph
    “TimeStarted : int;
    “TimeEnded” : int;
    “Workout” : [sets] //array of set objects
    “WorkoutComment” : string
}

JSON Schema for Weight Sets:
{
“exerciseName” : string; //keep track for later graph
“Weight” : float; //keep track for later graph
“Reps” : int; //keep track for later graph
“setComment” : string
}

[
    { “workoutPlanName” : workoutSchema; “plannedDays”: [“tuesday”, “wednesday”] };
    { “workoutPlanName” : workoutSchema; “plannedDays”: [“tuesday”, “wednesday”] };
]
    */

    

