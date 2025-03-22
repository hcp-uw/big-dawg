import { DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout } from '../Types'
import { setupTest } from '../Testing-utils'

// consts for tests
const ex1: Exercise = {
  Exercise_Name: "Bench",
  Muscle_Group: "Chest",
  Comment: "Barbell"
}
const ex2: Exercise = {
  Exercise_Name: "Bench",
  Muscle_Group: "Chest",
  Comment: "Barbell"
}
const el: Exercise_List = {
  Chest: [ex1], Back: [], Legs: [], Triceps: [], Biceps: [], Shoulders: []
}

const el2: Exercise_List = {
  Chest: [ex2], Back: [], Legs: [ex1], Triceps: [], Biceps: [], Shoulders: []
}
describe('json_db Exercise Tests', () => {
  afterEach(() => {
    // resets mocked funcs created with spy on (used for mocked json_db funcs)
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('saveExercise_alreadyExists', async () => {
    console.log("Test saveExercise_alreadyExists output begin")
    let { db } = setupTest()
    await expect(db.saveExercise(ex1)).resolves.toBe(false)
  })

  it('saveExercise_emptyExerciseList', async () => {
    console.log("Test saveExercise_emptyExerciseList output begin")
    const w1 = { uri: ".big-dawg/data/Bench.json", content: "{\"Exercise_Name\":\"Bench\",\"Hist\":[]}" }
    const w2 = {
      uri: ".big-dawg/data/Exercise_List.json",
      content: JSON.stringify(el)
    }
    // change mock implementation setup
    let { db } = setupTest({ file_exists: false, expected_wContents: [w1, w2] })
    // test
    await expect(db.saveExercise(ex1)).resolves.toBe(true)
  })

  it('saveExercise_updatedExerciseList', async () => {
    console.log("Test saveExercise_updatedExerciseList output begin")
    const w1 = { uri: ".big-dawg/data/Bench.json", content: "{\"Exercise_Name\":\"Bench\",\"Hist\":[]}" }
    const w2 = {
      uri: ".big-dawg/data/Exercise_List.json",
      content: JSON.stringify(el2)
    }
    //  change mock implementation setup
    let { db } = setupTest({ file_exists: false, expected_wContents: [w1, w2] })
    jest.spyOn(db, 'getExerciseList').mockImplementation(() => Promise.resolve(
      { Chest: [], Back: [], Legs: [ex1], Triceps: [], Biceps: [], Shoulders: [] }
    ))
    // test
    await expect(db.saveExercise(ex2)).resolves.toBe(true)
  })
})