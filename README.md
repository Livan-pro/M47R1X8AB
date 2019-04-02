# M47R1XAB
## Development setup
```bash
npm i -g lerna # install lerna
lerna link # link projects to each other
lerna bootstrap # install dependencies

cd packages/backend
copy .env-example .env # copy config, you need to edit this
npm run dev # start development server

cd packages/website
npm run dev # start development website server
```