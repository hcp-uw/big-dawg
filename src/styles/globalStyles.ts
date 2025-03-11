import { StyleSheet } from 'react-native';
import colors from './themes/colors';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    backgroundColor: colors.BLACK,
    borderWidth: 1,
    borderColor: colors.WHITE,
    padding: 10,
    borderRadius: 20,
    marginBottom: 0,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    color: colors.WHITE,
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
    backgroundColor: colors.BLACK,
    borderRadius: 20,
    borderBottomColor: colors.WHITE,
    color: colors.WHITE,
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
    backgroundColor: colors.BLACK,
    borderWidth: 2,
    borderColor: colors.WHITE,
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    color: colors.WHITE,
  }, 
  
  // HEADER STYLES (IMPORTED FROM HOME PAGE)
  headerContainer: {
    backgroundColor: colors.BLACK,
  },
  header: {
    backgroundColor: colors.BLACK,
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: "center",
    paddingHorizontal: 20,
    height: 50,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.WHITE,
    marginLeft: 12,
  },
  subHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.WHITE,
  },

  // BACK BUTTON CONTAINER
  backContainer: {
    backgroundColor: colors.BLACK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});