// Public interface and types for DB
export interface DB {

    /*
    *   save a logged workout for a specific Date 
    *   if a workout for that date already exists that workout is replaced
    *   Params:
    *       -- w: the workout to save
    *   Returns:
    *       -- true if a workout for that date was replaced, false otherwise
    */
    saveWorkout: (w: Workout) => boolean

    /*  
    *   get a workout for a specific Date
    *   Params: 
    *       -- date: date of the workout
    *   Throws: 
    *       -- InvalidDateException: if the date is an invalid date
    *   Returns: 
    *       -- Workout: the workout if the date has workouts
            -- null: if the date requested has nothing
    */
    getWorkout: (date: Date) => Workout | null
    
    /*
    *   delete a logged workout for a specific Date
    *   doesn't do anything if no workout for that date exists
    *   Params:
    *       -- date: date of workout to delete
    *   Returns: 
    *       -- true if a workout for that date was succesfully deleted, false otherwise
    */
    deleteWorkout: (date: Date) => boolean
    
    /*
    *   gets the list of exercises we have (prebuilt and custom)
    *   Returns: 
    *       -- the list of exercises
    *      -- null if no exercises exist
    */
    getExerciseList: () => Exercise_List | null
    
    /*
    *   gets the entire exercise history for that exercise
    *   Params:
    *       -- ex_name: exercise name
    *   Throws: 
    *       -- InvalidExerciseException: when an exercise with that name doesn't exist 
    *   Returns: 
    *       -- exercise history. If the user has never done the requested exercise the inner Hist will be empty.
    */
    getExerciseHistory: (ex_name : string) => Exercise_Hist
    
    /* 
    *   saves a new user-made custom exercise 
    *   Params: 
    *       -- ex: the exercise to add. Will replace the exercise with the same name 
    *   Returns: 
    *       -- true if the exercise was added, false if not 
    */
    saveExercise: (ex: Exercise) => boolean

    /* 
    *   deletes a user-made custom exercise 
    *   Params: 
    *       -- ex_name: the name of the exercise to delete 
    *   Throws: 
    *       -- InvalidExerciseException: if the given exercise name does not exist 
    *   Returns: 
    *       -- true if the exercise was deleted, false if not
    */
    deleteExercise: (ex_name: string) => boolean
    
    /* 
    *   gets the muscle group information for the workout calendar
    *   Params: 
    *       -- month: from 1-12 indicating the month from which to get muscle group data
    *   Throws:
    *       -- InvalidMonthException: if month does not exist
    *   Returns: 
    *       -- an array of length 30, 31, or 28 (nnumber of days in that monthh)
    *            that holds an array of muscle groups trained in that day
    */ 
    getCalendarView: (month: bigint) => Muscle_Group[][]
}

export type Muscle_Group = "Chest" | "Back" | "Legs" | "Triceps" | "Biceps" | "Shoulders"

// export type Exercise_Type = "Weight" | "Cardio"  //Not in MVP but may be useful in future 

export type Exercise = {
    // name is unique per exercise
    Exercise_Name : string
    Muscle_Group : Muscle_Group 
    Comment : string
    // Exercise_Type” : string 	//Not in MVP but may be useful in future 
}

export type Exercise_List = {
    Chest: Exercise[]
    Back: Exercise[]
    Legs: Exercise[]
    Triceps: Exercise[]
    Biceps: Exercise[]
    Shoulders: Exercise[]
}

export type Set = {
    Exercise_Name : string
    Weight : number
    Reps : bigint
    Comment : string
}

export type Exercise_Hist = {
    Exercise_Name : string
    Hist : Set[]
    Date : Date 
}

export type Workout = {
    Date : Date // starting date
    TimeStarted : bigint
    TimeEnded : bigint
    Sets : Set[]
    WorkoutComment : string
}
