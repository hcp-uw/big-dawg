import {DB, Workout, Exercise_List, Exercise_Hist, Muscle_Group, Exercise} from './Types'
import * as FS from 'expo-file-system'

const data_dir: string = FS.documentDirectory + '.big-dawg/data/'

// implements interface for json
export class json_db implements DB {
    
    // workouts are saved 
    saveWorkout(w: Workout) : boolean {
      const file_name: string = (w.Date.getMonth() + 1) + "_" + w.Date.getFullYear() + ".json"
      const uri: string = data_dir + file_name
      var workout_exists: boolean = createFile(file_name)
      var content: (Workout|undefined)[]
      if (workout_exists) {
        content = JSON.parse(wrapAsync(FS.readAsStringAsync, uri))
        workout_exists = !(content[w.Date.getDate() - 1] === undefined)
      } else {
        content = new Array<Workout|undefined>(31).fill(undefined)
      }
      content[w.Date.getDate() - 1] = w
      var result = wrapAsync(FS.writeAsStringAsync, uri, JSON.stringify(content))
      return workout_exists
    }

    getWorkout (date: Date): Workout | null {
      const file_name: string  =  (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        return null
      }
      var content: Workout[] = JSON.parse(wrapAsync(FS.readAsStringAsync, uri))
      var result = content[date.getDate() - 1]
      if (result === undefined) { return null }
      return result
    }

    deleteWorkout (date: Date): boolean {
      const file_name: string  =  (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        return false
      }
      var content: (Workout|undefined)[] = JSON.parse(wrapAsync(FS.readAsStringAsync, uri))
      const result: boolean  = !(content[date.getDate() - 1] === undefined)
      content[date.getDate() - 1] = undefined
      wrapAsync(FS.writeAsStringAsync, uri, JSON.stringify(content))
      return result
    }

    getExerciseList (): Exercise_List | null{
      const file_name: string = "Exercise_List.json" // Assuming that there is 1 file with all the exercises
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        return null
      }
      
      const content = wrapAsync(FS.readAsStringAsync, uri);
      const exerciseList = JSON.parse(content) as Exercise_List;
      return exerciseList;
    }

    getExerciseHistory (ex_name: string): Exercise_Hist {
      const file_name: string = ex_name + ".json"  // For example, "Squat.json", "Bench_Press.json", etc.
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        // throw exception if the file name does not exist
        throw new InvalidExerciseException(ex_name);
      }
      const content = wrapAsync(FS.readAsStringAsync, uri);
      const exerciseHist = JSON.parse(content) as Exercise_Hist;
      return exerciseHist;
    }

    saveExercise (ex: Exercise): boolean {
      // Save to exerciseHistory
      // If custom exercise, add to the history as a new file
      const file_name: string = ex.Exercise_Name + ".json"
      const uri: string = data_dir + file_name;
      let exerciseHist: Exercise_Hist;
      if (checkFile(file_name)) {
        const content = wrapAsync(FS.readAsStringAsync, uri);
        exerciseHist = JSON.parse(content) as Exercise_Hist;  // exerciseHist holds the history of the exercise
      } else {
        exerciseHist = { Exercise_Name: ex.Exercise_Name, Hist: [], Date: new Date()};  // Create a new history for the exercise
        exerciseHist.Exercise_Name = ex.Exercise_Name;
      }
      exerciseHist.Hist.push(ex); // Fix this later, bc idk if this is pushing the history into the file
      exerciseHist.Date = new Date();
      
      // the updated content is the new history of the exercise
      const updatedContent = JSON.stringify(exerciseHist, null, 2);  // Converts TS to JSON
      wrapAsync(FS.writeAsStringAsync, uri, updatedContent); // Writes the updated content to the file
      return true;  // Fix since, there is no way for this func to return false since all ex, is treated as eithe pre or custom

    }

    deleteExercise (ex_name: string): boolean {
      // Steve
    }

    getCalendarView (month: bigint):  Muscle_Group[][] {
      // steve 
    }
}

// creates file if it doesn't exist, otherwise does nothing
// returns true if the file already existed and nothing was created, false otherwise
function createFile(file_name: string): boolean {
  if (checkFile(file_name)) { return false }
  wrapAsync(FS.writeAsStringAsync, data_dir + file_name, '')
  return true
}

// checks if a file exists
// returns true if it does, false otherwise
function checkFile(file_name: string): boolean {
    createDir()
    const fileInfo = wrapAsync(FS.getInfoAsync, data_dir + file_name)
    return fileInfo.exists
}

// Checks if data_dir directory exists. If not, creates it
function createDir(): void {
  const dirInfo = wrapAsync(FS.getInfoAsync, data_dir)
  if (!dirInfo.exists) {
    console.log("Data directory doesn't exist, creating…")
    wrapAsync(FS.makeDirectoryAsync, data_dir, { intermediates: true })
  }
}

// wrapper for async functions that blocks program until async functions are done
function wrapAsync<Targs extends any[], TReturn> (fun: (...args: Targs) => Promise<TReturn>, ...args: Targs): TReturn {
  var promise_resolved: boolean = false 
  var result: any
  fun(...args).then((r: TReturn) => {
    result = r
    promise_resolved = true
    return r
  })
  .catch((error) => {
      console.error(error)
      promise_resolved = true
      throw error
  })
  while(!promise_resolved) {}
  return result
}

// Exception class that creates InvalidExerciseException for getExerciseHistory func.
// Maybe we can put this inside a new file called exception.ts
class InvalidExerciseException extends Error {
  constructor(exerciseName: string) {
    super(`Invalid exercise: ${exerciseName}`);
    this.name = "InvalidExerciseException";
  }
}

// default export the class
export default {json_db}