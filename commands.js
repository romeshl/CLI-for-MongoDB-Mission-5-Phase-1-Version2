import inquirer from "inquirer"; // Importing inquirer for prompting user
import chalk from "chalk"; // Importing chalk for coloring the output

import { connectToDatabase } from "./Connection/MongoDB.js"; // MongoDB connection

import {
  Add_Listing,
  Add_Seed_Data,
  Show_Listing,
  Show_Listings,
  Update_Listing,
  Delete_Listing,
  Delete_All_Listings,
} from "./DB_Operations/Listing_transactions.js"; // Import the functions to perform CRUD operations on the Listings collection

import { readFile } from "fs/promises"; // Importing the readFile function from the fs/promises module
const Seed_Data = JSON.parse(
  await readFile(new URL("./Seed_Data/trademe.listings.json", import.meta.url)) // Read the seed data from the JSON file stored in the Seed_Data folder
);

import { questions } from "./Components/Inquirer_prompts.js"; // Inquirer prompts

export function Show_Data(data, message) { // Function to display the data from listing operations
  console.log("\n");
  console.log(data);
  console.log("\n");
  console.log(chalk.yellowBright(message));
  console.log("\n");
}

export function Show_Error(error) { // Function to display the error message from listing operations
  console.log(chalk.redBright(`\n${error}\n`));
}

export async function handleAddCommand(options) { // Function to handle the add command
  try {
    if (!options.one && !options.seed) { // Show error if no option is selected
        Show_Error("Please select one of the options or type -h for help.")
      return;
    }
    const db = await connectToDatabase(); // Connect to the database
    if (options.seed) { // If seed option is selected
      try {
        const seeded_data = await Add_Seed_Data(Seed_Data); // Add seed data
        Show_Data(
          seeded_data,
          `Seed data added Successfully. No. of listings: ${seeded_data.length}`
        );
      } catch (error) {
        Show_Error(`Unable to add seed data. Error: ${error.message}`);
      }
    }
    if (options.one) { // If one option is selected
      const answers = await inquirer.prompt(questions);
      try {
        const added_data = await Add_Listing(answers); // Add listing
        Show_Data(added_data, "Listing added successfully!");
      } catch (error) {
        Show_Error(`Unable to add listing. Error: ${error.message}`);
      }
    }
    db.connection.close();
  } catch (error) {
    Show_Error(error.message);
    if (typeof db !== "undefined") {
      db.connection.close();
    }
  }
}

export async function handleShowCommand(options) { // Function to handle the show command
  try {
    if (!options.one && !options.all) { // Show error if no option is selected
      console.log(
        Show_Error("Please select one of the options or type -h for help.")
      );
      return;
    }
    const db = await connectToDatabase();
    if (options.one && options.one.trim()) { // If one option is selected
      const ID = options.one.trim();
      try {
        const show_data = await Show_Listing(ID); // Show listing
        Show_Data(show_data, "Listing found.");
      } catch (error) {
        Show_Error(`Unable to show listing. Error: ${error.message}`);
      }
    }
    if (options.all) { // If all option is selected
      try {
        const show_data = await Show_Listings(); // Show all listings
        Show_Data(show_data, `No. of listings: ${show_data.length}`);
      } catch (error) {
        Show_Error(`Unable to show listings. Error: ${error.message}`);
      }
    }
    db.connection.close();
  } catch (error) {
    Show_Error(error.message);
    if (typeof db !== "undefined") {
      db.connection.close();
    }
  }
}

export async function handleUpdateCommand(id) { // Function to handle the update command
  try {
    const db = await connectToDatabase(); // Connect to the database
    const ID = id.trim();
    if (ID) {
      try {
        const show_data = await Show_Listing(ID); // Show the listing to be updated
        Show_Data(show_data, "Listing to be updated.");
        console.log(chalk.yellowBright("Enter the updated data:"));
        const answers = await inquirer.prompt(questions); // Prompt the user for updated data
        const updated_data = Update_Listing(ID, answers); // Update the listing
        Show_Data(updated_data, "Listing updated successfully!");
      } catch (error) {
        Show_Error(`Unable to update listing. Error: ${error.message}`);
      }
    }
    db.connection.close();
  } catch (error) {
    Show_Error(error.message);
    if (typeof db !== "undefined") {
      db.connection.close();
    }
  }
}

export async function handleDeleteCommand(options) { // Function to handle the delete command
  try {
    if (!options.one && !options.all) { // Show error if no option is selected
      Show_Error("Please select one of the options or type -h for help.");
      return;
    }
    const db = await connectToDatabase(); // Connect to the database
    if (options.one && options.one.trim()) { // If one option is selected
      const ID = options.one.trim();
      try {
        const show_data = await Show_Listing(ID); // Show the listing to be deleted
        Show_Data(show_data, "Listing to be deleted.");
        const { isConfirmed } = await inquirer.prompt([ // Confirm deletion
          {
            type: "confirm",
            name: "isConfirmed",
            message: chalk.redBright(
              "Are you sure you want to delete the listing?"
            ),
          },
        ]);
        if (isConfirmed) {
          const delete_data = Delete_Listing(ID); // Delete the listing
          Show_Data(delete_data, "Listing deleted.");
        } else {
          console.log(chalk.yellowBright("Deletion cancelled."));
        }
      } catch (error) {
        Show_Error(`Unable to delete listing. Error: ${error.message}`);
      }
    }
    if (options.all) { // If all option is selected
      try {
        const { isConfirmed } = await inquirer.prompt([ // Confirm deletion
          { 
            type: "confirm",
            name: "isConfirmed",
            message: chalk.redBright(
              "Are you sure you want to delete all listings?"
            ),
          },
        ]);
        if (isConfirmed) {
          const delete_all_data = await Delete_All_Listings(); // Delete all listings
          Show_Data(delete_all_data, `Deleted All listings.`);
        } else {
          console.log(chalk.yellowBright("Deletion cancelled."));
        }
      } catch (error) {
        Show_Error(`Unable to delete listings. Error: ${error.message}`);
      }
    }
    db.connection.close();
  } catch (error) {
    Show_Error(error.message);
    if (typeof db !== "undefined") {
      db.connection.close();
    }
  }
}
