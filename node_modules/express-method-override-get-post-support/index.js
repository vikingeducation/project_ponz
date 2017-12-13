

// Helper function to determine if
// _method key is present under the
// given key in the req object
const methodPresent = (key, req) => {
  return req[key] &&
    typeof req[key] === 'object' &&
    req[key]._method;    
};


// Middleware callback to be passed
// as custom logic to the method-override
// middleware
const callback = (req, res) => {
  let key;
  let method;

  if (methodPresent('query', req)) {
    key = 'query';
  } else if (methodPresent('body', req)) {
    key = 'body';
  }

  if (key) {
    method = req[key]._method
    delete req[key]._method;
  }

  if (method) {
    if (key === 'query' && method !== 'get') {
      req.body = req.body || {};
      req.body = JSON.parse(
        JSON.stringify(req.query)
      );
      req.query = {};
    }
    return method;
  }
};




module.exports = {
  callback: callback,
  options: { methods: ['POST', 'GET'] }
};

















