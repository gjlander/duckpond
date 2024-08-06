# Simple Duckpond API for demoing fetch
## Currently only two endpoints in place
### Base URL https://duckpond-89zn.onrender.com/
- GET returns generic message
### /ducks
- GET returns array of all ducks
- POST expects a new duck with the following properties, and returns the new duck
```js
{name: string,
 imgURL: string,
 quote: string}
```
