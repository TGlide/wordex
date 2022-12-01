export const isToday = (date: Date | string) => {
  const today = new Date();
  const dateToCompare = new Date(date);

  return (
    today.getFullYear() === dateToCompare.getFullYear() &&
    today.getMonth() === dateToCompare.getMonth() &&
    today.getDate() === dateToCompare.getDate()
  );
};
