exports.formatDate = (oldDate) => {
  const t = new Date(oldDate);
  const month = ('0' + (t.getMonth() + 1)).slice(-2);
  const year =
    t.getFullYear() === 2001 ? new Date().getFullYear() : t.getFullYear();

  return `${year}-${month}-01`;
};

exports.isDateValid = (dateStr) => {
  return !isNaN(new Date(dateStr));
};

exports.delay = (interval) =>
  new Promise((resolve) => setTimeout(resolve, interval));
