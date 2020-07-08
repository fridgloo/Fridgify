const formatDate = (date) => {
  date = new Date(date);
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  const year = date.getFullYear();

  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }

  return [month, day, year].join("/");
};

const getExpirationColor = (date) => {
  if (!date) {
    return "#CBCBCB";
  }
  date = new Date(date);
  if (date < Date.now()) {
    return "red";
  } else {
    if ((date - Date.now()) / (1000 * 60 * 60 * 24) <= 3) {
      return "orange";
    } else {
      return "green";
    }
  }
};

const getItemType = (type) => {
  switch (type?.toLowerCase()) {
    case "meat":
      return "drumstick-bite";
    case "vegetable":
      return "carrot";
    case "fruit":
      return "apple-alt";
    case "fish":
      return "fish";
    default:
      return "question";
  }
};

function optionHeight(option) {
  switch (option) {
    case "name":
      return "15%";
    case "type":
      return "15%";
    case "exp_date":
      return "32%";
    case "add_nte":
      return "60%";
    case "add_nt":
      return "32%";
    case "delete":
      return "15%";
    case "clear":
      return "15%";
    default:
      break;
  }
}

export {formatDate, getExpirationColor, getItemType, optionHeight };