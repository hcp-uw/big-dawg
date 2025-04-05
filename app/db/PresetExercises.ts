import { Exercise } from "./Types"

// Contains 30 default exercises: 5 for each muscle group
export let defaultExercises: Exercise[];

// Chest exercises
const ex1: Exercise = {
    Exercise_Name: "Barbell Bench Press",
    Muscle_Group: "Chest",
    Comment: "Primarily targets overall chest. Secondary movers are front delts and triceps"
}

const ex2: Exercise = {
    Exercise_Name: "Incline dumbbell press",
    Muscle_Group: "Chest",
    Comment: "Primarily targets chest, biasing upper chest. Secondary movers are front delts and triceps"
}

const ex3: Exercise = {
    Exercise_Name: "Weighted Dips",
    Muscle_Group: "Chest",
    Comment: "Primarily targets chest, biasing lower chest. Secondary movers are front delts and triceps"
}

const ex4: Exercise = {
    Exercise_Name: "Pec deck machine",
    Muscle_Group: "Chest",
    Comment: "Chest isolation"
}

const ex5: Exercise = {
    Exercise_Name: "Push-ups",
    Muscle_Group: "Chest",
    Comment: "Primarily targets overall chest. Secondary movers are front delts and triceps"
}

// Back exercises
const ex6: Exercise = {
    Exercise_Name: "Seated cable row",
    Muscle_Group: "Back",
    Comment: "Can performed to train either lats or upper back"
}

const ex7: Exercise = {
    Exercise_Name: "Pull-ups",
    Muscle_Group: "Back",
    Comment: "Biases lats but can be performed to bias upper back"
}

const ex8: Exercise = {
    Exercise_Name: "Lat pulldown",
    Muscle_Group: "Back",
    Comment: "Trains lats"
}

const ex9: Exercise = {
    Exercise_Name: "Bent-over barbell row",
    Muscle_Group: "Back",
    Comment: "Compound that trains entire back, primarily engaging upper back"
}

// Legs exercises
const ex10: Exercise = {
    Exercise_Name: "Barbell squat",
    Muscle_Group: "Legs",
    Comment: "Compound that primarily trains quads and glutes. Also engages adductors"
}

const ex11: Exercise = {
    Exercise_Name: "Barbell Deadlift",
    Muscle_Group: "Legs",
    Comment: "Compound that trains entire posterior chain, including glutes, hamstrings, and erectors."
}

const ex12: Exercise = {
    Exercise_Name: "Barbell Romanian deadlift (RDL)",
    Muscle_Group: "Legs",
    Comment: "Hip Hinge compound primarily targeting the hamstrings and glutes. Engages entire posterior chain"
}

const ex13: Exercise = {
    Exercise_Name: "Leg press",
    Muscle_Group: "Legs",
    Comment: "Compound that trains quads and glutes, bias depends on setup. Engages adductors"
}

const ex14: Exercise = {
    Exercise_Name: "Bulgarian split squat",
    Muscle_Group: "Legs",
    Comment: "Unilateral exercise training quads and glutes. Bias depends on setup"
}

const ex15: Exercise = {
    Exercise_Name: "Seated leg curl",
    Muscle_Group: "Legs",
    Comment: "Hamstring isolation exercise"
}

// Triceps exercises
const ex16: Exercise = {
    Exercise_Name: "Cable Tricep Pushdown",
    Muscle_Group: "Triceps",
    Comment: null
}

const ex17: Exercise = {
    Exercise_Name: "Close-grip Barbell Bench Press",
    Muscle_Group: "Triceps",
    Comment: "Compound that targets triceps. Secondarily trains front delts and chest"
}

const ex18: Exercise = {
    Exercise_Name: "Overhead dumbbell extension",
    Muscle_Group: "Triceps",
    Comment: null
}

const ex19: Exercise = {
    Exercise_Name: "Skull crushers",
    Muscle_Group: "Triceps",
    Comment: null
}

// Biceps exercises
const ex20: Exercise = {
    Exercise_Name: "Dumbbell Bicep Curl",
    Muscle_Group: "Biceps",
    Comment: null
}

const ex21: Exercise = {
    Exercise_Name: "Barbell Curl",
    Muscle_Group: "Biceps",
    Comment: null
}

const ex22: Exercise = {
    Exercise_Name: "Hammer Curl",
    Muscle_Group: "Biceps",
    Comment: "Targets biceps, brachialis, and forearms"
}

const ex23: Exercise = {
    Exercise_Name: "Preacher curl",
    Muscle_Group: "Biceps",
    Comment: null
}

const ex24: Exercise = {
    Exercise_Name: "Cable Curl",
    Muscle_Group: "Biceps",
    Comment: null
}


// Shoulders exercises
const ex25: Exercise = {
    Exercise_Name: "Reverse Pec Deck",
    Muscle_Group: "Shoulders",
    Comment: "Targets rear delts"
}

const ex26: Exercise = {
    Exercise_Name: "Seated Dumbbell Shoudler Press",
    Muscle_Group: "Shoulders",
    Comment: "Compound that targets shoulders, primarily front delt. Engages triceps"
}

const ex27: Exercise = {
    Exercise_Name: "Dumbell Lateral Raises",
    Muscle_Group: "Shoulders",
    Comment: "Shoulder isolation that biases the lateral (side) delts"
}

const ex28: Exercise = {
    Exercise_Name: "Cable Rear Delt Flyes",
    Muscle_Group: "Shoulders",
    Comment: "Targets rear delts"
}

const ex29: Exercise = {
    Exercise_Name: "Barbell Overhead Press (OHP)",
    Muscle_Group: "Shoulders",
    Comment: "Performed standing. Compound movement targeting shoulders (primarily front delts) and training triceps"
}

defaultExercises = [
    ex1, ex2, ex3, ex4, ex5,
    ex6, ex7, ex8, ex9, ex10,
    ex11, ex12, ex13, ex14, ex15,
    ex16, ex17, ex18, ex19, ex20,
    ex21, ex22, ex23, ex24, ex25,
    ex26, ex27, ex28, ex29
]
