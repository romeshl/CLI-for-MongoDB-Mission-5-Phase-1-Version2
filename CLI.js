#!/usr/bin/env node
// Shebang line to run the script as a command line tool (to run without typing Node)

import connectDB from "./Connection/MongoDB.js"; // Import the mongoose connection for the database
import {
  Add_Listing,
  Add_Seed_Data,
  Show_Listing,
  Show_Listings,
  Update_Listing,
  Delete_Listing,
  Delete_All_Listings,
} from "./DB_Operations/Listing_transactions.js"; // Import the functions to perform CRUD operations on the listings

import { questions } from "./Components/Inquirer_prompts.js"; // Import the inquirer prompts for the CLI

import { readFile } from "fs/promises"; // Import the fs package to read files
const Seed_Data = JSON.parse(
  await readFile(new URL("./Seed_Data/trademe.listings.json", import.meta.url))
); // Read the Seed Data from the trademe.listings.json file

import { Command } from "commander"; // Import the commander package for the CLI
import inquirer from "inquirer"; // Import the inquirer package for the CLI
import chalk from "chalk"; // Import the chalk package for colored text

import dotenv from "dotenv"; // Import the dotenv package to read the .env file
dotenv.config(); // Load the environment variables

const program = new Command(); // Create a new commander program

async function connectToDatabase() {
  // Function to connect to the MongoDB database
  const db = await connectDB(); // Connect to the MongoDB database
  return db; // Return the database connection
}

