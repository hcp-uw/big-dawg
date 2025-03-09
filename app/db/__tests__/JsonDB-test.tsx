import {json_db} from '../json_db'
import {DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout} from '../Types'
import * as FS from "expo-file-system";

// make jest mock the entire expo-filesystem module
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn((uri: string, content: string) => console.log("saving: file: " + uri + " Content: " + content)),
  makeDirectoryAsync: jest.fn(),
  getInfoAsync: jest.fn(() => Promise.resolve({exists: true})),
  documentDirectory: "DataDir"
}));

  describe('json_db Tests', () => {
    let db: DB;

    beforeEach(() => {
      db = new json_db();
      // resets mocked funcs created with spy on (used for mocked json_db funcs)
      jest.restoreAllMocks()
      // reset jest mocked funcs that are test specific back to default
      FS.getInfoAsync.mockImplementation(() => Promise.resolve({exists: true}))
      FS.readAsStringAsync.mockImplementation(() => {})
    })

    afterEach(() => {
      console.log("Test output end")
    })

    it('saveExercise_alreadyExists', async () => {
      console.log("Test saveExercise_alreadyExists output begin")
      const ex1: Exercise = {
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: "Barbell"
      };
      await expect(db.saveExercise(ex1)).resolves.toBe(false)
    });

    it('saveExercise_emptyExerciseList', async () => {
      console.log("Test saveExercise_emptyExerciseList output begin")
      // change mock implementation
      FS.getInfoAsync.mockImplementation(() => Promise.resolve({exists: false}));
      const ex1: Exercise = {
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: "Barbell"
      }
      await expect(db.saveExercise(ex1)).resolves.toBe(true)
    });

    it('saveExercise_updatedExerciseList', async () => {
      console.log("Test saveExercise_updatedExerciseList output begin")
      FS.getInfoAsync.mockImplementation(() => Promise.resolve({exists: false}));
      jest.spyOn(db, 'getExerciseList').mockImplementation(() => Promise.resolve(
        { Chest:[],Back:[],
          Legs:[{Exercise_Name:"Squat",Muscle_Group:"Legs",Comment: "Barbell"}],
          Triceps:[], Biceps:[],Shoulders:[] }
      ));
      const ex1: Exercise = {
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: "Barbell"
      }
      await expect(db.saveExercise(ex1)).resolves.toBe(true)
    });
  });
