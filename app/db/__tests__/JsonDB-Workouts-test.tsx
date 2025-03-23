import { DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout, InvalidExerciseException } from '../Types'
import { setupTest } from '../Testing-utils'

// consts for tests
const ex1: Exercise = {
  Exercise_Name: "Bench",
  Muscle_Group: "Chest",
  Comment: "Barbell"
}
const ex2: Exercise = {
  Exercise_Name: "Squat",
  Muscle_Group: "Legs",
  Comment: null
}

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
  Date: new Date(2025, 0, 15),
  TimeStarted: 10,
  TimeEnded: 12,
  Sets: [set1, set1, set2],
  WorkoutComment: "Good workout"
}

const w2: Workout = {
  Date: new Date(2025, 3, 1),
  TimeStarted: 10,
  TimeEnded: 12,
  Sets: [set2, set1, set2],
  WorkoutComment: "Good workout"
}

const w3: Workout = {
  Date: new Date(2025, 3, 1),
  TimeStarted: 8,
  TimeEnded: 10,
  Sets: [set2, set1, set1, set2],
  WorkoutComment: "Bad workout"
}

describe('json_db Workout Tests', () => {
  afterEach(() => {
    // resets mocked funcs created with spy on (used for mocked json_db funcs)
    jest.resetModules()
    jest.clearAllMocks()
  })
  it('getWorkout_noMonth', async () => {
    console.log("Test getWorkout_noMonth output begin")
    let { db } = setupTest({ file_exists: false })
    await expect(db.getWorkout(new Date())).resolves.toBe(null)
  })
  it('getWorkout_doesn\'t Exist', async () => {
    //console.log("Test getWorkout_doesn\'t Exist output begin")
    let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify([w, null, w])] })
    await expect(db.getWorkout(new Date(2025, 1, 2))).resolves.toBe(null)
  })
  it('getWorkout_exists', async () => {
    //console.log("Test getWorkout_exists output begin")
    let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify([null, null, null, w])] })
    await expect(db.getWorkout(new Date(2025, 1, 4))).resolves.toStrictEqual(w)
  })
  it('saveWorkout_invalidExercise', async () => {
    //console.log("Test saveWorkout_invalidExercise begin")
    let { db } = setupTest({ file_exists: false })
    jest.spyOn(db, 'addToExerciseHist').mockImplementation(() => Promise.resolve(false))
    await expect(db.saveWorkout(w)).rejects.toThrow(new InvalidExerciseException(""));
  })
  it('saveWorkout_newMonth', async () => {
    //console.log("Test saveWorkout_newMonth output begin")
    let c = [
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, w, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null]
    let { db } = setupTest({
      file_exists: false, expected_wContents:
        [{ uri: ".big-dawg/data/1_2025.json", content: "" }, { uri: ".big-dawg/data/1_2025.json", content: JSON.stringify(c) }]
    })
    jest.spyOn(db, 'addToExerciseHist').mockImplementation(() => Promise.resolve(true))
    await expect(db.saveWorkout(w)).resolves.toBe(false)
  })
  it('saveWorkout_newDay', async () => {
    //console.log("Test saveWorkout_newDay output begin")
    let c1 = [
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, w, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null]
    let c2 = [
      w2, null, null, null, null, null, null, null, null, null,
      null, null, null, null, w, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null]
    let { db } = setupTest({ expected_rContents: [JSON.stringify(c1)], expected_wContents: [{ uri: ".big-dawg/data/4_2025.json", content: JSON.stringify(c2) }] })
    jest.spyOn(db, 'addToExerciseHist').mockImplementation(() => Promise.resolve(true))
    await expect(db.saveWorkout(w2)).resolves.toBe(false)
  })
  it('saveWorkout_overwritingWorkout', async () => {
    //console.log("Test saveWorkout_overwritingWorkout output begin")
    let c1 = [
      w2, null, null, null, null, null, null, null, null, null,
      null, null, null, null, w, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null]
    let c2 = [
      w3, null, null, null, null, null, null, null, null, null,
      null, null, null, null, w, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null]
    let { db } = setupTest({ expected_rContents: [JSON.stringify(c1)], expected_wContents: [{ uri: ".big-dawg/data/4_2025.json", content: JSON.stringify(c2) }] })
    jest.spyOn(db, 'addToExerciseHist').mockImplementation(() => Promise.resolve(true))
    await expect(db.saveWorkout(w3)).resolves.toBe(true)
  })
  it('addToExerciseHist_noSets', async () => {
    //console.log("Test addToExerciseHist output begin")
    let { db } = setupTest()
    await expect(db.addToExerciseHist([], new Date())).resolves.toBe(true)
  })
  it('addToExerciseHist_noExercises', async () => {
    //console.log("Test addToExerciseHist output begin")
    let { db } = setupTest()
    jest.spyOn(db, 'getExerciseList').mockImplementation(() => Promise.resolve(null))
    await expect(db.addToExerciseHist([set1], new Date())).resolves.toBe(false)
  })
  it('addToExerciseHist_noSuchExercise', async () => {
    //console.log("Test noSuchExercise output begin")
    let { db } = setupTest()
    jest.spyOn(db, 'getExerciseList').mockImplementation(() => Promise.resolve({ Chest: [ex1], Back: [], Legs: [], Triceps: [], Biceps: [], Shoulders: [] }))
    await expect(db.addToExerciseHist([set1, set2], new Date())).resolves.toBe(false)
  })
  /*it('addToExerciseHist', async () => {
    //console.log("Test addTOExerciseHist output begin")
    let { db } = setupTest()
    jest.spyOn(db, 'getExerciseList').mockImplementation(() => Promise.resolve({ Chest: [ex1], Back: [], Legs: [], Triceps: [], Biceps: [], Shoulders: [] }))
    await expect(db.addToExerciseHist([set1, set2], new Date())).resolves.toBe(false)
  })*/
  it('deleteWorkout_noFile', async () => {
    //console.log("Test deleteWorkout_noFile output begin")
    let { db } = setupTest({ file_exists: false })
    await expect(db.deleteWorkout(new Date())).resolves.toBe(false)
  })
  it('deleteWorkout_noWorkout', async () => {
    //console.log("Test deleteWorkout_noWorkout output begin")
    let c = [
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null]
    let { db } = setupTest({ expected_rContents: [JSON.stringify(c)] })
    await expect(db.deleteWorkout(new Date())).resolves.toBe(false)
  })
  it('deleteWorkout', async () => {
    //console.log("Test deleteWorkout output begin")
    let c = [
      w, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, w,
      w]
    let c2 = [
      w, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, w,
      null]
    let { db } = setupTest({ expected_rContents: [JSON.stringify(c)], expected_wContents: [{ uri: ".big-dawg/data/12_1999.json", content: JSON.stringify(c2) }] })
    jest.spyOn(db, 'deleteFromExerciseHist').mockImplementation(() => Promise.resolve())
    await expect(db.deleteWorkout(new Date(1999, 11, 31))).resolves.toBe(true)
  })
  it('deleteFromExerciseHist ', async () => {
    //console.log("Test saveExercise_alreadyExists output begin")
  })

})