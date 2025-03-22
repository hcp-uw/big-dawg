import { DB, Workout, Exercise_List, Exercise_Hist, Muscle_Group, Exercise, Set, InvalidDateException, InvalidExerciseException } from './Types'
import * as FS from 'expo-file-system'

const data_dir: string = FS.documentDirectory + '.big-dawg/data/'

// implements interface for json
export class json_db implements DB {

  // workouts are saved 
  async saveWorkout(w: Workout): Promise<boolean> {
    const file_name: string = (w.Date.getMonth() + 1) + "_" + w.Date.getFullYear() + ".json"
    const uri: string = data_dir + file_name
    let workout_exists: boolean = !(await createFile(file_name))
    let content: (Workout | null)[]
    if (workout_exists) {
      content = JSON.parse(await FS.readAsStringAsync(uri))
      workout_exists = !(content[w.Date.getDate() - 1] === null)
    } else {
      content = new Array<Workout | null>(31).fill(null)
    }
    if (!(await this.addToExerciseHist(w.Sets, w.Date))) {
      throw new InvalidExerciseException("")
    }
    content[w.Date.getDate() - 1] = w
    await FS.writeAsStringAsync(uri, JSON.stringify(content))
    return workout_exists
  }

  // helper for saveWorkout
  // Given a workout and a date adds/replaces history for each exercise in the array
  // returns true if succesful, false if one of the exercises for the sets doesn't exist
  async addToExerciseHist(sets: Set[], d: Date): Promise<boolean> {
    // check all exercise names to make sure they are valid
    let exerciseList: Exercise_List | null = await this.getExerciseList()
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
      const ex: Exercise_Hist = await this.getExerciseHistory(sets[i].Exercise_Name)

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
      await FS.writeAsStringAsync(ex_uri, JSON.stringify(ex))
    }
    return true
  }

  async getWorkout(date: Date): Promise<Workout | null> {
    const file_name: string = (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      return null
    }
    let content: Workout[] = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
    let result: Workout | null = content[date.getDate() - 1]
    return result
  }

  async deleteWorkout(date: Date): Promise<boolean> {
    const file_name: string = (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      return false
    }
    let content: (Workout | null)[] = JSON.parse(await FS.readAsStringAsync(uri))
    const result: boolean = !(content[date.getDate() - 1] === null)
    if (content[date.getDate() - 1] === null) {
      // nothing to delete
      return false
    }
    if (content[date.getDate() - 1] != null) {
      let exercise_names: string[] = (content[date.getDate() - 1] as Workout).Sets.map(exercise => exercise.Exercise_Name)
      await this.deleteFromExerciseHist(exercise_names, date)
      content[date.getDate() - 1] = null
    }
    await FS.writeAsStringAsync(uri, JSON.stringify(content))
    return true
  }

  // helper for deleteWorkout
  // Given a list of exercise names and gor each exercise in exercise names removes sets from that date 
  async deleteFromExerciseHist(ex_names: string[], d: Date): Promise<void> {
    // for each exercise we want to update
    for (let i = 0; i < ex_names.length; i++) {
      // get the file and parse it into a Exercise_Hist object 
      const ex: Exercise_Hist = await this.getExerciseHistory(ex_names[i])

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
      await FS.writeAsStringAsync(ex_uri, JSON.stringify(ex))
    }
  }

  async getExerciseList(): Promise<Exercise_List | null> {
    const file_name: string = "Exercise_List.json"
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      return null
    }
    let content: Exercise_List = JSON.parse(await FS.readAsStringAsync(uri))
    return content
  }

  async getExerciseHistory(ex_name: string): Promise<Exercise_Hist> {
    const file_name: string = ex_name + ".json"
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      throw new InvalidExerciseException(ex_name)
    }
    let content: Exercise_Hist = JSON.parse(await FS.readAsStringAsync(uri))
    return content
  }

  async saveExercise(ex: Exercise): Promise<boolean> {
    // Save to exerciseHistory
    // If custom exercise, add to the history as a new file
    // add exerccise to exerccise list
    const file_name: string = ex.Exercise_Name + ".json"
    const uri: string = data_dir + file_name;
    let exerciseHist: Exercise_Hist;
    if (await checkFile(file_name)) {
      return false
    }
    // Creates new file for that exercise
    const hist: Exercise_Hist = { Exercise_Name: ex.Exercise_Name, Hist: new Array<[Set, Date]>(0) }
    const updatedContent: string = JSON.stringify(hist) // can add null, 2 for spaces
    await FS.writeAsStringAsync(uri, updatedContent);

    const list: Exercise_List | null = await this.getExerciseList();
    let exercise_list: Exercise_List;
    if (list != null) {
      exercise_list = list
    }
    else {
      exercise_list = {
        Chest: [],
        Back: [],
        Legs: [],
        Triceps: [],
        Biceps: [],
        Shoulders: [],
      }
    }
    // add our exercise
    exercise_list[ex.Muscle_Group].push(ex)

    // Update the Exercise_List JSON file with the new list of names
    const updatedListContent = JSON.stringify(exercise_list);
    await FS.writeAsStringAsync(data_dir + "Exercise_List.json", updatedListContent);
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

  async getCalendarView(month: bigint, year: bigint): Promise<Muscle_Group[][]> {
    // if month not in range 1-12, throw exception
    if (month <= 0 || month >= 13)
      throw new InvalidDateException(month, year)

    // try to get the file with the given month and year
    const file_name: string = month + "_" + year + ".json"
    const uri: string = data_dir + file_name
    // if the file does not exist, throw exception
    if (!(checkFile(file_name)))
      throw new InvalidDateException(month, year)

    // if the file exists, parse the file into a list of workouts for that month
    let content: Workout[] = JSON.parse(await FS.readAsStringAsync(uri))

    let monthView: Muscle_Group[][] = []

    for (let i = 0; i < content.length; i++) {  // iterate through the days of the month
      let daySet: Muscle_Group[] = []
      for (let j = 0; j < content[i].Sets.length; j++) {  // iterate through the exercises of the day
        daySet.push(...(await this.getMuscleGroups(content[i].Sets[j].Exercise_Name)))
      }

      // filter daySet by unique since it can contain duplicates, then add the daySet to the month array
      daySet = daySet.filter((muscle, index, self) => self.indexOf(muscle) === index)
      monthView[i] = daySet
    }

    return monthView
  }

  // private helper function for getCalendarView
  // given an exercise name, returns its muscle groups
  async getMuscleGroups(ex_name: string): Promise<Muscle_Group[]> {
    const file_name: string = ex_name + ".json"
    const uri: string = data_dir + file_name
    if (!(checkFile(file_name)))
      throw new InvalidExerciseException(ex_name)

    const content = JSON.parse(await FS.readAsStringAsync(uri)) as Exercise

    const groups: Muscle_Group[] = []
    groups.push(content.Muscle_Group)

    return groups
  }
}

