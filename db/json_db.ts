import {DB, Workout, Exercise_List, Exercise_Hist, Muscle_Group} from './Types'
// implements interface for json
export class json_db implements DB {
    // add local vars for cache
    saveWorkout = (w: Workout) => {
       
    }
    getWorkout = (date: String) => {
        
    }
    deleteWorkout = (date: String) => {

    }
    getExerciseList = () => {

    };
    getExerciseHistory = (ex_name: string) => {

    }
    AddExercise = () => {

    }
    deleteExercise = (ex_name: string) => {

    }
    getCalendarView = (month) => {

    }
}