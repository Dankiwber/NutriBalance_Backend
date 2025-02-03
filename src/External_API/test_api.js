const obj = {
  "daily_intake": [ '110', '70', '260', '1900' ],
  "weekly_intake": {
    '2025-02-02': '2300',
    '2025-02-03': '1900',
    '2025-02-04': '2500',
    '2025-02-05': '1800',
    '2025-02-06': '2600',
    '2025-02-07': '2000',
    '2025-02-08': '2500'
  }
}

const obj_arr = Object.keys(obj);
console.log(obj["daily_intake"])
const dat_arr = []
const intake_arr = []
for (const key in obj["weekly_intake"]) {
  intake_arr.push(Stringobj["weekly_intake"][key])
  const [year, month, day] = key.split('-');
  const date = new Date(year, month - 1, day); 
  const formattedDate = date.toLocaleString('en-US', { month: 'short', day: '2-digit' });
  dat_arr.push(formattedDate)
  console.log(formattedDate)
}

console.log(dat_arr)
console.log(intake_arr)