// creates file if it doesn't exist, otherwise does nothing
// returns false if the file already existed and nothing was created, true otherwise
async function createFile(file_name: string): Promise<boolean> {
  if (await checkFile(file_name)) { return false }
  await FS.writeAsStringAsync(data_dir + file_name, '')
  return true
}

// checks if a file exists
// returns true if it does, false otherwise
async function checkFile(file_name: string): Promise<boolean> {
  createDir()
  const fileInfo = await FS.getInfoAsync(data_dir + file_name)
  return fileInfo.exists
}

// Checks if data_dir directory exists. If not, creates it
async function createDir(): Promise<void> {
  const dirInfo = await FS.getInfoAsync(data_dir)
  if (!dirInfo.exists) {
    //console.log("Data directory doesn't exist, creating…")
    await FS.makeDirectoryAsync(data_dir, { intermediates: true })
  }
}

// helper function for JSON.parse that converts date strings to date objects
const dateReviver = (key: string, value: any) => {
  // Check if the value is a string and looks like a date
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    return new Date(value);  // Convert to Date object
  }
  return value;  // Otherwise, return the value as-is
};

/* wrapper for async functions that blocks program until async functions are done
export function wrapAsync<Targs extends any[], TReturn> (fun: (...args: Targs) => Promise<TReturn>, ...args: Targs): TReturn {
  let promise_resolved: boolean = false 
  let result: any
  fun(...args)
  .then((r: TReturn) => {
    result = r
    promise_resolved = true
    return r
  })
  .catch((error) => {
      console.error(error)
      promise_resolved = true
      throw error
  })
  while(!promise_resolved) {
    setTimeout(() => {}, 10);
  }
  return result
}*/

// default export the class
export default { json_db }