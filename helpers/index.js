module.exports = {
  makeTreeGraphStructure: function(user) {
    let chartConfig = {
      chart: {
        container: "#tree"
      },
      nodeStructure: _createTreeGraphStructure(user)
    };
    return chartConfig;
  }
};
function _createTreeGraphStructure(user) {
  let newObj = {
    text: { name: user.username }
  };
  newObj.children = user.ponverts.map(child => {
    return _createTreeGraphStructure(child);
  });
  return newObj;
}
/*
simple_chart_config = {
    chart: {
        container: "#tree-simple"
    },

    nodeStructure: {
        text: { name: "Parent node" },
        children: [
            {
                text: { name: "First child" }
            },
            {
                text: { name: "Second child" }
            }
        ]
    }
};
*/
