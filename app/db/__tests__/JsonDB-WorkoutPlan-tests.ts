import { WorkoutPreset, Set, Exercise } from '../Types'
import { setupTest } from '../Testing-utils'

describe('json_db Exercise Tests', () => {
    afterEach(() => {
        // resets mocked funcs created with spy on (used for mocked json_db funcs)
        jest.resetModules()
        jest.resetAllMocks()
    })
    // ------ saveWorkoutPreset() tests ------
    // the exercise already exists
    it('saveExercise_alreadyExists', async () => {
        //console.log("Test saveExercise_alreadyExists output begin")
        let { db } = setupTest()
        jest.spyOn(db, 'getExerciseList').mockImplementationOnce(() => Promise.resolve(
            structuredClone(el)
        ))
        await expect(db.saveExercise(ex1)).resolves.toBe(false)
    })
    // ------ getWorkoutPreset() tests ------
    // ------ deleteWorkoutPreset() tests ------
})