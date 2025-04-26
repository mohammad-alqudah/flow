const formatTimestampToArabicDate = (timestamp: string) => {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formattedDate;
};

export default formatTimestampToArabicDate;
