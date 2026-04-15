- npm init - creates package.json with some details we shared
- npm i express
- npm install eslint --save-dev
- npx eslint --init
- npm install prettier --save-dev

- express.json() middleware
  - It recognizes the incoming Request Object as a JSON object and converts the raw request body into a JavaScript object.
- express.urlencoded({extended: true})
  - It extracts data sent via HTML forms (standard application/x-www-form-urlencoded format) and makes it available as a JavaScript object in req.body.

  - install dotenv: npm i dotenv
    - require("dotenv").config()


- added modules/auth
  - auth.routes - all auth routes here
  - auth.controller - logic and validation here
  - auth.service - return statement with exact response here
  - auth.validaion - validations for auth payloads
