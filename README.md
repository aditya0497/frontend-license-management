## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

**
Project setup**

Kindly take the latest pull of the project and ensure that you install the dependencies using the **npm i** command.

The project has the following capabilties implemented:
1. License Management: Creation of licenses where the user creates custom licenses based on their needs such as time-bound license, usage-limited license where the usage would be greater than zero or hardware-tied license.
Generate, display and copy license the license key as a string or file (e.g., .json or .txt).
It is assumed that there would be limit set on a daily basis that only a certain number of license creation will be allowed. For now, it is configured to allow only 5 license creation per day.

2. Encryption Workflow
Encrypt Models or Images:
Upload a file (e.g., .bin, .pt, or .jpg).
Input the license key generated in the previous step.
Mock encryption (e.g., append a dummy hash or encrypt the file in the frontend with AES).
The user has the option to choose the kind of encryption algorithm they want to be used. For now **AES and RSA** are the available options configured.

3. Secure Sharing
Option to securely share the generated license and encrypted files. The generated license and the encrypted files would be available for download for a time of 30mins which is by default and can be configured as per the user needs.

4. Mock Backend (mocks folder in the code)
APIs are simulated for:
a) License creation.
b) File encryption
c) Secure sharing.
d) MSW (Mock Service Worker) used to mimic backend behavior.

5. Test cases for the Encryption Workflow and license creation

6. LocalStorage for handling the license creation limits

