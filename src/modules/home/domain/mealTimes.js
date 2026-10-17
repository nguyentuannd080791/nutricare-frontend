const MEAL_TIME_WINDOWS = {
  sang: "07:00 - 08:00",
  trua: "12:00 - 13:00",
  an_vat: "15:30 - 16:00",
  toi: "19:00 - 20:00",
};

export function mealTimeWindow(slotId) {
  return MEAL_TIME_WINDOWS[slotId] || null;
}
