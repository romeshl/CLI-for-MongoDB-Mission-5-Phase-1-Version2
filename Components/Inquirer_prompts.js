export const questions = [
  // data to be added to the listings
  {
    type: "input", // inquirer input type
    name: "title", // name of the input
    message: "Enter the title of the listing item: ", // prompt message
    filter: (value) => {
      return value.trim(); // Remove whitespace
    },
  },
  {
    type: "input",
    name: "description",
    message: "Enter the description of the listing item: ",
    filter: (value) => {
      return value.trim(); // Remove whitespace
    },
  },
  {
    type: "input",
    name: "start_price",
    message: "Enter the start price of the listing: ",
    validate: function (value) {
      // Validate the input to check if it is a number and greater than 0
      if (isNaN(value) || parseInt(value) < 1 || value === "") {
        return "Please enter a valid number.";
      }
      return true;
    },
    filter: function (value) {
      return parseFloat(value); // Convert input to float
    },
  },
  {
    type: "input",
    name: "reserve_price",
    message: "Enter the reserve price of the listing: ",
    validate: function (value) {
      // Validate the input to check if it is a number and greater than 0
      if (isNaN(value) || value < 0 || value === "") {
        return "Please enter a valid number.";
      }
      return true;
    },
    filter: function (value) {
      return parseFloat(value); // Convert input to float
    },
  },
];
