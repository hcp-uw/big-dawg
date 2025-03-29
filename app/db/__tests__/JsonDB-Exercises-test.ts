import { Exercise, Exercise_List, Exercise_Hist } from '../Types'
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
  Comment: "Barbell"
}
const el: Exercise_List = {
  Chest: [ex1], Back: [], Legs: [], Triceps: [], Biceps: [], Shoulders: []
}

const el2: Exercise_List = {
  Chest: [ex1], Back: [], Legs: [ex2], Triceps: [], Biceps: [], Shoulders: []
}

const Bench: Exercise_Hist = {
  Exercise_Name: "Bench",
  Hist: []
}

const emptyList: Exercise_List = {
  Chest: [], Back: [], Legs: [], Triceps: [], Biceps: [], Shoulders: []
}

const Squat: Exercise_Hist = {
  Exercise_Name: "Squat",
  Hist: []
}


// ----- test ------

describe('json_db Exercise Tests', () => {
  afterEach(() => {
    // resets mocked funcs created with spy on (used for mocked json_db funcs)
    jest.resetModules()
    jest.resetAllMocks()
  })

  // ------ saveExercise() test ------
  // the exercise already exists
  it('saveExercise_alreadyExists', async () => {
    //console.log("Test saveExercise_alreadyExists output begin")
    let { db } = setupTest()
    jest.spyOn(db, 'getExerciseList').mockImplementationOnce(() => Promise.resolve(
      el
    ))
    await expect(db.saveExercise(ex1)).resolves.toBe(false)
  })

  // the exerciseList doesn't contain that exercise
  it('saveExercise_brandNew', async () => {
    //console.log("Test saveExercise_emptyExerciseList output begin")
    const w1 = {
      uri: ".big-dawg/data/Exercise_List.json",
      content: JSON.stringify(el)
    }
    const w2 = { uri: ".big-dawg/data/Bench.json", content: "{\"Exercise_Name\":\"Bench\",\"Hist\":[]}" }
    // change mock implementation setup
    let { db } = setupTest({ file_exists: false, expected_wContents: [w1, w2] })
    jest.spyOn(db, 'getExerciseList').mockImplementationOnce(() => Promise.resolve({
      Chest: [], Back: [], Legs: [], Triceps: [], Biceps: [], Shoulders: []
    }))
    // test
    await expect(db.saveExercise(ex1)).resolves.toBe(true)
  })

  // exerciseList needs to be updated for that exercise
  it('saveExercise_updatedExerciseList', async () => {
    //console.log("Test saveExercise_updatedExerciseList output begin")
    const w1 = {
      uri: ".big-dawg/data/Exercise_List.json",
      content: JSON.stringify(el2)
    }
    const w2 = { uri: ".big-dawg/data/Squat.json", content: "{\"Exercise_Name\":\"Squat\",\"Hist\":[]}" }
    //  change mock implementation setup
    let { db } = setupTest({ file_exists: false, expected_wContents: [w1, w2] })
    jest.spyOn(db, 'getExerciseList').mockImplementationOnce(() => Promise.resolve(el))
    // test
    await expect(db.saveExercise(ex2)).resolves.toBe(true)
  })

  // -----getExerciseList tests-----
  // I think we are assuming that Exercise_List does exist but...
  // test for Exercise_List.json doesn't exist
  it('getExerciseList_noExerciseList', async () => {
    //console.log("Test getExerciseList_noExerciseList output begin")
    let { db } = setupTest({
      file_exists: false
    })
    await expect(db.getExerciseList()).resolves.toStrictEqual(emptyList)
  })

  //getExerciseList for empty list
  it('getExerciseList_empty', async () => {
    //console.log("Test getExerciseList_empty output begin")
    let { db } = setupTest({
      file_exists: true, expected_rContents: [JSON.stringify(emptyList)]
    });
    await expect(db.getExerciseList()).resolves.toStrictEqual(emptyList)
  })

  // for non-empty list
  it('getExerciseList_nonEmpty', async () => {
    //console.log("Test getExerciseList_nonEmpty output begin")
    let { db } = setupTest({
      file_exists: true,
      expected_rContents: [JSON.stringify(el)]
    });
    // Verify that the expected writes occurred
    await expect(db.getExerciseList()).resolves.toStrictEqual(el);
  })

  // -----getExerciseHistory tests-----
  // I think we are assuming that Exercise_Hist.json does exist but...
  // test for Exercise_Hist.json doesn't exist
  it('getExerciseHistory_noExerciseHist', async () => {
    //console.log("Test getExerciseHistory_noExerciseHist output begin")
    let { db } = setupTest({
      file_exists: false
    })
    await expect(db.getExerciseHistory("Bench")).rejects.toThrow("Invalid exercise: Bench")
  })

  // getExerciseHistory for an exercise that does exist
  it('getExerciseHistory_fileExists', async () => {
    let { db } = setupTest({
      file_exists: true, expected_rContents: [JSON.stringify(Squat)]
    });
    await expect(db.getExerciseHistory("Squat")).resolves.toStrictEqual(Squat);
  })

})
