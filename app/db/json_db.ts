import {
  DB,
  Workout,
  Exercise_List,
  Exercise_Hist,
  Muscle_Group,
  Exercise,
  Set,
  InvalidExerciseException,
  WorkoutPreset,
} from './Types'
import { defaultExercises } from './PresetExercises'
import * as FS from 'expo-file-system'

const data_dir: string = FS.documentDirectory + '.big-dawg/data/'
const wp_file: string = "WorkoutPresets.json"

// implements interface for json
export class json_db implements DB {

  Init(): void {
    for (let ex of defaultExercises) {
      this.saveExercise(ex)
    }
  }

  // workouts are saved
  async saveWorkout(w: Workout): Promise<boolean> {
    // zero out the time for the date
    w.Date.setHours(0, 0, 0, 0)
    const file_name: string = (w.Date.getMonth() + 1) + "_" + w.Date.getFullYear() + ".json"
    const uri: string = data_dir + file_name
    // check if the month/file exists
    let workout_exists: boolean = await checkFile(file_name)
    let content: (Workout | null)[]
    if (workout_exists) {
      // if month/file exists read it
      content = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
      // check if workout exists in that day
      workout_exists = !(content[w.Date.getDate() - 1] === null)
    } else {
      content = new Array<Workout | null>(31).fill(null)
    }
    await this.addToExerciseHist(w.Sets, w.Date)
    content[w.Date.getDate() - 1] = w
    await FS.writeAsStringAsync(uri, JSON.stringify(content))
    return workout_exists
  }

  // helper for saveWorkout
  // Given a workout and a date adds/replaces history for each exercise in the array
  // saves all sets with valid exercise names and throws an InvalidExerciseException for
  // sets with invalid exercises in the format "InvalidEx1 InvalidEx2 InvalidEX3"
  async addToExerciseHist(s: Set[], d: Date): Promise<void> {
    let invalidExercises: string[] = []
    if (s.length == 0) return
    // zero out the time for the date
    d.setHours(0, 0, 0, 0)
    let grouped_sets: (Set[])[] = SetsByEx(s)
    for (const g of grouped_sets) {
      let ex: Exercise_Hist = { Exercise_Name: "Compiler Dummy", Hist: [] }
      try {
        ex = await this.getExerciseHistory(g[0].Exercise_Name)
      }
      catch (error) {
        //console.log(error)
        //if (error instanceof InvalidExerciseException) {
        //throw new InvalidExerciseException("")
        invalidExercises.push(error.message.slice(18))
        continue
        //}
      }
      // splice out the sets with the curr date
      ex.Hist = ex.Hist.filter(([_, date]) => date.getTime() !== d.getTime());
      // add the new sets
      ex.Hist = [...(ex.Hist), ...(g.map(set => [set, d] as [Set, Date]))]
      // sort array by date so newest is first
      ex.Hist.sort((a, b) => b[1].getTime() - a[1].getTime())
      // update the file contents
      const ex_uri: string = data_dir + g[0].Exercise_Name + ".json"
      FS.writeAsStringAsync(ex_uri, JSON.stringify(ex))
    }
    if (invalidExercises.length == 0) return
    // throw InvalidExercise with all invalid exercises
    let err_str: string = ""
    for (const s of invalidExercises) {
      err_str = err_str + " " + s
    }
    throw new InvalidExerciseException(err_str)
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
    // zero out the time for the date
    date.setHours(0, 0, 0, 0)
    const file_name: string = (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      return false
    }
    let content: (Workout | null)[] = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
    if (content[date.getDate() - 1] === null) {
      // nothing to delete
      return false
    }
    let exercise_names: string[] = (content[date.getDate() - 1] as Workout).Sets.map(exercise => exercise.Exercise_Name)
    await this.deleteFromExerciseHist(exercise_names, date)
    content[date.getDate() - 1] = null
    await FS.writeAsStringAsync(uri, JSON.stringify(content))
    return true
  }

