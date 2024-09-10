#!/usr/bin/env node
import { Command } from "commander"; // Import the Command class from the commander package
import {
  handleAddCommand,
  handleShowCommand,
  handleUpdateCommand,
  handleDeleteCommand,
} from "./commands.js"; // Import the functions to handle the commands

import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const program = new Command();

program // Create a new command with the name, description, and version
  .name("trademedataadder")
  .description("This CLI tool helps to manage Trademe listings data")
  .version("1.0.0");

// Register commands
program 
  .command("add")
  .description("Adds a listing or seed data into the Listings collection.")
  .option("-o, --one", "Adds a new listing to the collection.")
  .option("-s, --seed", "Adds seed data to Listings collection.")
  .action(handleAddCommand);

program
  .command("show")
  .description(
    "Show a listing by its ID or all the listings in the collection."
  )
  .option("-o, --one <id>", "Shows a listing by its ID.")
  .option("-a, --all", "Shows all the listings in the collection.")
  .action(handleShowCommand);

program
  .command("update <id>")
  .description("Update a listing by its ID.")
  .action(handleUpdateCommand);

program
  .command("delete")
  .description(
    "Deletes listing by its ID or all the listings in the collection."
  )
  .option("-o, --one <id>", "Deletes a listing by its ID.")
  .option("-a, --all", "Deletes all the listings in the collection.")
  .action(handleDeleteCommand);

program.parse(process.argv);
