# Intro

This app was built as the **Task 5** of **Mission 5 - Phase 1** at **Mission Ready HQ**. 

### Objective of the task
Develop a command-line interface (CLI) tool to seed data into your local MongoDB database or delete data from it.  Ensure that this tool is source-controlled and includes the seed data.  Team members should be able to seed data by cloning the repository.  Add sample data for a few auction items with the following 4 fields: title, description, start_price, reserve_price.

### Approach
After playing a bit with [readline](https://www.npmjs.com/package/readline0), [commander](https://www.npmjs.com/package/commander) and inquirer, I decided to go with commander and inquirer for handling user inputs. I used commander mainly because I wanted the CLI tool to behave like a NodeJS utility package.

## Build with

* [NodeJS](https://nodejs.org/en)
* [Mongoose](https://www.npmjs.com/package/mongoose)
* [Commander](https://www.npmjs.com/package/commander)
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [Chalk](https://www.npmjs.com/package/chalk)
* [dotenv](https://www.npmjs.com/package/dotenv)


## Folder structure

![screenshot](./Assests/Mission%205%20-%20Phase%201%20-%20Task%205%20-%20folder%20structure.png)

**CLI.js** - This is the file main file of the program and contains the commands of this CLI.

**commands.js** - This file handles commands and perform relevant operations based on teh command.

**MongoDB.js** - This file contains the connection to MongoDB database.

**Inquirer_prompts.js** - This file contains the prompts used with inquirer package.

**ListingsSchema.js** - This file contains schema structure for Listings collection.

**ListingsCollection.js** - This file creates Listings model based on the schema at ListingsSchema.js.

**Listing_transactions.js** - This file contains all the CRUD operations for Listings collection. It imports ListingsCollection.js file and exports all the functions to commands.js.

**trademe.listings.json** - This file contains the seed data to be added to an empty database.


## Instructions

Use the following command to clone the repository. 
``` 
git clone https://github.com/romeshl/CLI-for-MongoDB-Mission-5-Phase-1-Version2.git
```

You will need to create a **.env** file in the root of the folder to hold the MongoDB connection string. (Example below)

```
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/trademe
```

and then the following command to run install dependencies. 
```
npm install
```

and then the following command, so that you can run the CLI on the terminal. 
```
npm i -g
```

To start the CLI use the following command.
```
trademedataadder
```
This will show package details and commands and options to use with it.

## Commands and Options

### Any of the following will provide information about the package.
```
trademedadaadder
```
```
trademedadaadder -h 
```
```
trademedadaadder --help
```
### Adding listings.
To add one listing.
```
trademedadaadder add -o
```
or
```
trademedadaadder add --one
```
To populate the collection with seed data.
```
trademedadaadder add -s
```
or
```
trademedadaadder add --seed
```
Findout how to use *add* command.
```
trademedadaadder add -h
```
or
```
trademedadaadder add --help
```

### Displaying listings.
To show one listing by it's ID.
```
trademedadaadder show -o <ID>
```
or
```
trademedadaadder show --one <ID>
```
Example
```
trademedadaadder show -o 66dfacef549956a384b3700d
```
To show all listings.

```
trademedataadder show -a
```
or 
```
trademedataadder show --all
```
Findout how to use *show* command.
```
trademedadaadder show -h
```
or
```
trademedadaadder show --help
```

### Update listing.
To update one listing by it's ID.
```
trademedadaadder update <ID>
```
or
```
trademedadaadder update <ID>
```
Example
```
trademedadaadder update 66dfacef549956a384b3700d
```

Findout how to use *update* command.
```
trademedadaadder update -h
```
or
```
trademedadaadder update --help
```
### Delete listings.
To delete one listing by it's ID.
```
trademedadaadder delete -o <ID>
```
or
```
trademedadaadder delete --one <ID>
```
Example
```
trademedadaadder delete -o 66dfacef549956a384b3700d
```
To delete all the listings.
```
trademedadaadder delete -a
```
or
```
trademedadaadder delete --all
```

Findout how to use *delete* command.
```
trademedadaadder delete -h
```
or
```
trademedadaadder delete --help
```
