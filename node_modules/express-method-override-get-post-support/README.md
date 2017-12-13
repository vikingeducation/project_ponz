# express-method-override-get-post-support

by [Bideo Wego](https://github.com/BideoWego)

View it on [NPM](https://www.npmjs.com/package/express-method-override-get-post-support)

Provides support for the Express method-override package to override HTTP methods via GET requests in the query string and POST requests in the POST body.


## Installation

Install via NPM

```bash
$ npm install --save express-method-override-get-post-support
```


## Usage

To use the GET and POST support simply require the package and pass the `callback` and `options` properties as arguments to `methodOverride()`:

```javascript
const methodOverride = require('method-override');
const getPostSupport = require('express-method-override-get-post-support');


app.use(methodOverride(
  getPostSupport.callback,
  getPostSupport.options // { methods: ['POST', 'GET'] }
));
```


### GET Requests

This will enable overriding the method of GET requests by providing a `_method` field in your query string. Example: `/example?_method=PATCH`.


### POST Requests

You will also be able override the method of POST requests with a `_method` field in the query string or POST body:

```html
<h2>Query String</h2>
<form action="/example?_method=PATCH" method="post">
  <input type="submit" value="PATCH">
</form>


<h2>Hidden Input String</h2>
<form action="/example" method="post">
  <input type="hidden" name="_method" value="PATCH">
  <input type="submit" value="PATCH">
</form>
```


## License


Copyright 2017 Bideo Wego

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.









