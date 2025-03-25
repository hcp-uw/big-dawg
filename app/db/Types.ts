// Public interface and types for DB
export interface DB {

    /*
    *   save a logged workout for a specific Date 
    *   if a workout for that date already exists that workout is replaced
    *   Params:
    *       -- w: the workout to save
    *   Throws: InvalidExerciseException if one of the sets is for an exercise that doesn't exist
    *           in this case saves all sets of this workout to history except the ones for the invalid sets
    *           returns exception of format InvalidExerciseException("InvalidEx1 InvalidEx2 InvalidEX3")
    *   Returns:
    *       -- true if a workout for that date was replaced, false otherwise
    */
    saveWorkout: (w: Workout) => Promise<boolean>

    /*  
    *   get a workout for a specific Date
    *   Params: 
    *       -- date: date of the workout
    *   Returns: 
    *       -- Workout: the workout if the date has workouts
            -- null: if the date requested has nothing
    */
    getWorkout: (date: Date) => Promise<Workout | null>

    /*
    *   delete a logged workout for a specific Date
    *   doesn't do anything if no workout for that date exists
    *   Params:
    *       -- date: date of workout to delete
    *   Returns: 
    *       -- true if a workout for that date was succesfully deleted, false otherwise
    */
    deleteWorkout: (date: Date) => Promise<boolean>

    /*
    *   gets the list of exercises we have (prebuilt and custom)
    *   Returns: 
    *       -- the list of exercises
    *      -- null if no exercises exist
    */
    getExerciseList: () => Promise<Exercise_List | null>

    /*
    *   gets the entire exercise history for that exercise
    *   Params:
    *       -- ex_name: exercise name
    *   Throws: 
    *       -- InvalidExerciseException: when an exercise with that name doesn't exist 
    *   Returns: 
    *       -- exercise history. If the user has never done the requested exercise the inner Hist will be empty.
    */
    getExerciseHistory: (ex_name: string) => Promise<Exercise_Hist>

    /* 
    *   saves a new user-made custom exercise 
    *   Params: 
    *       -- ex: the exercise to add. Will replace the exercise with the same name 
    *   Returns: 
    *       -- true if the exercise was added, false if not 
    */
    saveExercise: (ex: Exercise) => Promise<boolean>

    /* 
    *   deletes a user-made custom exercise 
    *   Params: 
    *       -- ex_name: the name of the exercise to delete 
    *   Throws: 
    *       -- InvalidExerciseException: if the given exercise name does not exist
    *   Returns: 
    *       -- true if the exercise was deleted, false if not
    */
    //deleteExercise: (ex_name: string) => boolean

    /* 
    *   gets the muscle group information for the workout calendar
    *   Params: 
    *       -- month: from 1-12 indicating the month from which to get muscle group data
    *       -- year: the year
    *   Throws:
    *       -- InvalidDateException: if the given month, year is not valid or not found
    *   Returns: 
    *       -- an array of length 30, 31, or 28 (number of days in that month)
    *            that holds an array of muscle groups trained in that day
    */
    getCalendarView: (month: bigint, year: bigint) => Promise<Muscle_Group[][]>
}

//export type Muscle_Group = "Chest" | "Back" | "Legs" | "Triceps" | "Biceps" | "Shoulders"
export type Muscle_Group = keyof Exercise_List;

// export type Exercise_Type = "Weight" | "Cardio"  //Not in MVP but may be useful in future 

export type Exercise = {
    // name is unique per exercise
    Exercise_Name: string
    Muscle_Group: Muscle_Group
    Comment: string | null
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
    Exercise_Name: string
    Weight: number
    Reps: number
    Comment: string | null
}

export type Exercise_Hist = {
    Exercise_Name: string
    Hist: ([Set, Date])[]
    /* let my_tuple: [Set, Date] = Hist[0]
     my_tuple[0] : Set
     my_tuple[1] : Date*/
}

export type Workout = {
    Date: Date // starting date
    TimeStarted: number
    TimeEnded: number
    Sets: Set[]
    WorkoutComment: string | null
}

// exceptions

// Exception class that creates InvalidExerciseException
export class InvalidExerciseException extends Error {
    constructor(exerciseName: string) {
        super(`Invalid exercise: ${exerciseName}`)
        this.name = "InvalidExerciseException"
    }
}

// Exception class that creates InvalidDateException
export class InvalidDateException extends Error {
    constructor(month: bigint, year: bigint) {
        super(`Invalid date: ${year}, ${month}`)
        this.name = "InvalidDateException"
    }
}