  // helper for deleteWorkout
  // Given a list of exercise names and gor each exercise in exercise names removes sets from that date
  async deleteFromExerciseHist(ex_names: string[], d: Date): Promise<void> {
    // zero out the time for the date
    d.setHours(0, 0, 0, 0)
    // for each exercise we want to update
    for (let i = 0; i < ex_names.length; i++) {
      // get the file and parse it into a Exercise_Hist object
      const ex: Exercise_Hist = await this.getExerciseHistory(ex_names[i])
      ex.Hist = ex.Hist.filter(([_, date]) => date.getTime() !== d.getTime());
      // now that the elements with matching dates are gone from the object, rewrite the
      // object to file
      const ex_uri: string = data_dir + ex_names[i] + ".json"
      await FS.writeAsStringAsync(ex_uri, JSON.stringify(ex))
    }
  }

  async getExerciseList(): Promise<Exercise_List> {
    const file_name: string = "Exercise_List.json"
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      const empty_exList: Exercise_List = {
        Chest: [],
        Back: [],
        Legs: [],
        Triceps: [],
        Biceps: [],
        Shoulders: [],
      }
      FS.writeAsStringAsync(uri, JSON.stringify(empty_exList))
      return empty_exList
    }
    let content: Exercise_List = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
    return content
  }

  async getExerciseHistory(ex_name: string): Promise<Exercise_Hist> {
    const file_name: string = ex_name + ".json"
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      const ex_list: Exercise_List = await this.getExerciseList()
      const my_ex: Exercise | null = Object.values(ex_list).flat().find((obj) => obj.Exercise_Name === ex_name) || null;
      if (my_ex != null) {
        // if it's in exerciseList, create empty hist and return it
        this.saveExercise(my_ex)
        return { Exercise_Name: ex_name, Hist: [] }
      } else {
        throw new InvalidExerciseException(ex_name)
      }
    }
    let content: Exercise_Hist = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
    return content
  }

  async saveExercise(ex: Exercise): Promise<boolean> {
    let ex_list: Exercise_List = await this.getExerciseList();
    let ex_exists: boolean = false
    // remove old ex (if it exists)
    // note: actually O(n) since first loop iterates over fixed size fields (muscle groups)
    for (let arr of Object.values(ex_list)) {
      const index = arr.findIndex(item => item.Exercise_Name === ex.Exercise_Name);
      if (index !== -1) {
        arr.splice(index, 1);  // Remove element at index
        ex_exists = true;
        break;
      }
    }
    // add new ex exercise list
    ex_list[ex.Muscle_Group].push(ex)
    // Update the Exercise_List JSON file with the new list of names
    const updatedListContent = JSON.stringify(ex_list);
    await FS.writeAsStringAsync(data_dir + "Exercise_List.json", updatedListContent);
    // make ex hist file (if it doesn't exist)
    const file_name: string = ex.Exercise_Name + ".json"
    const uri: string = data_dir + file_name;
    let exerciseHist: Exercise_Hist;
    if (await checkFile(file_name)) {
      return false
    }
    // Creates new file for that exercise
    const hist: Exercise_Hist = { Exercise_Name: ex.Exercise_Name, Hist: new Array<[Set, Date]>(0) }
    const updatedContent: string = JSON.stringify(hist)
    await FS.writeAsStringAsync(uri, updatedContent);
    return !ex_exists
  }

  async getCalendarView(date: Date): Promise<Muscle_Group[][]> {
    // try to get the file with the given month and year
    const file_name: string = (date.getMonth() + 1) + "_" + date.getFullYear() + ".json"
    const uri: string = data_dir + file_name
    // if the file does not exist, no history so return empty array
    if (!(await checkFile(file_name))) return []

    // if the file exists, parse the file into a list of workouts for that month
    const monthHistory: Workout[] = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
    const ex_list: Exercise_List = await this.getExerciseList()
    const exercise_Map: Map<string, Exercise> = new Map(
      Object.values(ex_list).flat().map(ex => [ex.Exercise_Name, ex])
    )
    let num_MuscleGroups: number = Object.keys(ex_list).length
    let monthMuscleGroups: Muscle_Group[][] = []
    for (let day = 0; day < monthHistory.length; day++) {
      if (monthHistory[day] == null) {
        // no workout for that day
        monthMuscleGroups[day] = []
        continue
      }
      // get muscle groups for curr day
      let dayMuscleGroups: Muscle_Group[] = []
      // loop through sets while we haven't reached maximum muscle groups
      for (let i = 0; i < monthHistory[day].Sets.length && dayMuscleGroups.length < num_MuscleGroups; i++) {
        const curr_ex: Exercise | undefined = exercise_Map.get(monthHistory[day].Sets[i].Exercise_Name)
        if (curr_ex != undefined) {
          if (dayMuscleGroups.find((obj: Muscle_Group) => obj === curr_ex.Muscle_Group) == undefined) {
            dayMuscleGroups.push(curr_ex.Muscle_Group)
          }
        } else {
          // maybe add error checking for this case?
          continue
        }
      }
      // by this point, every exercise of the current day should have their muscle groups copied to dayMuscleGroups,
      // and the current day's muscle groups should be finalized.
      // now store the day's muscle groups in the monthMuscleGroups[day]
      monthMuscleGroups[day] = dayMuscleGroups.sort();
    }
    // by the end of the loop all days of the month should be either populated with [] if no workouts were done, or
    // with a populated Muscle_Group[]
    return monthMuscleGroups
  }

  async getWorkoutPreset(name: string): Promise<WorkoutPreset | null> {
    const uri: string = data_dir + wp_file
    if (!(await checkFile(wp_file))) {
      return null
    }
    let content: WorkoutPreset[] = JSON.parse(await FS.readAsStringAsync(uri))
    let result: WorkoutPreset | null = null;
    for (let wp of content) {
      if (wp.Name === name) {
        result = wp
        break;
      }
    }
    return result
  }

  async saveWorkoutPreset(wp: WorkoutPreset): Promise<boolean> {
    const uri: string = data_dir + wp_file
    let exl: Exercise[] = Object.values(await this.getExerciseList()).flat();
    for (let s of wp.Preset) {
      if (!exl.some(ex => ex.Exercise_Name === s.Exercise_Name)) {
        throw new InvalidExerciseException(s.Exercise_Name)
      }
    }
    let content: WorkoutPreset[] = []
    if (await checkFile(wp_file)) {
      content = JSON.parse(await FS.readAsStringAsync(uri))
    }
    let result: boolean = false
    for (let i = 0; i < content.length; i++) {
      if (content[i].Name === wp.Name) {
        content.splice(i, 1);
        result = true;
        break;
      }
    }
    content.push(wp)
    const updatedContent: string = JSON.stringify(content)
    await FS.writeAsStringAsync(uri, updatedContent)
    return result
  }

  async deleteWorkoutPreset(name: string): Promise<boolean> {
    const uri: string = data_dir + wp_file
    if (!(await checkFile(wp_file))) {
      return false
    }
    let content: WorkoutPreset[] = JSON.parse(await FS.readAsStringAsync(uri))
    let result: boolean = false
    for (let i = 0; i < content.length; i++) {
      if (content[i].Name === name) {
        content.splice(i, 1);
        result = true;
        break;
      }
    }
    if (result) {
      const updatedContent: string = JSON.stringify(content)
      await FS.writeAsStringAsync(uri, updatedContent)
    }
    return result
  }

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
function dateReviver(key: string, value: any): any {
  // Check if the value is a string and looks like a date
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    return new Date(value);  // Convert to Date object
  }
  return value;  // Otherwise, return the value as-is
};

// helper func that splits an array of sets into
// multiple arrays based on ex name
function SetsByEx(s: Set[]): (Set[])[] {
  let result: (Set[])[] = []
  // create copy we are free to modify
  let sets: Set[] = s.slice()
  // sort the sets so the same exercise names are grouped together
  sets.sort((a, b) => a.Exercise_Name.localeCompare(b.Exercise_Name))
  // split
  let lo: number = 0
  let hi: number = 0
  for (; hi < sets.length; hi++) {
    if (sets[lo].Exercise_Name === sets[hi].Exercise_Name) {
      continue
    } else {
      result.push(sets.slice(lo, hi))
      lo = hi
    }
  }
  result.push(sets.slice(lo, hi))
  return result
}

// default export the class
export default { json_db }