import {DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout} from '../Types'

function setupTest(options = {}) {
  const defaults = {
    file_exists: true,
    expected_uri: ".big-dawg/data/",
    expected_wContent: "",
    expected_rContent: "",
    readContent: ""
  }

  const config = {...defaults, ...options}
  const mocked_dir = "dataDir/"

  // make jest mock the entire expo-filesystem module
  jest.doMock('expo-file-system', () => ({
    documentDirectory: mocked_dir,
    readAsStringAsync: jest.fn(), //=> //config.expected_rContent),
    writeAsStringAsync: jest.fn((path: string, content: string) => 
      { //expect(path).toBe(mocked_dir + config.expected_uri)
        //expect(content).toBe(config.expected_wContent)
      }),
    makeDirectoryAsync: jest.fn(),
    getInfoAsync: jest.fn(() => Promise.resolve({exists: config.file_exists}))
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
      let {db} = setupTest() 
      const ex1: Exercise = {
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: "Barbell"
      };
      await expect(db.saveExercise(ex1)).resolves.toBe(false)
    });

    it('saveExercise_emptyExerciseList', async () => {
      console.log("Test saveExercise_emptyExerciseList output begin")
      // change mock implementation setup
      let {db} = setupTest({file_exists: false}) 
      const ex1: Exercise = {
        Exercise_Name: "Bench",
        Muscle_Group: "Chest",
        Comment: "Barbell"
      }
      await expect(db.saveExercise(ex1)).resolves.toBe(true)
    });

    it('saveExercise_updatedExerciseList', async () => {
      console.log("Test saveExercise_updatedExerciseList output begin")
      let {db} = setupTest({file_exists: false})
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
