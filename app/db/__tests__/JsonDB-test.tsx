import {json_db} from '../json_db'
import {DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout} from '../Types'
import * as FS from "expo-file-system";

// make jest mock the entire expo-filesystem and set a directory for 
jest.mock('expo-file-system', () => ({
    readAsStringAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
    deleteAsync: jest.fn(),
    makeDirectoryAsync: jest.fn(),
    moveAsync: jest.fn(),
    copyAsync: jest.fn(),
    getInfoAsync: jest.fn(() => Promise.resolve({ exists: false, isDirectory: false, size: 1024 })),
    // Add other functions as needed*/
    
    documentDirectory: "./JsonDB-test-files"
  }));

  describe('json_db Tests', () => {
    let db: DB;

    beforeEach(() => {
      db = new json_db();
    });

    it('saveExercise1', async () => {
      // Test insertion logic
      const ex1: Exercise = {
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: "Barbell"
      };
      await expect(db.saveExercise(ex1)).resolves.toBe(true);
    });
  });
