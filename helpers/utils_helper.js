


const UtilsHelper = {};


UtilsHelper.concat = (...args) => args.slice(0, -1).join('');


UtilsHelper.join = (str, ...args) => args.slice(0, -1).join(str);


UtilsHelper.debug = obj => `<pre>${ JSON.stringify(obj, null, 2) }</pre>`;


UtilsHelper.json = obj => JSON.stringify(obj, null, 2);


UtilsHelper.eq = (a, b) => a == b;
/*
example usage
{{#if (eq ../session.category category.id)}}...nonhandlebars...{{/if}}

explanation
{{#if (utilshelpername argument argument)}}...nonhandlebars...{{/if}}

explanation
../session.category
../ means access all variables passed to handlebars and session is one of them
*/

// some thinking
// UtilsHelper.recursive = (obj) => {
//   if(obj.children == []){
//     return obj
//   }
//
//   obj.children.forEach(child => {
//     recursive(child)
//   })
// }

/*

*/

UtilsHelper.eql = (a, b) => a === b;


UtilsHelper.gt = (a, b) => a > b;


UtilsHelper.gte = (a, b) => a >= b;


UtilsHelper.lt = (a, b) => a < b;


UtilsHelper.lte = (a, b) => a <= b;


UtilsHelper.times = function(n, options) {
  if (typeof n === 'object') {
    options = n;
  }

  let start;
  let stop;
  let step;
  let direction;

  if (options.hash && Object.keys(options.hash).length) {
    start = options.hash.start;
    stop = options.hash.stop;
    step = options.hash.step;
    direction = options.hash.direction;
    step = step || 1;
    direction = direction || 1;
  } else {
    start = 0;
    stop = n - 1;
    step = 1;
    direction = 1;
  }

  if (options.hash.start &&
      options.hash.stop) {
    start = options.hash.start;
    stop = options.hash.stop;
  }

  let output = '';

  for (let i = start; i <= stop; i += (step * direction)) {
    output += options.fn(this, {
      data: { index: i },
      blockParams: [i]
    });
  }

  return output;
};



module.exports = UtilsHelper;
