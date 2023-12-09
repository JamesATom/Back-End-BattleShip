# Battleship Game Backend

## Introduction

This is the backend server for the Battleship game. It handles game logic, player actions, and communicates with the frontend application[1].

## Features

- Handles game logic
- Processes player actions
- Communicates with the frontend

## Technologies Used

- Node.js
- TypeScript
- Jest for testing
- Nodemon for development

## How to Run

This project uses npm scripts for building, running, testing, and development. The scripts are defined in the `package.json` file[4].

### Prerequisites

- Node.js 18.17 or later
- TypeScript 5.2.2 or later

### Installation

To install the required packages, run:

```bash
npm install
```

This will install all the dependencies listed in the `package.json` file.

### Scripts

The `package.json` file includes the following scripts[4]:

- `"build": "rimraf ./build && tsc"`: Compiles the TypeScript files and outputs them to the `build` directory.
- `"test": "jest"`: Runs the Jest test suite.
- `"start": "nodemon src/index.ts"`: Starts the server using Nodemon, which will automatically restart the server whenever file changes are detected in the `src` directory.
- `"start:dev": "cross-env nodemon --watch 'src/**/*' -e 'ts' --exec 'ts-node' src/index.ts"`: Starts the server in development mode, watching the `src` directory for changes.
- `"start:prod": "node src/index.ts"`: Starts the server in production mode.

To run these scripts, use the `npm run` command followed by the script name. For example, to start the development server, run:

```bash
npm run start:dev
```

## Testing

This project uses Jest for testing. You can run the tests using the `npm run test` command.

## Contributing

Contributions are welcome! Please read the contributing guidelines before making any changes.

## License

This project is licensed under the terms of the ISC license.

## Contact

For any questions or concerns, please open an issue on this repository.

## Acknowledgements

We would like to thank all the contributors who have helped to build this game.

Citations:
[1] https://github.com/zeke/package-json-to-readme

[2] https://stackoverflow.com/questions/62575382/relative-link-from-readme-md-to-another-file-in-package-rendered-in-npmjs

[3] https://blog.bitsrc.io/writing-the-perfect-reademe-for-your-node-library-2d5f24dc1c06

[4] https://docs.npmjs.com/creating-a-package-json-file/

[5] https://docs.npmjs.com/about-package-readme-files/

[6] https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/

[7] https://www.smashingmagazine.com/2020/04/express-api-backend-project-postgresql/
