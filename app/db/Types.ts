// Public interface and types for DB

/*
*   Note: If ui/front end is immplemented corectly, InvalidExerciseException shouldn't happen
*         however in nightmare scenario that the disk is corrupted/files are deleted, if it
*         happens, turn exception into an error message for user to re-add the exercises. 
*         Ex: If caught Invalid exercise: Bench Squat Deadlift, should pop up message to user in
*         app saying "There seems to be an error with your storage and some data was lost.
*                     Please create new exercises for: Bench, Squat, and Deadlift"
* */
export interface DB {

    /*
    *   Initializes database with our exercise presets
    *   should be done only once at first startup of app
    */
    Init: () => void

    /*
    *   save a logged workout for a specific Date
    *   if a workout for that date already exists that workout is replaced
    *   Params:
    *       -- w: the workout to save
    *   Throws: InvalidExerciseException if one of the sets is for an exercise that doesn't exist
    *           in this case saves all sets of this workout to history except the ones for the invalid sets
    *           returns exception in the format:
    *           InvalidExerciseException("InvalidEx1 InvalidEx2 InvalidEX3")
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
    *   gets the list of exercises we have
    *   Returns:
    *       -- the list of exercises
    */
    getExerciseList: () => Promise<Exercise_List>

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
    *       -- true if the exercise was added, false if it alredy existed
    */
    saveExercise: (ex: Exercise) => Promise<boolean>

    /*
    *   gets the muscle group information for the workout calendar
    *   Params:
    *       -- date: a Date object, will return the calendar view for the month that
    *                date is in. Ignores day of month
    *   Returns:
    *       -- an array of length 31 which holds an array of muscle groups trained each day
    *       -- 1d empty array [] if the given month, year has no logged workouts for that month
    */
    getCalendarView: (date: Date) => Promise<Muscle_Group[][]>

    /*
    *   gets the workout preset with the given name, returns null if it doesn't exist
    *   Params:
    *      -- name of the workout preset
    *   Returns:
    *     WorkoutPreset if it exists, null otherwise
    */
    getWorkoutPreset: (name: string) => Promise<WorkoutPreset | null>

    /*
    *   gets the list of workoutPresets we have as an array
    *   Returns:
    *       -- the array of workoutPresets
    */
    getWorkoutPresetList: () => Promise<WorkoutPreset[]>

    /*
    *   saves the workout preset, if a workout with that name exists replaces it
    *   Params:
    *     -- name of the workout preset
    *     -- workout preset
    *   Throws: InvalidExerciseException if one of the sets in the wp has an exercise that doesn't exist
    *           in the exercise list
    *   Returns:
    *     -- true if a preset with that name was replaced
    *     -- false otherwise
    */
    saveWorkoutPreset: (wp: WorkoutPreset) => Promise<boolean>

    /*
    *   Delete the workout preset with the given name
    *   doesn't do anything if no preset with that exists
    *   Params:
    *       -- date: date of workout to delete
    *   Returns:
    *       -- true if a workout preset was succesfully deleted, false otherwise
    */
    deleteWorkoutPreset: (name: string) => Promise<boolean>
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

export type WorkoutPreset = {
    Name: string
    Comment: string | null
    Preset: Set[]
}

// exceptions

// Exception class that creates InvalidExerciseException
export class InvalidExerciseException extends Error {
    constructor(exerciseName: string) {
        super(`Invalid exercise: ${exerciseName}`)
        this.name = "InvalidExerciseException"
    }
}
