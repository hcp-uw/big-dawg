import { DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout } from '../Types'
import { setupTest } from '../Testing-utils'

// consts for tests
const set1: Set = {
  Exercise_Name: "Bench",
  Weight: 225,
  Reps: 3,
  Comment: null
}
const set2: Set = {
  Exercise_Name: "Squat",
  Weight: 315.5,
  Reps: 3,
  Comment: "PR!"
}
const w: Workout = {
  Date: new Date(),
  TimeStarted: 10,
  TimeEnded: 12,
  Sets: [set1, set1, set2],
  WorkoutComment: "Good workout"
}

describe('json_db Workout Tests', () => {
  afterEach(() => {
    console.log("Test output end")
    // resets mocked funcs created with spy on (used for mocked json_db funcs)
    jest.resetModules()
    jest.clearAllMocks()
  })
  it('getWorkout_noMonth', async () => {
    console.log("Test getWorkout_doesn\'tExist output begin")
    let { db } = setupTest({ file_exists: false })
    await expect(db.getWorkout(new Date())).resolves.toBe(null)
  })
  it('getWorkout_doesn\'t Exist', async () => {
    console.log("Test getWorkout_exists output begin")
    const w: Workout = {
      Date: new Date(),
      TimeStarted: 10,
      TimeEnded: 12,
      Sets: [],
      WorkoutComment: "Good workout"
    }
    let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify([w, null, w])] })
    await expect(db.getWorkout(new Date(2025, 1, 2))).resolves.toBe(null)
  })
  it('getWorkout_exists', async () => {
    console.log("Test getWorkout_exists output begin")
    let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify([null, null, null, w])] })
    await expect(db.getWorkout(new Date(2025, 1, 4))).resolves.toStrictEqual(w)
  })
  it('saveWorkout_invalidExercise', async () => {

  })
  it('saveWorkout_newMonth', async () => {
    console.log("Test saveExercise_alreadyExists output begin")
  })
  it('saveWorkout_updatingMMonth', async () => {
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