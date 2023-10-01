
// legend function
// 'g' translate 
// 'g'.call(legend)

const dims={height:300, width:300,radius:150};
const cent={x:(dims.width/2+5), y:(dims.height/2+5)};

const svg=d3.select('.canvas')
.append('svg')
.attr('height',dims.height+150)
.attr('width',dims.width+150);

const graph=svg.append('g')
.attr("transform",`translate(${cent.x},${cent.y})`);

const pie=d3.pie()
.sort(null)
.value(d=>d.cost);

const color=d3.scaleOrdinal(d3['schemeSet3']);

// arcPath( obj with start & end Angles ) returns string which can be input for "d" attribute
const arcPath=d3.arc() 
.outerRadius(dims.radius)
.innerRadius(dims.radius/2);

const legend=d3.legendColor()
.scale(color)// scale obj is expected input
.shapePadding(10)
.shape('circle');

const legendGroup=svg.append('g')
.attr("transform",`translate(${dims.width+25},10)`)

const tip=d3.tip()
.attr('class','tip card')
.html(d=>{
    let content=`<div class="name">${d.data.name}</div>`
    content+=`<div class="cost">${d.data.cost}</div>`
    content+=`<div class="delete">click slice to delete</div>`
    return content;

})

graph.call(tip)


const update=(data)=>{
    const paths=graph.selectAll('path')
    .data(pie(data)); // join modified data , ie , pie(data), with angles defined too 

    
    // update color scale domain
    color.domain(data.map(item=>item.name));
   

    // call legends
    legendGroup.call(legend)
    legendGroup.selectAll('text')
    .attr('fill','white')
    // exit selection
    paths.exit()
    .transition('exit_transition').duration(750)
    .attrTween('d',arcTweenExit)
    . remove();


    // update existing shapes in case of data update , we want d3 to redraw path arc
    paths
    //.attr('d',arcPath)
    .transition('update_transition').duration(750)
        .attrTween('d',arcTweenUpdate);

    // enter selection
    paths.enter().append('path')
    .attr('class','arc')
    //.attr('d',arcPath)
    .attr('stroke','#ffffff')
    .attr('stroke-width',3)
    .attr("fill",d=>color(d.data.name))
    .each(function(d){this._current=d;}) // when enter dom elm , append _current property as current data obj
    .transition('enter_transition').duration(750)
        .attrTween('d',arcTweenEnter);


  // event hanlders
  graph.selectAll('path')
  .on('mouseover',(d,i,n)=>{tip.show(d,n[i]); handleMouseOver(d,i,n);})
  .on('mouseout', (d,i,n)=>{tip.hide(d,n[i]); handleMouseOut(d,i,n);})
  .on('click', handleClick)




}
var data = [];
db.collection('expenses').onSnapshot(res => {
    res.docChanges().forEach(change => {
        const doc = { ...change.doc.data(), id: change.doc.id }
        switch (change.type) {
            case 'added':
                data.push(doc)
                break;
            case 'modified':
                const index = data.findIndex(item => item.id === doc.id)
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id != doc.id);
                break;

        }

    })
    // D3 interval function run every 1000 s
    d3.interval(() => {
        update(data);
    }, 1000)
})


const arcTweenEnter=(d)=>{
    const i=d3.interpolate(d.endAngle,d.startAngle);
     return function(t){
      d.startAngle=i(t) // at each time 't' compute angle value for transiiton .
      return arcPath(d); // compute attr 'd' based on angles computed .
     }
}

const arcTweenExit=(d)=>{
    const i=d3.interpolate(d.startAngle,d.endAngle);
     return function(t){
      d.startAngle=i(t) // start angle should drop from start pos & move and join at end pos & make arc disaaper
      return arcPath(d);
     }
}

// function keyword to access "this"
function arcTweenUpdate(d){
    // interpolate b/w 2 objects with data & angle properties
    const i=d3.interpolate(this._current,d); // d and not d.data bcos we need the data + angles ( ie pie(data) )
    // update this._current as new value at end of transiiton time_ticker=1 
    this._current=i(1);

    return function(t){
       return arcPath(i(t))
    }

}

// mouse events
const handleMouseOver = (d,i,n) => {
    d3.select(n[i])// d3 select to get access to d3 methods
    .attr('fill','#78797a');
}
const handleMouseOut = (d,i,n) => {
    d3.select(n[i])// 
    .transition('mouseOut').duration(750)
    .attr('fill',color(d.data.name));
}
const handleClick = (d,i,n) => {
    db.collection('expenses').doc(d.data.id).delete();

}