export function setupTest(options = {}) {
  const defaults = {
    file_exists: true,
    // array of strings to be returned by func 
    expected_rContents: [],
    //array of record (uri: string, content: string)
    expected_wContents: [],
  }

  const config = { ...defaults, ...options }
  const mocked_dir = "dataDir/"

  // Create the mock function with multiple implementations
  const readAsStringAsyncMock = jest.fn()

  // Set up implementations for each call
  if (config.expected_rContents && Array.isArray(config.expected_rContents)) {
    config.expected_rContents.forEach((exp_content) => {
      readAsStringAsyncMock.mockImplementationOnce((_) => {
        return Promise.resolve(exp_content)
      })
    })

    // Add a default implementation for any additional calls
    readAsStringAsyncMock.mockImplementation(() => {
      return Promise.resolve("")
    })
  }

  // Create the mock function with multiple implementations
  const writeAsStringAsyncMock = jest.fn()

  // Set up implementations for each call
  if (config.expected_wContents && Array.isArray(config.expected_wContents)) {
    config.expected_wContents.forEach((expected) => {
      writeAsStringAsyncMock.mockImplementationOnce((path: string, actual_content: string) => {
        expect(path).toBe(mocked_dir + expected.uri)
        expect(actual_content).toBe(expected.content)
        return Promise.resolve()
      })
    })

    // Add a default implementation for any additional calls
    writeAsStringAsyncMock.mockImplementation((path, actualContent) => {
      return Promise.resolve()
    })
  }

  // make jest mock the entire expo-filesystem module
  jest.doMock('expo-file-system', () => ({
    documentDirectory: mocked_dir,
    readAsStringAsync: readAsStringAsyncMock,
    writeAsStringAsync: writeAsStringAsyncMock,
    getInfoAsync: jest.fn(() => Promise.resolve({ exists: config.file_exists })),
    makeDirectoryAsync: jest.fn()
  }))

  // Import modules after mocking
  const FS = require("expo-file-system")
  const { json_db } = require('./json_db')
  return {
    db: new json_db(),
    FS
  }
}