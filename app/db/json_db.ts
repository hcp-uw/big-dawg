import {
  DB,
  Workout,
  Exercise_List,
  Exercise_Hist,
  Muscle_Group,
  Exercise,
  Set,
  WorkoutSchema,
  WorkoutPlan,
  InvalidDateException,
  InvalidExerciseException,
  InvalidInternalExerciseListException
} from './Types'
import * as FS from 'expo-file-system'

const data_dir: string = FS.documentDirectory + '.big-dawg/data/'

// implements interface for json
export class json_db implements DB {

  // workouts are saved
  async saveWorkout(w: Workout): Promise<boolean> {
    // zero out the time for the date
    w.Date.setHours(0, 0, 0, 0)
    const file_name: string = (w.Date.getMonth() + 1) + "_" + w.Date.getFullYear() + ".json"
    const uri: string = data_dir + file_name
    let workout_exists: boolean = !(await createFile(file_name))
    let content: (Workout | null)[]
    if (workout_exists) {
      content = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
      workout_exists = !(content[w.Date.getDate() - 1] === null)
    } else {
      content = new Array<Workout | null>(31).fill(null)
    }
    // throws NoSuchExercise exception if set has exercise name not in list
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
        //invalidExercises.push(error.message.slice(18))
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

  async getExerciseList(): Promise<Exercise_List | null> {
    const file_name: string = "Exercise_List.json"
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      return null
    }
    let content: Exercise_List = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
    return content
  }

  async getExerciseHistory(ex_name: string): Promise<Exercise_Hist> {
    const file_name: string = ex_name + ".json"
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      throw new InvalidExerciseException(ex_name)
    }
    let content: Exercise_Hist = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
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
      if (exerciseList === null) return false  // exercise list file is not valid

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
    // if the file does not exist, give up
    if (!(await checkFile(file_name)))
      return []

    // if the file exists, parse the file into a list of workouts for that month
    const monthHistory: Workout[] = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
    const exerciseList: Exercise_List | null = await this.getExerciseList()

    // THIS EXCEPTION IS ONLY THROWN IF THE Exercise_List.json FILE WAS NOT CREATED PRIOR TO getCalendarView BEING CALLED,
    // THUS this.getExerciseList() RETURNED NULL. MAKE SURE THE Exercise_List.json FILE IS CREATED BEFORE CALLING
    // getCalendarView
    if (exerciseList == null)
      return []
      // throw new InvalidInternalExerciseListException()  //todo: implement db init and remove this? 


    let monthMuscleGroups: Muscle_Group[][] = []

    for (let day = 0; day < monthHistory.length; day++) {  // iterate through the days of the month
      // in the content workout list, the value at each index could either be a Workout object or null.
      // so append an empty list to the monthView if the value is null,
      // otherwise if not null, we need to actually find all of the muscle group info from the exercises
      if (monthHistory[day] == null) {
        monthMuscleGroups[day] = []
        continue
      }

      // now we know for sure that the current day has a recorded workout, so now we extract the muscle groups out of
      // the day's exercises
      let dayMuscleGroups: Muscle_Group[] = []
      // for each set in the day's exercise,
      monthHistory[day].Sets.forEach((set: Set) => {
        // since a set can only have one exercise, get the set's exercise name
        const ex_name: string = set.Exercise_Name

        // for each muscle group of exerciseList,
        Object.entries(exerciseList).forEach(([muscleGroup, exercisesArr]) => {
          // check each Exercise object of that muscle group to see if the name matches.
          exercisesArr.forEach((exercise: Exercise) => {
            // if the name matches AND the muscle group is not already in the final returned array, add it
            if (exercise.Exercise_Name == ex_name && !dayMuscleGroups.includes(<Muscle_Group> muscleGroup)) {
              dayMuscleGroups.push(<Muscle_Group> muscleGroup)
            }
            // since Array.forEach does not support break;, we unfortunately must keep going through the rest of the
            // array. potential optimization here. make a temp structure that holds only the exercise name instead of
            // exercise objects
          })
        })

        // by this point, the current exercise (i.e. ex_name) should have its muscle groups completely copied to
        // dayMuscleGroups.
      })

      // by this point, every exercise of the current day should have their muscle groups copied to dayMuscleGroups,
      // and the current day's muscle groups should be finalized.
      // now store the day's muscle groups in the monthMuscleGroups[day]
      monthMuscleGroups[day] = dayMuscleGroups.sort();
    }
    // by the end of the loop all days of the month should be either populated with [] if no workouts were done, or
    // with a populated Muscle_Group[]

    return monthMuscleGroups
  }

  async getWorkoutPlan(plan_name: string): Promise<WorkoutPlan> {
    const file_name: string = plan_name + ".json" // so like push.json
    const uri: string = data_dir + file_name
    if (!(await checkFile(file_name))) {
      throw new InvalidExerciseException(plan_name)  // fix because its not really invalid exercise...
    }
    let content: WorkoutPlan = JSON.parse(await FS.readAsStringAsync(uri), dateReviver)
    return content
  }

  // btw this function doesnt update the already existing workout plan
  async saveWorkoutPlan(schema: WorkoutSchema, days: string[]): Promise<boolean> {
    // it should take the WorkoutSchema and days and save it as WorkoutPlan
    const file_name: string = schema.name + ".json"
    const uri: string = data_dir + file_name;
    if(await checkFile(file_name)){
      return false; // plan already exists
    }
    const workoutPlan: WorkoutPlan = {plan: schema, days: days}
    const updatedContent: string = JSON.stringify(workoutPlan)
    await FS.writeAsStringAsync(uri, updatedContent)
    return true
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