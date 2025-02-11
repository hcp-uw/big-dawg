// Public interface and types for DB

export interface DB {
    // save a logged workout for a specific date 
    // save also updates it if it exists
    // return true if a workout for that date was replaced
    saveWorkout: (w: Workout) => boolean;
    // get a workout for a specific date → workout history
    getWorkout: (date: String) => Workout;
    // delete logged workout for a specific date
    deleteWorkout: (date: String) => boolean;
    // get an exercise for the workout
    getExerciseList: () => Exercise_List;
    //
    getExerciseHistory: (ex_name : string) => Exercise_Hist;
    // for adding custom exercises
    AddExercise: () => boolean;
    // delete custom exercise (if user made mistake)
    deleteExercise: (ex_name: string) => boolean;
    // calendar view
    getCalendarView: (month) => Muscle_Group[][];
}

export type Muscle_Group = "Chest" | "Back" | "Legs" | "Triceps" | "Biceps" | "Shoulders";

// export type Exercise_Type = "Weight" | "Cardio";  //Not in MVP but may be useful in future 

export type Exercise = {
    Exercise_Name : string;
    Muscle_Group : Muscle_Group; 
    Comment : string;
    // Exercise_Type” : string 	//Not in MVP but may be useful in future 
};

export type Exercise_List = {
    Chest: Exercise[];
    Back: Exercise[];
    Legs: Exercise[];
    Triceps: Exercise[];
    Biceps: Exercise[];
    Shoulders: Exercise[];
};

export type Set = {
    Exercise_Name : string;
    Weight : bigint;
    Reps : bigint;
    Comment : string
};

export type Exercise_Hist = {
    Exercise_Name: string;
    Hist: Set[];
};

export type Workout = {
    Date: String;
    TimeStarted : bigint;
    TimeEnded : bigint;
    Sets : Set[];
    WorkoutComment : string
};
