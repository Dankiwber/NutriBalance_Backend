

const obj = {
    apples: {
      total_intake: 625,
      total_calories: 325,
      fat: 1.25,
      carbs: 86.25,
      protein: 1.25
    },
    bread: {
      total_intake: 150,
      total_calories: 390,
      fat: 4.5,
      carbs: 72,
      protein: 12
    },
    cola: {
      total_intake: 355,
      total_calories: 140,
      fat: 0,
      carbs: 39,
      protein: 0
    }
  }


const obj_arr = Object.keys(obj)
obj_arr.forEach((Element) => console.log(obj[Element].total_calories))