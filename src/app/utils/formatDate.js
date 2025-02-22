export const formatDate = (date) => {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    return "Geçersiz Tarih";
  }

  const formattedDate = parsedDate.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formattedDate.replace(/\//g, "-");
};
