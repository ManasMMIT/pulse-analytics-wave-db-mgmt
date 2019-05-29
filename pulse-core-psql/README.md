# pulse-core-psql

## How to Get Started

1. Add a .env file. You need environment variable PSQL_LOADER_URI to connect to our Heroku psql db. Get the string to copy into your .env file [here](https://dedhamgroup.atlassian.net/wiki/spaces/PE/pages/102662158/External+Services+and+Account+Information).
2. Run `yarn` to install dependencies

## Run the REPL

Execute the following in terminal:

```node --inspect ./pulse-core-psql/sequelizeConsole.js ```

Go to `chrome://inspect` in your browser and open up Node devtools to run test queries. Feel free to use the `chain` method I wrote to make running multiple, sequential queries easier. (See usage reference below)

### Remember that you have to prepend `await` before your sequelize calls if you want the REPL to return query results immediately. So instead of writing `User.findOne()`, you probably mean to write `await User.findOne()`.

## Sample usage of `chain` method

`chain` lets you chain multiple association calls to a single model instead of `await`ing each step of the calls you're making. It's exposed in the REPL for our convenience.

First argument is the model, second argument is array of strings representing your association methods.

Here are some examples of usage:

```javascript

// just strings
await chain(User, ['findOne', 'getRoles', 'getClients', 'getRoles'])

// mix of strings and options

/*
f is for function call
o is for options
cb is for callback that receives the result of that stage's query for any additional manipulation prior to moving onto the next stage

IMPORTANT: the manipulated result IS NOT passed to the following stage
*/

await chain(User, [
  {
    f: 'findOne',
    o: {
      where: {
        username: 'admin@example.com'
      }
    }
  },
  'getRoles',
  {
    f: 'getNodes',
    o: {
      where: {
        type: 'tool'
      }
    }
  }
])
```

## Resources:

### Links related to sequelize usage
- https://stackoverflow.com/questions/38601223/sequelize-eager-loading-through-intermediate-model
- https://stackoverflow.com/questions/42708811/has-many-through-association-in-sequelize
- https://github.com/sequelize/sequelize/issues/7778
- TURN OFF SUBQUERY: https://github.com/sequelize/sequelize/issues/1756
- IDEAS ON ORDERING: https://github.com/sequelize/sequelize/issues/4553
- NESTED WHERE CONDITION SYNTAX: https://github.com/sequelize/sequelize/issues/4414
- grouping in sequelize is difficult: https://github.com/sequelize/sequelize/issues/3256
- applying scope in Model: https://sequelize.readthedocs.io/en/latest/api/model/#scopeoptions-model

### Setting up Node REPL links
- https://medium.com/@vemarav/build-rails-like-console-in-nodejs-repl-2459fb5d387b
- https://derickbailey.com/2014/07/02/build-your-own-app-specific-repl-for-your-nodejs-app/
