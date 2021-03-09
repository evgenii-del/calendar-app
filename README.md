# Calendar app

Simple meeting planning calendar for a meeting room in your office.

![app.png](src/img/app.png)

## Quick start

```
# Download repository:
git clone https://github.com/evgenii-del/calendar-app.git

# Go to the app:
cd calendar-app

# Install dependencies:
npm install

# Server with live reload at http://localhost:3000/
npm run start
```

## Production build

```
# Output will be at app/ folder
npm run build
```

## Prettier

```
# format all files with Prettie
npx prettier --write .
```

```
# If you have a CI setup, run the following as part of it to make sure that everyone runs Prettier
prettier --check .
```

## Jest

```
# run tests
npm test
```


## The project used technologies such as:

- Webpack 5
- Babel
- ESlint
- devServer
- Scss
- Jest

## The project has implemented:

- Display meetings planned;
- Filter meetings for a particular team member;
- Add new meetings;
- Delete meetings;
