import { StyleSheet } from 'react-native';
import colors from './themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    backgroundColor: colors.BUTTON_COLOR,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    color: colors.BUTTON_TEXT,
    textAlign: 'center',
  },

  // containers for the dual search function
  searchContainer: {
    flex: 1,
    flexDirection: "row", // Puts FlatLists side by side
  },
  flatList: {
    flex: 1, // Each FlatList takes half the screen
    marginHorizontal: 10, // Optional spacing between the lists
  },
  searchItem: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.BUTTON_COLOR,
    borderRadius: 20,
    borderBottomColor: colors.BUTTON_COLOR,
    color: colors.BUTTON_TEXT,
  },
  // text at the top of the page
  headerText: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.WHITE,
    padding: 10,
    paddingLeft: 20,
  },
  // Search box input
  input: {
    height: 40,
    width: '96%',
    backgroundColor: colors.BUTTON_COLOR,
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    color: colors.BUTTON_TEXT,
    borderRadius: 10,
  }, 
});