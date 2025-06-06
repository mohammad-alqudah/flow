const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // الشهر يبدأ من 0، لذا نضيف 1
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default getTodayDate;
