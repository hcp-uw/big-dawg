import {DB, Workout, Exercise_List, Exercise_Hist, Muscle_Group} from './Types'
// implements interface for json
export class json_db implements DB {
    
    saveWorkout = (w: Workout) => {
       
    }

    getWorkout = (date: Date) => {
        
    }

    deleteWorkout = (date: Date) => {

    }

    getExerciseList = () => {

    }

    getExerciseHistory = (ex_name: string) => {

    }

    saveExercise = () => {

    }

    deleteExercise = (ex_name: string) => {

    }

    getCalendarView = (month: bigint) => {

    }
}