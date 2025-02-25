import {DB, Workout, Exercise_List, Exercise_Hist, Muscle_Group, Exercise} from './Types'
import * as FS from 'expo-file-system'

const data_dir: string = FS.documentDirectory + '.big-dawg/data/'

// implements interface for json
export class json_db implements DB {
    
    // workouts are saved 
    saveWorkout(w: Workout) : boolean {
      const file_name: string = (w.Date.getMonth() + 1) + "_" + w.Date.getFullYear() + ".json"
      const uri: string = data_dir + file_name
      let workout_exists: boolean = createFile(file_name)
      let content: (Workout|null)[]
      if (workout_exists) {
        content = JSON.parse(wrapAsync(FS.readAsStringAsync, uri))
        workout_exists = !(content[w.Date.getDate() - 1] === null)
      } else {
        content = new Array<Workout|null>(31).fill(null)
      }
      content[w.Date.getDate() - 1] = w
      wrapAsync(FS.writeAsStringAsync, uri, JSON.stringify(content))
      return workout_exists
    }

    getWorkout (date: Date): Workout | null {
      const file_name: string  =  (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        return null
      }
      let content: Workout[] = JSON.parse(wrapAsync(FS.readAsStringAsync, uri))
      let result: Workout | null = content[date.getDate() - 1]
      return result
    }

    deleteWorkout (date: Date): boolean {
      const file_name: string  =  (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        return false
      }
      let content: (Workout|null)[] = JSON.parse(wrapAsync(FS.readAsStringAsync, uri))
      const result: boolean  = !(content[date.getDate() - 1] === null)
      if (content[date.getDate() - 1] === null) {
        // nothing to delete
        return false
      }
      content[date.getDate() - 1] = null
      wrapAsync(FS.writeAsStringAsync, uri, JSON.stringify(content))
      return true
    }

    getExerciseList (): Exercise_List | null{
      const file_name: string = "Exercise_List.json" // Assuming that there is 1 file with all the exercises
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        return null
      }
      const content: string = wrapAsync(FS.readAsStringAsync, uri);
      const exerciseList: Exercise_List = JSON.parse(content);
      return exerciseList;
    }

    getExerciseHistory (ex_name: string): Exercise_Hist {
      const file_name: string = ex_name + ".json"  // For example, "Squat.json", "Bench_Press.json", etc.
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        // throw exception if the file name does not exist
        throw new InvalidExerciseException(ex_name);
      }
      const content: string = wrapAsync(FS.readAsStringAsync, uri);
      const exerciseHist: Exercise_Hist = JSON.parse(content);
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
        let deleted : boolean = false

        // two step removal: 1. remove from exerciselist
        // reuse the getExerciseList function to load the list
        const exerciseList : Exercise_List | null = this.getExerciseList()
        if (exerciseList == null) return false  // exercise list file is not valid

        // Since the ex_name could be in any of the muscle group Exercise arrays, we check each group
        for (const muscleGroup in exerciseList) {
            // look at each exercise for that group; if the name matches, splice it out of the array
            const exercises: Exercise[] = exerciseList[muscleGroup as keyof Exercise_List]

            for (let i = 0; i < exercises.length; i++) {
                if (exercises[i].Exercise_Name === ex_name) {
                    exercises.splice(i, 1)
                    deleted = true
                    i -= 1
                }
            }
        }

        // 2. delete ex_name.json file
        const file_name: string = ex_name + ".json"
        const uri: string = data_dir + file_name
        // if the file exists, delete it
        if (checkFile(file_name)) {
            wrapAsync(FS.deleteAsync, uri)
            deleted = true
        }

        // not sure if we want to destructively remove all historical records of this exercise
        // from the calendar/previous months


        return deleted
    }

    getCalendarView (month: bigint, year: bigint):  Muscle_Group[][] {
        // if month not in range 1-12, throw exception
        if (month <= 0 || month >= 13)
            throw new InvalidDateException(month, year);

        // try to get the file with the given month and year
        const file_name: string  =  month + "_" + year + ".json"
        const uri: string = data_dir + file_name
        // if the file does not exist, throw exception
        if (!(checkFile(file_name)))
            throw new InvalidDateException(month, year);

        // if the file exists, parse the file into a list of workouts for that month
        let content: Workout[] = JSON.parse(wrapAsync(FS.readAsStringAsync, uri))

        let monthView : Muscle_Group[][] = []


        for (let i = 0; i < content.length; i++) {  // iterate through the days of the month
            let daySet : Muscle_Group[] = []
            for (let j = 0; j < content[i].Sets.length; j++) {  // iterate through the exercises of the day
                daySet.push(...this.getMuscleGroups(content[i].Sets[j].Exercise_Name))
            }

            // filter daySet by unique since it can contain duplicates, then add the daySet to the month array
            daySet = daySet.filter((muscle, index, self) => self.indexOf(muscle) === index);
            monthView[i] = daySet
        }

        return monthView
    }

    // private helper function for getCalendarView
    // given an exercise name, returns its muscle groups
    // Todo: should type Exercise's Muscle_Group be an array? if so, update getMuscleGroups
    getMuscleGroups (ex_name: string): Muscle_Group[] {
        const file_name: string = ex_name + ".json"
        const uri: string = data_dir + file_name
        if (!(checkFile(file_name)))
            throw new InvalidExerciseException(ex_name)

        const content = JSON.parse(wrapAsync(FS.readAsStringAsync, uri)) as Exercise

        const groups : Muscle_Group[] = []
        groups.push(content.Muscle_Group)

        return groups
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
  let promise_resolved: boolean = false 
  let result: any
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

// Exception class that creates InvalidDateException for getCalendarView func
class InvalidDateException extends Error {
    constructor(month: bigint, year: bigint) {
        super(`Invalid date: ${year}, ${month}`);
        this.name = "InvalidDateException";
    }
}

// default export the class
export default {json_db}