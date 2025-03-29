import { Exercise } from "./Types"

// Contains 30 default exercises: 5 for each muscle group
export let defaultExercises: Exercise[];

// Chest exercises
const ex1: Exercise = {
    Exercise_Name: "Barbell bench press",
    Muscle_Group: "Chest",
    Comment: "A fundamental compound movement that targets the chest, triceps, and shoulders."
}

const ex2: Exercise = {
    Exercise_Name: "Incline dumbbell press",
    Muscle_Group: "Chest",
    Comment: "Emphasizes the upper chest and requires stabilization from the shoulders and triceps."
}

const ex3: Exercise = {
    Exercise_Name: "Chest dips",
    Muscle_Group: "Chest",
    Comment: "Great for developing lower chest strength and size when performed with a forward lean."
}

const ex4: Exercise = {
    Exercise_Name: "Pec deck machine",
    Muscle_Group: "Chest",
    Comment: "Isolates the chest muscles by minimizing triceps involvement."
}

const ex5: Exercise = {
    Exercise_Name: "Push-ups",
    Muscle_Group: "Chest",
    Comment: "A bodyweight exercise that effectively targets the chest, shoulders, and triceps."
}

// Back exercises
const ex6: Exercise = {
    Exercise_Name: "Seated cable row",
    Muscle_Group: "Back",
    Comment: "A controlled movement that targets the mid-back and lats."
}

const ex7: Exercise = {
    Exercise_Name: "Pull-ups",
    Muscle_Group: "Back",
    Comment: "A bodyweight exercise that strengthens the upper back and lats."
}

const ex8: Exercise = {
    Exercise_Name: "Deadlifts",
    Muscle_Group: "Back",
    Comment: "A compound lift that engages the entire posterior chain, including the lower and upper back."
}

const ex9: Exercise = {
    Exercise_Name: "Lat pulldown",
    Muscle_Group: "Back",
    Comment: "Simulates a pull-up motion and targets the latissimus dorsi."
}

const ex10: Exercise = {
    Exercise_Name: "Bent-over barbell row",
    Muscle_Group: "Back",
    Comment: "Builds overall back thickness and strength."
}

// Legs exercises
const ex11: Exercise = {
    Exercise_Name: "Barbell squat",
    Muscle_Group: "Legs",
    Comment: "The king of lower body exercises, working the quads, hamstrings, and glutes."
}

const ex12: Exercise = {
    Exercise_Name: "Romanian deadlifts",
    Muscle_Group: "Legs",
    Comment: "Primarily targets the hamstrings and glutes with a hip hinge movement."
}

const ex13: Exercise = {
    Exercise_Name: "Leg press",
    Muscle_Group: "Legs",
    Comment: "A machine-based movement that allows for heavy loading on the quads."
}

const ex14: Exercise = {
    Exercise_Name: "Bulgarian split squat",
    Muscle_Group: "Legs",
    Comment: "Unilateral exercise that enhances balance, strength, and mobility."
}

const ex15: Exercise = {
    Exercise_Name: "Seated leg curl",
    Muscle_Group: "Legs",
    Comment: "Isolates the hamstrings for targeted development."
}

// Triceps exercises
const ex16: Exercise = {
    Exercise_Name: "Cable triceps pushdown",
    Muscle_Group: "Triceps",
    Comment: "A great isolation exercise for triceps development."
}

const ex17: Exercise = {
    Exercise_Name: "Close-grip bench press",
    Muscle_Group: "Triceps",
    Comment: "A compound movement that heavily targets the triceps."
}

const ex18: Exercise = {
    Exercise_Name: "Dips",
    Muscle_Group: "Triceps",
    Comment: "Works the entire triceps muscle along with the chest and shoulders."
}

const ex19: Exercise = {
    Exercise_Name: "Overhead dumbbell extension",
    Muscle_Group: "Triceps",
    Comment: "Focuses on the long head of the triceps."
}

const ex20: Exercise = {
    Exercise_Name: "Skull crushers",
    Muscle_Group: "Triceps",
    Comment: "A classic triceps builder that emphasizes the long and lateral heads."
}

// Biceps exercises
const ex21: Exercise = {
    Exercise_Name: "Dumbbell biceps curl",
    Muscle_Group: "Biceps",
    Comment: "A staple exercise that builds overall biceps size."
}

const ex22: Exercise = {
    Exercise_Name: "Barbell curl",
    Muscle_Group: "Biceps",
    Comment: "Allows for heavier loading compared to dumbbell curls."
}

const ex23: Exercise = {
    Exercise_Name: "Hammer curl",
    Muscle_Group: "Biceps",
    Comment: "Targets both the biceps and brachialis for arm thickness."
}

const ex24: Exercise = {
    Exercise_Name: "Preacher curl",
    Muscle_Group: "Biceps",
    Comment: "Eliminates momentum to strictly isolate the biceps."
}

const ex25: Exercise = {
    Exercise_Name: "Concentration curl",
    Muscle_Group: "Biceps",
    Comment: "Helps improve peak contraction and mind-muscle connection."
}

// Shoulders exercises
const ex26: Exercise = {
    Exercise_Name: "Dumbbell rear delt fly",
    Muscle_Group: "Shoulders",
    Comment: "Targets the rear delts for better posture and balanced shoulder development."
}

const ex27: Exercise = {
    Exercise_Name: "Seated dumbbell press",
    Muscle_Group: "Shoulders",
    Comment: "A fundamental overhead pressing movement for overall shoulder strength."
}

const ex28: Exercise = {
    Exercise_Name: "Lateral raises",
    Muscle_Group: "Shoulders",
    Comment: "Isolates the lateral delts for a wider shoulder appearance."
}

const ex29: Exercise = {
    Exercise_Name: "Front raises",
    Muscle_Group: "Shoulders",
    Comment: "Focuses on the front delts, aiding in pressing strength."
}

const ex30: Exercise = {
    Exercise_Name: "Face pulls",
    Muscle_Group: "Shoulders",
    Comment: "A great exercise for rear delts and shoulder joint health."
}

defaultExercises = [
    ex1, ex2, ex3, ex4, ex5,
    ex6, ex7, ex8, ex9, ex10,
    ex11, ex12, ex13, ex14, ex15,
    ex16, ex17, ex18, ex19, ex20,
    ex21, ex22, ex23, ex24, ex25,
    ex26, ex27, ex28, ex29, ex30
]
