const getPostSupport = require('./../index');


describe('getPostSupport', () => {


  describe('callback', () => {
    it('returns the method if present in the request query', () => {
      const method = getPostSupport.callback({
        query: { _method: 'PUT' }
      });
      expect(method).toBe('PUT');
    });


    it('returns the method if present in the request body', () => {
      const method = getPostSupport.callback({
        body: { _method: 'PUT' }
      });
      expect(method).toBe('PUT');
    });


    it('returns undefined if method not present', () => {
      const method = getPostSupport.callback({});
      expect(method).toBe(undefined);
    });


    it('sets the query to body', () => {
      const req = {
        query: { 
          _method: 'PUT',
          foo: 'bar'
        }
      };

      const method = getPostSupport.callback(req);
      expect(req.body.foo).toBe('bar');
      expect(Object.keys(req.query).length).toBe(0);
    });
  });


  describe('options', () => {
    it('is an object with a methods key', () => {
      expect(typeof getPostSupport.options).toBe('object');
      expect(!!getPostSupport.options.methods).toBe(true);
    });


    it('the method key contains an array with GET and POST', () => {
      expect(getPostSupport.options.methods.includes('GET')).toBe(true);
      expect(getPostSupport.options.methods.includes('POST')).toBe(true);
    });
  });
});