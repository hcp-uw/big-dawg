import {DB, Workout, Exercise_List, Exercise_Hist, Muscle_Group} from './Types'
import * as FS from 'expo-file-system';

const data_dir: string = FS.documentDirectory + '.big-dawg/data/'

// implements interface for json
export class json_db implements DB {
    
    // workouts are saved 
    async saveWorkout(w: Workout) : Promise<boolean> {
      const file_name: string  =  (w.Date.getMonth() + 1) + "_" + w.Date.getFullYear() + ".json"
      const uri: string = data_dir + file_name;
      var workout_exists: boolean = await createFile(file_name)
      var content: Workout[]
      if (workout_exists) {
        content = JSON.parse(await FS.readAsStringAsync(uri))
        workout_exists = !(content[w.Date.getDate() - 1] == undefined)
      } else {
        content = new Array<Workout>(31)
      }
      content[w.Date.getDate() - 1] = w;
      await FS.writeAsStringAsync(uri, JSON.stringify(content))
      return workout_exists
    }

    async getWorkout (date: Date): Promise<Workout | null> {
        
    }

    async deleteWorkout (date: Date): Promise<boolean> {

    }

    async getExerciseList (): Promise<Exercise_List> {

    }

    async getExerciseHistory (ex_name: string): Promise<Exercise_Hist> {

    }

    async saveExercise (): Promise<boolean> {

    }

    async deleteExercise (ex_name: string): Promise<boolean> {

    }

    async getCalendarView (month: bigint):  Promise<Muscle_Group[][]> {

    }
}

// creates file if it doesn't exist, otherwise does nothing
// returns true if the file already existed and nothing was created, false otherwise
async function createFile(file_name: string): Promise<boolean> {
  if (await checkFile(file_name)) { return false }
  await FS.writeAsStringAsync(data_dir + file_name, '')
  return true
}

// checks if a file exists
// returns true if it does, false otherwise
async function checkFile(file_name: string): Promise<boolean> {
    await createDir()
    const fileInfo = await FS.getInfoAsync(data_dir + file_name)
    return fileInfo.exists
}

// Checks if data_dir directory exists. If not, creates it
async function createDir(): Promise<void> {
  const dirInfo = await FS.getInfoAsync(data_dir);
  if (!dirInfo.exists) {
    console.log("Data directory doesn't exist, creating…");
    await FS.makeDirectoryAsync(data_dir, { intermediates: true });
  }
}