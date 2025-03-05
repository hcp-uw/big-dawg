import {DB, Workout, Exercise_List, Exercise_Hist, Muscle_Group, Exercise, Set} from './Types'
import * as FileSystem from 'expo-file-system'

const data_dir: string = FileSystem.documentDirectory + '.big-dawg/data/'

// implements interface for json
export class json_db implements DB {
    
    // workouts are saved 
    saveWorkout(w: Workout) : boolean {
      const file_name: string = (w.Date.getMonth() + 1) + "_" + w.Date.getFullYear() + ".json"
      const uri: string = data_dir + file_name
      let workout_exists: boolean = createFile(file_name)
      let content: (Workout|null)[]
      if (workout_exists) {
        content = JSON.parse(wrapAsync(FileSystem.readAsStringAsync, uri))
        workout_exists = !(content[w.Date.getDate() - 1] === null)
      } else {
        content = new Array<Workout|null>(31).fill(null)
      }
      if (!(this.addToExerciseHist(w.Sets, w.Date))) {
        throw new InvalidExerciseException("")
      }
      content[w.Date.getDate() - 1] = w
      wrapAsync(FileSystem.writeAsStringAsync, uri, JSON.stringify(content))
      return workout_exists
    }

    // helper for saveWorkout
    // Given a workout and a date adds/replaces history for each exercise in the array
    // returns true if succesful, false if one of the exercises for the sets doesn't exist
    addToExerciseHist(sets: Set[], d: Date) : boolean {
      // check all exercise names to make sure they are valid
      let exerciseList: Exercise_List| null = this.getExerciseList()
      if (exerciseList == null && sets.length != 0) {
        return false
      } 
      let exerciseNames: string[] = Object.values(exerciseList as Exercise_List)
        .flat()  // Flatten the array of arrays (e.g., Chest[], Back[], etc.)
        .map(exercise => exercise.Exercise_Name);  // Extract Exercise_Name
      sets.forEach((s: Set) => {
        if (!exerciseNames.includes(s.Exercise_Name)) {
          return false
        }
      });

      // now that we know all exercise names are valid, for each exercise add it to the respective .json
      for (let i = 0; i < sets.length; i++) {
          // get the exercise of the current set we want to add
          const ex: Exercise_Hist = this.getExerciseHistory(sets[i].Exercise_Name)
          
          // search for and splice out any existing history element with a matching date for this exercise
          for (let j = 0; j < ex.Hist.length; j++) {
              if (ex.Hist[j][1] === d) {
                  ex.Hist.splice(j, 1)
                  j -= 1
              }
          } 
          
          // now that there are no more history elements with the same date, add the new date in 
          ex.Hist.push([sets[i], d])

          // rewrite the updated object to file
          const ex_uri: string = data_dir + sets[i].Exercise_Name + ".json"
          wrapAsync(FileSystem.writeAsStringAsync, ex_uri, JSON.stringify(ex))
      }
      return true
    }

    getWorkout (date: Date): Workout | null {
      const file_name: string  =  (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        return null
      }
      let content: Workout[] = JSON.parse(wrapAsync(FileSystem.readAsStringAsync, uri))
      let result: Workout | null = content[date.getDate() - 1]
      return result
    }

    deleteWorkout (date: Date): boolean {
      const file_name: string  =  (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        return false
      }
      let content: (Workout|null)[] = JSON.parse(wrapAsync(FileSystem.readAsStringAsync, uri))
      const result: boolean  = !(content[date.getDate() - 1] === null)
      if (content[date.getDate() - 1] === null) {
        // nothing to delete
        return false
      }
      if (content[date.getDate() - 1] != null) {
        let exercise_names : string[] = (content[date.getDate() - 1] as Workout).Sets.map(exercise => exercise.Exercise_Name)
        this.deleteFromExerciseHist(exercise_names, date)
        content[date.getDate() - 1] = null
      }
      wrapAsync(FileSystem.writeAsStringAsync, uri, JSON.stringify(content))
      return true
    }

    // helper for deleteWorkout
    // Given a list of exercise names and gor each exercise in exercise names removes sets from that date 
    deleteFromExerciseHist(ex_names: string[], d : Date) : void {
        // for each exercise we want to update
        for (let i = 0; i < ex_names.length; i++) {
            // get the file and parse it into a Exercise_Hist object 
            const ex: Exercise_Hist = this.getExerciseHistory(ex_names[i])
            
                        // loop through ex.Hist set and splice out every element with a matching date
            for (let j = 0; j < ex.Hist.length; j++) {
                if (ex.Hist[j][1] === d) {
                    ex.Hist.splice(j, 1)
                    j -= 1
                }
            }

            // now that the elements with matching dates are gone from the object, rewrite the
            // object to file
            const ex_uri: string = data_dir + ex_names[i] + ".json"
            wrapAsync(FileSystem.writeAsStringAsync, ex_uri, JSON.stringify(ex))
        }
    }

