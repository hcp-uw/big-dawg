import { Exercise, Set, Workout, InvalidExerciseException } from '../Types'
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
const set3: Set = {
  Exercise_Name: "Dummy",
  Weight: 300,
  Reps: 10,
  Comment: null
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
    jest.resetAllMocks()
  })
  it('getWorkout_noMonth', async () => {
    //console.log("Test getWorkout_noMonth output begin")
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
    jest.spyOn(db, 'addToExerciseHist').mockImplementation(() => { throw new InvalidExerciseException("Squat") })
    await expect(db.saveWorkout(w)).rejects.toThrow(new InvalidExerciseException("Squat"));
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
        [{ uri: ".big-dawg/data/1_2025.json", content: JSON.stringify(c) }]
    })
    jest.spyOn(db, 'addToExerciseHist').mockImplementation(() => { return })
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
    jest.spyOn(db, 'addToExerciseHist').mockImplementation(() => { return })
    await db.saveWorkout(w2) // returns nothing
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
    jest.spyOn(db, 'addToExerciseHist').mockImplementation(() => { return })
    await expect(db.saveWorkout(w3)).resolves.toBe(true)
  })
  it('addToExerciseHist_noSets', async () => {
    //console.log("Test addToExerciseHist output begin")
    let { db } = setupTest()
    await db.addToExerciseHist([], new Date()) // does nothing, returns nothing
  })
  it('addToExerciseHist_noSuchExercises', async () => {
    //console.log("Test noSuchExercise output begin")
    let { db } = setupTest()
    let spy = jest.spyOn(db, 'getExerciseHistory')
    spy.mockImplementationOnce(async () => { throw new InvalidExerciseException("Bench") })
    spy.mockImplementationOnce(async () => { throw new InvalidExerciseException("Squat") })
    await expect(db.addToExerciseHist([set1, set2, set1], new Date())).rejects.toThrow(new InvalidExerciseException(" Bench Squat"))
  })
  it('addToExerciseHist', async () => {
    //console.log("Test addTOExerciseHist output begin")
    const set4: Set = {
      Exercise_Name: "Bench",
      Weight: 230,
      Reps: 2,
      Comment: "Idk"
    }
    const w1 = {
      uri: ".big-dawg/data/Bench.json",
      content: JSON.stringify({ Exercise_Name: "Bench", Hist: [[set4, new Date(2025, 1, 1)], [set1, new Date(2025, 1, 1)]] })
    }
    const w2 = {
      uri: ".big-dawg/data/Squat.json",
      content: JSON.stringify({
        Exercise_Name: "Squat",
        Hist: [[set2, new Date(2025, 2, 1)], [set2, new Date(2025, 1, 1)], [set2, new Date(2025, 1, 1)], [set2, new Date(2025, 1, 1)]]
      })
    }
    let { db } = setupTest({ expected_wContents: [w1, w2] })
    let spy = jest.spyOn(db, 'getExerciseHistory')
    spy.mockImplementationOnce(async () => { return { Exercise_Name: "Bench", Hist: [] } })
    spy.mockImplementationOnce(async () => { throw new InvalidExerciseException("Dummy") })
    spy.mockImplementationOnce(async () => { return { Exercise_Name: "Squat", Hist: [[set1, new Date(2025, 1, 1)], [set2, new Date(2025, 2, 1)]] } })
    await expect(db.addToExerciseHist([set4, set2, set1, set2, set2, set3], new Date(2025, 1, 1))).rejects.toThrow(new InvalidExerciseException(" Dummy"))
  })
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
  it('deleteFromExerciseHist0', async () => {
    //console.log("Test saveExercise_alreadyExists output begin")
    let { db } = setupTest()
    await db.deleteFromExerciseHist([], new Date()) // doesn't return anything
  })
  it('deleteFromExerciseHist1', async () => {
    //console.log("Test saveExercise_alreadyExists output begin")
    const w = {
      uri: ".big-dawg/data/Bench.json",
      content: JSON.stringify({ Exercise_Name: "Bench", Hist: [[set1, new Date(2025, 1, 1)]] })
    }
    let { db } = setupTest({ expected_wContents: [w] })
    let spy = jest.spyOn(db, 'getExerciseHistory')
    spy.mockImplementationOnce(() => { return { Exercise_Name: "Bench", Hist: [[set1, new Date(2024, 1, 1)], [set1, new Date(2025, 1, 1)]] } })
    await db.deleteFromExerciseHist(["Bench"], new Date(2024, 1, 1, 1, 1, 1, 1)) // doesn't return anything
  })
  it('deleteFromExerciseHist4', async () => {
    //console.log("Test saveExercise_alreadyExists output begin")
    const w1 = {
      uri: ".big-dawg/data/Bench.json",
      content: JSON.stringify({ Exercise_Name: "Bench", Hist: [] })
    }
    const w2 = {
      uri: ".big-dawg/data/Squat.json",
      content: JSON.stringify({ Exercise_Name: "Squat", Hist: [[set2, new Date(2021, 11, 31)]] })
    }
    const w3 = {
      uri: ".big-dawg/data/Deadlift.json",
      content: JSON.stringify({ Exercise_Name: "Deadlift", Hist: [[set1, new Date(2021, 11, 31)]] })
    }
    const w4 = {
      uri: ".big-dawg/data/Pull up.json",
      content: JSON.stringify({ Exercise_Name: "Pull up", Hist: [[set1, new Date(2021, 11, 31)], [set2, new Date(2021, 11, 31)]] })
    }
    let { db } = setupTest({ expected_wContents: [w1, w2, w3, w4] })
    let spy = jest.spyOn(db, 'getExerciseHistory')
    spy.mockImplementationOnce(() => { return { Exercise_Name: "Bench", Hist: [] } })
    spy.mockImplementationOnce(() => { return { Exercise_Name: "Squat", Hist: [[set2, new Date(2021, 11, 31)]] } })
    spy.mockImplementationOnce(() => { return { Exercise_Name: "Deadlift", Hist: [[set1, new Date(2021, 11, 31)], [set2, new Date(2020, 11, 31)]] } })
    spy.mockImplementationOnce(() => {
      return {
        Exercise_Name: "Pull up", Hist: [[set1, new Date(2021, 11, 31)], [set2, new Date(2020, 11, 31)],
        [set2, new Date(2021, 11, 31)], [set1, new Date(2020, 11, 31)]]
      }
    })
    await db.deleteFromExerciseHist(["Bench", "Squat", "Deadlift", "Pull up"], new Date(2020, 11, 31)) // doesn't return anything
  })

})