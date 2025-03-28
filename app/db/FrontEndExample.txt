/*
import {json_db} from './json_db' // import implementation of json_db
import {DB, Workout, Set} from './Types'

function SaveWorkout_Example(myDB : DB) {
    // get info from user
    let mySets: Set[] = []
    let commment: String = "Good workout" // would get from html form when user submits
    
    // here imagine through user input we get a set
    let userSet: Set = {
        Exercise_Name : "Bench",
        Weight : 135.5,
        Reps : BigInt(10),
        Comment : null} // Comment can be string or null if no comment for that set
    mySets.push(userSet);

    // now we want to save workout
    let w: Workout = {
        Date : getCurrDate(),
        TimeStarted : BigInt(190), //in minutes idk we have to figure that out
        TimeEnded : BigInt(290),
        Sets : mySets, // stores reference to array
        // Sets : [...mySets], // stores copy of array
        WorkoutComment : null}
    // if user clicks save workout button or goes to a different page
    myDB.saveWorkout(w)

    // if we save another workout for that same date later it will overwrite/replace the old one
    // we have 2 options

    //1: keep track of old info and update with that
    
    // user inputs new set for example
    mySets.push(userSet)
    // update in memory struct and save it
    //w.Sets = [...mySets] only needed if we stored a copy
    myDB.saveWorkout(w)

    // 2: Or we can get the old one and uodate it
    // good example for calendar
    w = myDB.getWorkout(currDate()) as Workout
    w.Sets = mySets
    myDB.saveWorkout(w)

    // Potentially Bad: we overwrite old info ie we lose original w
    let w2: Workout = {
        Date : getCurrDate(), // smame date as w
        TimeStarted : BigInt(190), //in minutes idk we have to figure that out
        TimeEnded : BigInt(290),
        Sets : [userSet], // stores reference to array
        WorkoutComment : null}
    myDB.saveWorkout(w2) // now for this date we have 1 userSet instead of 2



}

const db: DB = new json_db()
SaveWorkout_Example(db)
*/