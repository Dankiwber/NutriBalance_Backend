const obj = {
  "cola candy": {
      "total_intake": "50g",
      "total_calories": "200 cal",
      "fat": "0 g",
      "carbs": "50 g",
      "protein": "0 g"
  },
  "bread": {
      "total_intake": "150g",
      "total_calories": "390 cal",
      "fat": "4.5 g",
      "carbs": "72 g",
      "protein": "12 g"
  },
  "cola": {
      "total_intake": "1 can (330ml)",
      "total_calories": "139 cal",
      "fat": "0 g",
      "carbs": "35 g",
      "protein": "0 g"
  }
}

const obj_arr = Object.keys(obj);
var ans = 'World';
ans = ans + ' Hello\n';

obj_arr.forEach((Element, index) => {
  const item = `${index + 1}. ${Element}`;
  const intake = `${obj[Element].total_intake}g`;
  ans = ans + (`${item.padEnd(10)} ${intake.padStart(5)}\n`);
});

console.log(ans);