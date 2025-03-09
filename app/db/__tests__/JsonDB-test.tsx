import {DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout} from '../Types'

function setupTest(options = {}) {
  const defaults = {
    file_exists: true,
    // array of strings to be returned by func 
    expected_rContents: [],
    //array of record (uri: string, content: string)
    expected_wContents: [],
  }

  const config = {...defaults, ...options}
  const mocked_dir = "dataDir/"

  // Create the mock function with multiple implementations
  const readAsStringAsyncMock = jest.fn();
    
  // Set up implementations for each call
  if (config.expected_rContents && Array.isArray(config.expected_rContents)) {
    config.expected_rContents.forEach((exp_content) => {
      writeAsStringAsyncMock.mockImplementationOnce((_) => {
        return Promise.resolve(exp_content)
      })
    })
    
    // Add a default implementation for any additional calls
    readAsStringAsyncMock.mockImplementation(() => {
      return Promise.resolve("")
    })
  }

  // Create the mock function with multiple implementations
  const writeAsStringAsyncMock = jest.fn();
    
  // Set up implementations for each call
  if (config.expected_wContents && Array.isArray(config.expected_wContents)) {
    config.expected_wContents.forEach((expected) => {
      writeAsStringAsyncMock.mockImplementationOnce((path: string, actual_content: string ) => {
        expect(path).toBe(mocked_dir + expected.uri);
        expect(actual_content).toBe(expected.content);
        return Promise.resolve();
      });
    });
    
    // Add a default implementation for any additional calls
    writeAsStringAsyncMock.mockImplementation((path, actualContent) => {
      return Promise.resolve();
    });
  }
  
  // make jest mock the entire expo-filesystem module
  jest.doMock('expo-file-system', () => ({
    documentDirectory: mocked_dir,
    readAsStringAsync: readAsStringAsyncMock,
    writeAsStringAsync: writeAsStringAsyncMock,
    getInfoAsync: jest.fn(() => Promise.resolve({exists: config.file_exists})),
    makeDirectoryAsync: jest.fn()
  }))

  // Import modules after mocking
  const FS = require("expo-file-system")
  const {json_db} = require('../json_db')
  return {
    db: new json_db(),
    FS
  }
}

  describe('json_db Tests', () => {
    afterEach(() => {
      console.log("Test output end")
      // resets mocked funcs created with spy on (used for mocked json_db funcs)
      jest.resetModules()
      jest.clearAllMocks()
    })

    it('saveExercise_alreadyExists', async () => {
      console.log("Test saveExercise_alreadyExists output begin")
      const ex1: Exercise = {
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: "Barbell"
      }
      let {db} = setupTest() 
      await expect(db.saveExercise(ex1)).resolves.toBe(false)
    });

    it('saveExercise_emptyExerciseList', async () => {
      console.log("Test saveExercise_emptyExerciseList output begin")
      // constants / test data
      const ex1: Exercise = {
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: "Barbell"
      }
      const el: Exercise_List = {
        Chest:[{Exercise_Name: "Bench", Muscle_Group: "Chest", Comment: "Barbell"}],
        Back:[], Legs:[],Triceps:[], Biceps:[], Shoulders:[]
      }
      const w1 = {uri: ".big-dawg/data/Bench.json", content: "{\"Exercise_Name\":\"Bench\",\"Hist\":[]}"}
      const w2 = {uri: ".big-dawg/data/Exercise_List.json",
        content: JSON.stringify(el)
      }

      // change mock implementation setup
      let {db} = setupTest({file_exists: false, expected_wContents: [w1, w2]}) 
      // test
      await expect(db.saveExercise(ex1)).resolves.toBe(true)
    });

    it('saveExercise_updatedExerciseList', async () => {
      console.log("Test saveExercise_updatedExerciseList output begin")
      // constants/ test data
      const ex1: Exercise = {
        Exercise_Name: "Squat",
        Muscle_Group: "Legs",
        Comment: "Dope"
      }
      const ex2: Exercise = {
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: "Barbell"
      }
      const el: Exercise_List = {Chest:[ex2],Back:[], Legs:[ex1], Triceps:[], Biceps:[], Shoulders:[]}
      const w1 = {uri: ".big-dawg/data/Bench.json", content: "{\"Exercise_Name\":\"Bench\",\"Hist\":[]}"}
      const w2 = {uri: ".big-dawg/data/Exercise_List.json",
        content: JSON.stringify(el)
      }
       //  change mock implementation setup
      let {db} = setupTest({file_exists: false, expected_wContents: [w1, w2]}) 
      jest.spyOn(db, 'getExerciseList').mockImplementation(() => Promise.resolve(
        { Chest:[],Back:[],Legs:[ex1], Triceps:[], Biceps:[],Shoulders:[] }
      ));
      // test
      await expect(db.saveExercise(ex2)).resolves.toBe(true)
    });
  });