function removeColor(text) {
  // Function to remove color attributes from text
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

async function Listing_Operations({ operation = "", data = "", ID = "" }) {
  // Function to perform database operations
  let Listing = null; // Initialize the Listing variable
  switch (operation) {
    case "Seed":
      Listing = await Add_Seed_Data(Seed_Data); // Add seed data
      if (Listing === null) {
        throw new Error("Unable to add seed data. Error occurred!");
      }
      break;
    case "Add":
      Listing = await Add_Listing(data); // Add data to the listing
      if (!Listing) {
        throw new Error("Unable to add listing. Error occurred!");
      }
      break;
    case "Show":
      Listing = await Show_Listing(ID); // Show the listing
      if (!Listing) {
        throw new Error("Listing not found.");
      }
      break;
    case "ShowAll":
      Listing = await Show_Listings(); // Show all the listings
      if (Listing === null) {
        throw new Error("Unable to find listing data. Error occurred!");
      }
      break;
    case "Update":
      Listing = await Update_Listing(ID, data); // Update the listing
      if (!Listing) {
        throw new Error("Unable to update listing. Error occurred!");
      }
      break;
    case "Delete":
      Listing = await Delete_Listing(ID); // Update the listing
      if (!Listing) {
        throw new Error("Unable to delete listing. Error occurred!");
      }
      break;
    case "DeleteAll":
      Listing = await Delete_All_Listings(); // Update the listing
      if (!Listing) {
        throw new Error("Unable to delete listings. Error occurred!");
      }
      break;
    default:
      console.log("Invalid operation.");
  }
  return Listing;
}

function Show_Data(data, message) {
  console.log("\n");
  console.log(data); // Display the added seed data
  console.log("\n");
  console.log(chalk.yellowBright(message));
  console.log("\n");
}

function Show_Error(error) {
  console.log(chalk.redBright(`\n${error}\n`));
}

program // Add the CLI program details
  .name("trademedataadder") // Name of the CLI program
  .description("This CLI tool helps to manage Trademe listings data") // Description of the CLI program
  .version("1.0.0"); // Version of the CLI program

program
  .command("add") // add command to add a listing
  .description("Adds a listing or seed data into the Listings collection.")
  .option("-o, --one", "Adds a new listing to the collection.") // Option to add a single listing
  .option("-s, --seed", "Adds seed data to Listings collection.") // Option to add seed data
  .action(async (options) => {
    // Action to perform when the add command is selected
    try {
      if (!options.one && !options.seed) {
        // Check if none of the options are selected
        console.log(
          chalk.redBright(
            "\nPlease select one of the options or type -h for help.\n"
          )
        );
        return;
      }
      const db = await connectToDatabase(); // Connect to the MongoDB database

      // Check if seed data option is selected
      if (options.seed) {
        try {
          const seeded_data = await Listing_Operations({
            operation: "Seed",
            data: Seed_Data,
          }); // Add seed data
          Show_Data(seeded_data, "Seed data added successfully!"); // Display the added seed data
        } catch (error) {
          Show_Error(error.message);
        }
      }

      // Check if add listing option is selected
      if (options.one) {
        const answers = await inquirer.prompt(questions); // Prompt the user for the listing data
        try {
          const added_data = await Listing_Operations({
            operation: "Add",
            data: answers,
          }); // Add data to the listing
          Show_Data(added_data, "Listing added successfully!"); // Display the added listing data
        } catch (error) {
          Show_Error(error.message);
        }
      }

      db.connection.close(); // Close the MongoDB connection
      return;
    } catch (error) {
      Show_Error(error.message);
      if (typeof db !== "undefined") {
        db.connection.close(); // Ensure DB connection is closed in case of error
      }
    }
  });

program
  .command("show")
  .description(
    "Show a listing by it's ID or All the Listings in the collection."
  )
  .option("-o, --one <id>", "Shows a listing by it's ID.")
  .option("-a, --all", "Shows all the listings in the collection.")
  .action(async (options) => {
    try {
      if (!options.one && !options.all) {
        console.log(
          chalk.redBright(
            "\nPlease select one of the options or type -h for help.\n"
          )
        );
        return;
      }
      const db = await connectToDatabase(); // Connect to the MongoDB database

      if (options.one && options.one.trim()) {
        const ID = options.one.trim();
        try {
          const show_data = await Listing_Operations({
            operation: "Show",
            ID: ID,
          }); // Add data to the listing
          Show_Data(show_data, "Listing found."); // Display the added listing data
        } catch (error) {
          Show_Error(error.message);
        }
      }
      if (options.all) {
        try {
          const show_data = await Listing_Operations({ operation: "ShowAll" }); // Add data to the listing
          Show_Data(show_data, `No. of listings: ${show_data.length}`); // Display the added listing data
        } catch (error) {
          Show_Error(error.message);
        }
      }
      db.connection.close(); // Close the MongoDB connection
      return;
    } catch (error) {
      Show_Error(error.message);
      if (typeof db !== "undefined") {
        db.connection.close(); // Ensure DB connection is closed in case of error
      }
    }
  });

program
  .command("update <id>")
  .description("Update a listing by it's ID.")
  .action(async (id) => {
    try {
      const db = await connectToDatabase(); // Connect to the MongoDB database
      const ID = id.trim();
      if (ID) {
        try {
          const show_data = await Listing_Operations({
            operation: "Show",
            ID: ID,
          }); // Add data to the listing
          Show_Data(show_data, "Listing to be updated."); // Display the added listing data
          console.log(chalk.yellowBright("Enter the updated data:"));
          const answers = await inquirer.prompt(questions); // Prompt the user for the listing data
          const updated_data = await Listing_Operations({
            operation: "Update",
            data: answers,
            ID: ID,
          }); // Add data to the listing
          Show_Data(updated_data, "Listing updated successfully!"); // Display the added listing data
        } catch (error) {
          Show_Error(error.message);
        }
      }
      db.connection.close(); // Close the MongoDB connection
      return;
    } catch (error) {
      Show_Error(error.message);
      if (typeof db !== "undefined") {
        db.connection.close(); // Ensure DB connection is closed in case of error
      }
    }
  });

program
  .command("delete")
  .description(
    "Deletes listing by it's ID or All the Listings in the collection."
  )
  .option("-o, --one <id>", "Deletes a listing by it's ID.")
  .option("-a, --all", "Deletes all the listings in the collection.")
  .action(async (options) => {
    try {
      if (!options.one && !options.all) {
        console.log(
          chalk.redBright(
            "\nPlease select one of the options or type -h for help.\n"
          )
        );
        return;
      }
      const db = await connectToDatabase(); // Connect to the MongoDB database

      if (options.one && options.one.trim()) {
        const ID = options.one.trim();
        try {
          const show_data = await Listing_Operations({
            operation: "Delete",
            ID: ID,
          }); // Add data to the listing
          Show_Data(show_data, "Listing deleted."); // Display the added listing data
        } catch (error) {
          Show_Error(error.message);
        }
      }
      if (options.all) {
        try {
          const { isConfirmed } = await inquirer.prompt([
            // Prompt the user for confirmation
            {
              type: "confirm",
              name: "isConfirmed",
              message: chalk.redBright(
                "Are you sure you want to delete all listings?"
              ),
            },
          ]);
          if (isConfirmed) {
            const show_data = await Listing_Operations({
              operation: "DeleteAll",
            }); // Add data to the listing
            Show_Data(show_data, `Deleted All listings.`); // Display the added listing data
          } else {
            console.log(chalk.yellowBright("Deletion cancelled."));
          }
        } catch (error) {
          Show_Error(error.message);
        }
      }
      db.connection.close(); // Close the MongoDB connection
      return;
    } catch (error) {
      Show_Error(error.message);
      if (typeof db !== "undefined") {
        db.connection.close(); // Ensure DB connection is closed in case of error
      }
    }
  });

program.parse(process.argv);
