import {DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout} from '../Types'
import{setupTest} from './Testing-utils'

describe('json_db Workout Tests', () => {
    afterEach(() => {
        console.log("Test output end")
        // resets mocked funcs created with spy on (used for mocked json_db funcs)
        jest.resetModules()
        jest.clearAllMocks()
      })
      it('getWorkout_doesn\'tExist', async () => {
        console.log("Test getWorkout_doesn\'tExist output begin")
        let {db} = setupTest({file_exists: false})
        await expect(db.getWorkout(new Date())).resolves.toBe(null)
      })
      it('getWorkout_exists ', async () => {
        console.log("Test getWorkout_exists output begin")
        const set1: Set = {

        }
        const set2: Set = {

        }
        const w: Workout = {
            Date: new Date(),
            TimeStarted: 10n,
            TimeEnded: 12n,
            Sets : [set1, set1, set2, set2, set1],
            WorkoutComment: "Good workout"
        }
        let {db} = setupTest({file_exists: false})
        await expect(db.getWorkout(new Date())).resolves.toBe(null)
      })
      it('saveWorkout ', async () => {
        console.log("Test saveExercise_alreadyExists output begin")
      })
      it('addToExerciseHist ', async () => {
        console.log("Test saveExercise_alreadyExists output begin")
      })
      it('deleteWorkout ', async () => {
        console.log("Test saveExercise_alreadyExists output begin")
      })
      it('deleteWorkout ', async () => {
        console.log("Test saveExercise_alreadyExists output begin")
      })
      it('deleteFromExerciseHist ', async () => {
        console.log("Test saveExercise_alreadyExists output begin")
      })

})