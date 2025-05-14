import { WorkoutPreset, Set, Exercise, Exercise_List, InvalidExerciseException } from '../Types'
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

describe('json_db WorkoutPreset Tests', () => {
    afterEach(() => {
        // resets mocked funcs created with spy on (used for mocked json_db funcs)
        jest.resetModules()
        jest.resetAllMocks()
    })
    // ------ saveWorkoutPreset() tests ------
    // the exercise already exists
    it('savePreset_normal', async () => {
        const wp = {
            Name: "My preset",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        let { db } = setupTest({
            file_exists: false, expected_wContents:
                [{ uri: ".big-dawg/data/WorkoutPresets.json", content: JSON.stringify([wp]) }]
        })
        jest.spyOn(db, 'getExerciseList').mockImplementationOnce(() => Promise.resolve(
            structuredClone(el)
        ))
        await expect(db.saveWorkoutPreset(wp)).resolves.toBe(false)
    })

    it('savePreset_update', async () => {
        const wp = {
            Name: "My preset",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        const wp2 = {
            Name: "My prese",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        const wp_old = {
            Name: "My preset",
            Comment: "This is my preset",
            Preset: [set1]
        }
        let { db } = setupTest({
            file_exists: true, expected_rContents: [JSON.stringify([wp2, wp_old])], expected_wContents:
                [{ uri: ".big-dawg/data/WorkoutPresets.json", content: JSON.stringify([wp2, wp]) }]
        })
        jest.spyOn(db, 'getExerciseList').mockImplementationOnce(() => Promise.resolve(
            structuredClone(el)
        ))
        await expect(db.saveWorkoutPreset(wp)).resolves.toBe(true)
    })

    it('savePreset_exception', async () => {
        const wp = {
            Name: "My preset",
            Comment: "This is my preset",
            Preset: [{
                Exercise_Name: "Deadlif",
                Weight: 365,
                Reps: 7,
                Comment: null
            }]
        }
        let { db } = setupTest({
            file_exists: true
        })
        jest.spyOn(db, 'getExerciseList').mockImplementationOnce(() => Promise.resolve(
            structuredClone(el)
        ))
        await expect(db.saveWorkoutPreset(wp)).rejects.toThrow(new InvalidExerciseException("Deadlif"))
    })

    // ------ getWorkoutPreset() tests ------
    it('getWorkoutPreset_noFile', async () => {
        //console.log("Test getWorkoutPreset_noMonth output begin")
        let { db } = setupTest({ file_exists: false })
        await expect(db.getWorkoutPreset("My Preset")).resolves.toBe(null)
    })
    it('getWorkoutPreset_doesn\'t Exist', async () => {
        //console.log("Test getWorkoutPreset_doesn\'t Exist output begin")
        const wp2 = {
            Name: "My prese",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify([wp2])] })
        await expect(db.getWorkoutPreset("My preset")).resolves.toBe(null)
    })
    it('getWorkoutPreset_exists', async () => {
        //console.log("Test getWorkoutPreset_exists output begin")
        const wp = {
            Name: "My preset",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        const wp2 = {
            Name: "My prese",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify([wp2, wp])] })
        await expect(db.getWorkoutPreset("My preset")).resolves.toStrictEqual(wp)
    })
    // ------ getWorkoutPresetList() tests ------
    it('getWorkoutPresetList_noFile', async () => {
        //console.log("Test getWorkoutPreset_noMonth output begin")
        let { db } = setupTest({ file_exists: false })
        await expect(db.getWorkoutPresetList()).resolves.toStrictEqual([])
    })
    it('getWorkoutPreset_empty', async () => {
        //console.log("Test getWorkoutPreset_exists output begin")
        let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify([])] })
        await expect(db.getWorkoutPresetList()).resolves.toStrictEqual([])
    })
    it('getWorkoutPreset_exists', async () => {
        //console.log("Test getWorkoutPreset_exists output begin")
        const wp = {
            Name: "My preset",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        const wp2 = {
            Name: "My prese",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify([wp2, wp])] })
        await expect(db.getWorkoutPresetList()).resolves.toStrictEqual([wp2, wp])
    })

    // ------ deleteWorkoutPreset() tests ------
    it('deleteWorkoutPreset_noFile', async () => {
        //console.log("Test deleteWorkoutPreset_noFile output begin")
        let { db } = setupTest({ file_exists: false })
        await expect(db.deleteWorkoutPreset("Test")).resolves.toBe(false)
    })
    it('deleteWorkoutPreset_noWorkout', async () => {
        const wp = {
            Name: "My preset",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        const wp2 = {
            Name: "My prese",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        let { db } = setupTest({ expected_rContents: [JSON.stringify([wp, wp2])] })
        await expect(db.deleteWorkoutPreset("test")).resolves.toBe(false)
    })
    it('deleteWorkoutPreset', async () => {
        const wp = {
            Name: "My preset",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        const wp2 = {
            Name: "My prese",
            Comment: "This is my preset",
            Preset: [set1, set1, set2, set3, set2]
        }
        let { db } = setupTest({
            expected_rContents: [JSON.stringify([wp2, wp])],
            expected_wContents: [{ uri: ".big-dawg/data/WorkoutPresets.json", content: JSON.stringify([wp2]) }]
        })
        await expect(db.deleteWorkoutPreset("My preset")).resolves.toBe(true)
    })
})