const dateFormat = (datetime: string | Date) => {
  const dateTime = new Date(datetime);

  const date = dateTime.toLocaleDateString(['de'], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /*
  const time = dateTime.toLocaleTimeString(['de'], {
    hour: "2-digit",
    minute: "2-digit",
  });
  */

  return date;
};

export default dateFormat;
