const dims = { height: 500, width: 1100 };

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dims.width + 100)
  .attr('height', dims.height + 100);

const graph = svg.append('g')
  .attr('transform', 'translate(50, 50)');


  const stratify=d3.stratify()
  .id(d => d.name)
  .parentId(d => d.parent);
  

  
  const tree = d3.tree()
    .size([dims.width, dims.height]);

    
const update=(data)=>{

  // remove current nodes
  graph.selectAll('.node').remove();
  graph.selectAll('.link').remove();


  // create ordinal scale
const colour = d3.scaleOrdinal(['#f4511e', '#e91e63', '#e53935', '#9c27b0']);

  // get updated root Node data
  const rootNode = stratify(data);
const treeData = tree(rootNode).descendants();

// get nodes selection and join data
  const nodes = graph.selectAll('.node')
    .data(treeData);

const enterNodes=nodes.enter().append('g')
.attr('class','node')
.attr('transform', d => `translate(${d.x}, ${d.y})`);

 // update ordinal scale domain
 colour.domain(data.map(d => d.department));
 
 
// append rects to enter nodes
enterNodes.append('rect')
.attr('fill', d=>colour(d.data.department))
.attr('stroke', '#555')
.attr('stroke-width', 2)
.attr('width', d => d.data.name.length * 20)
.attr('height', 50)
.attr('transform', (d,i,n) => {
  let x = (d.data.name.length * 10);
  return `translate(${-x}, -25)`
});


enterNodes.append('text')
.attr('text-anchor', 'middle')
.attr('fill', 'white')
.text(d => d.data.name); 

const linkData=tree(rootNode).links(); // not taking treeData cos we want data before descendants() call

// selection for paths & join data for Links
const links=graph.selectAll('.link')
.data(linkData)

links.enter().append('path')
.transition().duration(300)
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#aaa') 
      .attr('stroke-width', 2)
      .attr('d',d3.linkVertical()
          .x(d=>d.x)
          .y(d=>d.y)) // d <-- d3.linkVertical().x(cbf for X ).y(cbf for Y )

}



// data & firebase hook-up
var data = [];

db.collection('employees').onSnapshot(res=> {

  res.docChanges().forEach(change => {

    const doc = {...change.doc.data(), id: change.doc.id};

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }

  });

 update(data);// runs on data chnage , onSnapshot is event listener for firbase 

});