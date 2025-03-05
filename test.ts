import { json_db } from './app/db/json_db';  // Import the class to test
import * as FileSystem from 'expo-file-system';  // Import expo-file-system (which will be mocked)

jest.mock('expo-file-system');  // Mock expo-file-system module

describe('json_db class', () => {
  let db : json_db;

  beforeEach(() => {
    db = new json_db();  // Create a fresh instance of json_db before each test
  });

  it('should return the mocked exercise list', async () => {
    // Arrange: Mock the response of readAsStringAsync
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValueOnce('{"exercises": ["pushup", "squat"]}');

    // Act: Call the getExerciseList method
    const result = await db.getExerciseList();

    // Assert: Check if the result matches the mocked response
    expect(result).toEqual({ exercises: ['pushup', 'squat'] });
  });
});