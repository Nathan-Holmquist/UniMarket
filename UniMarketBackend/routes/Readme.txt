To test locally, perform node app.js, this will host the backend of the app attatched to local host which would be 3000.


The files in this directory are for the purpose of different signals/routes.

the idea is that you can create a file that will contain the signal which handles a specific interaction for instance,

you might have a file named
Transactions, and in that file you define all of the actions that revolve around Transactions

Other parts of your program would interact with it using /routes/transactions.js
exp)

This is for modularity and so we will not have a MONSTER file with 1000 lines of code

Look at the signals.js file for more detail.