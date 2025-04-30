import { WorkoutPreset, Set, Exercise, Exercise_List } from '../Types'
import { setupTest } from '../Testing-utils'

const set1: Set = {
    Exercise_Name: "Squat",
    Weight: 275,
    Reps: 7,
    Comment: null
}
const set2: Set = {
    Exercise_Name: "Bench",
    Weight: 200,
    Reps: 3,
    Comment: "Idk"
}
const set3: Set = {
    Exercise_Name: "Deadlift",
    Weight: 365,
    Reps: 7,
    Comment: null
}

const el: Exercise_List = {
    Chest: [{
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: null
    }],
    Back: [{
        Exercise_Name: "Deadlift",
        Muscle_Group: "Back",
        Comment: null
    }],
    Legs: [{
        Exercise_Name: "Squat",
        Muscle_Group: "Legs",
        Comment: "test"
    }],
    Triceps: [],
    Biceps: [],
    Shoulders: []
}

describe('json_db Exercise Tests', () => {
    afterEach(() => {
        // resets mocked funcs created with spy on (used for mocked json_db funcs)
        jest.resetModules()
        jest.resetAllMocks()
    })
    // ------ saveWorkoutPreset() tests ------
    // the exercise already exists
    it('saveExercise_normal', async () => {
        const wp = {
            Name: "My preset",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        let { db } = setupTest({
            file_exists: false, expected_wContents:
                [{ uri: "WorkoutPresets.json", content: JSON.stringify([wp]) }]
        })
        jest.spyOn(db, 'getExerciseList').mockImplementationOnce(() => Promise.resolve(
            structuredClone(el)
        ))
        await expect(db.saveWorkoutPreset(wp)).resolves.toBe(false)
    })
    // ------ getWorkoutPreset() tests ------
    // ------ deleteWorkoutPreset() tests ------
})