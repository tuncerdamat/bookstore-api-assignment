# Introduction

This is a bookstore API.

## Installation

Initialize your env variables ```MONGODB_URI_DEV``` and ```PORT``` for your MongoDB installation and application port which can be done in ```.env``` file or by ```export```ing to your shell.  

To install dependencies run:
```
yarn install
```

There will be two databases(one for the tests and one for the main app).
I have provided MongoDB dump files under ```src/db/bookstore``` which can be imported to ```bookstore``` and ```test_bookstore``` databases by running:
```shell 
mongorestore -d dbname src/db/bookstore
```

## Usage
To start the app run:
```
yarn run start
```

To run tests:
```
yarn run test
```
