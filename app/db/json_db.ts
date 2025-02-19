import {DB, Workout, Exercise_List, Exercise_Hist, Muscle_Group} from './Types'
import * as FileSystem from 'expo-file-system';

const workout_path: string = ""
const exercise_list_path: string = ""
const exercise_hist_path: string = ""

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