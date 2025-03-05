// __mocks__/expo-file-system.js

// Mock the `expo-file-system` module
module.exports = {
    // Mock `readAsStringAsync` to return a resolved promise with a JSON string
    readAsStringAsync: jest.fn().mockResolvedValueOnce('{"exercises": ["pushup", "squat"]}'),
  };