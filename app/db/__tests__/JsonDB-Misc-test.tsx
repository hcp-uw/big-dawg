import { DB, Muscle_Group, Exercise, Exercise_List, Set, Exercise_Hist, Workout } from '../Types'
import { setupTest } from '../Testing-utils'

describe('json_db Misc/Rest Tests', () => {
    afterEach(() => {
        //console.log("Test output end")
        // resets mocked funcs created with spy on (used for mocked json_db funcs)
        jest.resetModules()
        jest.clearAllMocks()
    })
    it('getCalendarView', async () => {
        // TO DO
    })
})