    getExerciseList (): Exercise_List | null {
      const file_name: string = "Exercise_List.json"
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        return null
      }
      let content: Exercise_List = JSON.parse(wrapAsync(FileSystem.readAsStringAsync, uri))
      return content
    }

    getExerciseHistory (ex_name: string): Exercise_Hist {
      const file_name: string = ex_name + ".json"
      const uri: string = data_dir + file_name
      if (!(checkFile(file_name))) {
        throw new InvalidExerciseException(ex_name)
      }
      let content: Exercise_Hist = JSON.parse(wrapAsync(FileSystem.readAsStringAsync, uri))
      return content
    }

    saveExercise (ex: Exercise): boolean {
      // Save to exerciseHistory
      // If custom exercise, add to the history as a new file
      // add exerccise to exerccise list
      const file_name: string = ex.Exercise_Name + ".json"
      const uri: string = data_dir + file_name;
      let exerciseHist: Exercise_Hist;
      if (checkFile(file_name)) {
        return false
      }
      // Creates new file for that exercise

      const hist : Exercise_Hist = {Exercise_Name: ex.Exercise_Name, Hist: new Array<[Set, Date]>(0) }
      const updatedContent: string = JSON.stringify(hist) // can add null, 2 for spaces
      wrapAsync(FileSystem.writeAsStringAsync, uri, updatedContent);

      const list: Exercise_List | null = this.getExerciseList();
      let exercise_list: Exercise_List;
      if (list != null) {
        exercise_list = list
      }
      else {
        exercise_list = {Chest: [],
          Back: [],
          Legs: [],
          Triceps: [],
          Biceps: [],
          Shoulders: [],}
      }
      // add our exercise
      exercise_list[ex.Muscle_Group].push(ex)

      // Update the Exercise_List JSON file with the new list of names
      const updatedListContent = JSON.stringify(exercise_list);
      wrapAsync(FileSystem.writeAsStringAsync, data_dir + "Exercise_List.json", updatedListContent);
      return true
    }

    /* deleteExercise (ex_name: string): boolean {
        let deleted : boolean = false

        // two step removal: 1. remove from exerciselist
        // reuse the getExerciseList function to load the list
        const exerciseList : Exercise_List | null = this.getExerciseList()
        if (exerciseList == null) return false  // exercise list file is not valid

        // Since the ex_name could be in any of the muscle group Exercise arrays, we check each group
        for (const muscleGroup in exerciseList) {
            // look at each exercise for that group if the name matches, splice it out of the array
            const exercises: Exercise[] = exerciseList[muscleGroup as keyof Exercise_List]

            for (let i = 0 i < exercises.length i++) {
                if (exercises[i].Exercise_Name === ex_name) {
                    exercises.splice(i, 1)
                    deleted = true
                    break  // assuming that the ex_name only appears once in the entire Exercise_List
                }
            }
            
            if (deleted)
                break  // assuming that the ex_name only appears once in the entire Exercise_List
        }
        
        // write the updated Exercise_List back to disk
        const ex_list_uri: string = data_dir + "Exercise_List.json"
        wrapAsync(FS.writeAsStringAsync, ex_list_uri, JSON.stringify(exerciseList))

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
    }*/

    getCalendarView (month: bigint, year: bigint):  Muscle_Group[][] {
        // if month not in range 1-12, throw exception
        if (month <= 0 || month >= 13)
            throw new InvalidDateException(month, year)

        // try to get the file with the given month and year
        const file_name: string  =  month + "_" + year + ".json"
        const uri: string = data_dir + file_name
        // if the file does not exist, throw exception
        if (!(checkFile(file_name)))
            throw new InvalidDateException(month, year)

        // if the file exists, parse the file into a list of workouts for that month
        let content: Workout[] = JSON.parse(wrapAsync(FileSystem.readAsStringAsync, uri))

        let monthView : Muscle_Group[][] = []

        for (let i = 0; i < content.length; i++) {  // iterate through the days of the month
            let daySet : Muscle_Group[] = []
            for (let j = 0; j < content[i].Sets.length; j++) {  // iterate through the exercises of the day
                daySet.push(...this.getMuscleGroups(content[i].Sets[j].Exercise_Name))
            }

            // filter daySet by unique since it can contain duplicates, then add the daySet to the month array
            daySet = daySet.filter((muscle, index, self) => self.indexOf(muscle) === index)
            monthView[i] = daySet
        }

        return monthView
    }

    // private helper function for getCalendarView
    // given an exercise name, returns its muscle groups
    getMuscleGroups (ex_name: string): Muscle_Group[] {
        const file_name: string = ex_name + ".json"
        const uri: string = data_dir + file_name
        if (!(checkFile(file_name)))
            throw new InvalidExerciseException(ex_name)

        const content = JSON.parse(wrapAsync(FileSystem.readAsStringAsync, uri)) as Exercise

        const groups : Muscle_Group[] = []
        groups.push(content.Muscle_Group)

        return groups
    }
}

// creates file if it doesn't exist, otherwise does nothing
// returns true if the file already existed and nothing was created, false otherwise
export function createFile(file_name: string): boolean {
  if (checkFile(file_name)) { return false }
  wrapAsync(FileSystem.writeAsStringAsync, data_dir + file_name, '')
  return true
}

// checks if a file exists
// returns true if it does, false otherwise
export function checkFile(file_name: string): boolean {
    createDir()
    const fileInfo = wrapAsync(FileSystem.getInfoAsync, data_dir + file_name)
    return fileInfo.exists
}

// Checks if data_dir directory exists. If not, creates it
export function createDir(): void {
  const dirInfo = wrapAsync(FileSystem.getInfoAsync, data_dir)
  if (!dirInfo.exists) {
    console.log("Data directory doesn't exist, creating…")
    wrapAsync(FileSystem.makeDirectoryAsync, data_dir, { intermediates: true })
  }
}

// wrapper for async functions that blocks program until async functions are done
export function wrapAsync<Targs extends any[], TReturn> (fun: (...args: Targs) => Promise<TReturn>, ...args: Targs): TReturn {
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
    super(`Invalid exercise: ${exerciseName}`)
    this.name = "InvalidExerciseException"
  }
}

// Exception class that creates InvalidDateException for getCalendarView func
class InvalidDateException extends Error {
    constructor(month: bigint, year: bigint) {
        super(`Invalid date: ${year}, ${month}`)
        this.name = "InvalidDateException"
    }
}

// default export the class
export default {json_db}