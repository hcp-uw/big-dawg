import {DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout, InvalidDateException} from '../Types'
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
    Sets: [set1, set1, set1],
    WorkoutComment: "Good workout"
}

const w3: Workout = {
    Date: new Date(2025, 3, 1),
    TimeStarted: 8,
    TimeEnded: 10,
    Sets: [set2, set2, set2, set2],
    WorkoutComment: "Bad workout"
}

const el: Exercise_List = {
    Chest: [ex1], Back: [], Legs: [ex2], Triceps: [], Biceps: [], Shoulders: []
}

describe('json_db Misc/Rest Tests', () => {
    afterEach(() => {
        // console.log("Test output end")
        // resets mocked funcs created with spy on (used for mocked json_db funcs)
        jest.resetModules()
        jest.clearAllMocks()
    })

    // simple test, the only recorded workout of the month requested is the first day
    it('getCalendarView_simpleOneDay', async () => {
        // setup
        let c1 = [
            w, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null]

        // the function first reads the 4_2025.json file, then reads the Exercise_List.json file
        // the function makes no file writes, only two reads.
        //const r1 = { uri: ".big-dawg/data/4_2025.json", content: JSON.stringify(c1) }
        //const r2 = { uri: ".big-dawg/data/Exercise_List.json", content: JSON.stringify(el) }
        let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify(c1)]})
        jest.spyOn(db, 'getExerciseList').mockImplementation(() => Promise.resolve(
            { Chest: [ex1], Back: [], Legs: [ex2], Triceps: [], Biceps: [], Shoulders: [] }
        ))

        let muscleGroups = [
            ["Chest", "Legs"], [], [], [], [], [], [], [], [], [],
            [], [], [], [], [], [], [], [], [], [],
            [], [], [], [], [], [], [], [], [], []
        ]

        await expect(db.getCalendarView(4, 2025)).resolves.toStrictEqual(muscleGroups)
    })

    // complex test, many workouts recorded throughout the month
    it('getCalendarView_complexManyDays', async () => {
        // setup
        let c1 = [
            w, null, w3, null, w2, w, null, null, null, null,
            w2, w, w3, null, w2, w, w2, w2, null, null,
            null, w2, w2, null, w3, w3, null, null, null, w]

        let { db } = setupTest({ file_exists: true, expected_rContents: [JSON.stringify(c1)]})
        jest.spyOn(db, 'getExerciseList').mockImplementation(() => Promise.resolve(
            { Chest: [ex1], Back: [], Legs: [ex2], Triceps: [], Biceps: [], Shoulders: [] }
        ))

        let muscleGroups = [
            ["Chest", "Legs"], [], ["Legs"], [], ["Chest"], ["Chest", "Legs"], [], [], [], [],
            ["Chest"], ["Chest", "Legs"], ["Legs"], [], ["Chest"], ["Chest", "Legs"], ["Chest"], ["Chest"], [], [],
            [], ["Chest"], ["Chest"], [], ["Legs"], ["Legs"], [], [], [], ["Chest", "Legs"]
        ]

        await expect(db.getCalendarView(4, 2025)).resolves.toStrictEqual(muscleGroups)
    })

    // testing that an illegal date, like the 13th month 2025, leads to an exception
    it('getCalendarView_illegalDate', async () => {
        // setup
        let { db } = setupTest({ file_exists: true })
        
        const month: bigint = 13n  // month 13 not in range 1-12 inclusive
        const year: bigint = 2025n

        await expect(db.getCalendarView(month, year)).rejects.toThrow(new InvalidDateException(month, year))
    })

    // testing that a legal date that doesn't have a recorded workout session (i.e. .json file does not exist for the given day)
    // leads to an empty 1d array
    it('getCalendarView_noDateRecord', async () => {
        // setup
        let { db } = setupTest({ file_exists: false })

        const month: bigint = 11n
        const year: bigint = 2025n

        await expect(db.getCalendarView(month, year)).resolves.toStrictEqual([])
    })
})
