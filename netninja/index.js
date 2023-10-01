

const svg=d3.select('.canvas').append('svg')
.attr("width",600)
.attr('height',600);

const margin={left:70,top:10,right:100,bottom:100};
const graphHeight=600-margin.top-margin.bottom;
const graphWidth=600-margin.right-margin.left;

const graph=svg.append('g')
.attr("width",graphWidth)
.attr('height',graphHeight)
.attr("transform",`translate(${margin.left},${margin.top})`);


const xAxisGroup=graph.append('g')
.attr("transform",`translate(0,${graphHeight})`)

const yAxisGroup=graph.append('g')


d3.json('menu.json').then(data=>{
    // scale

    const min=d3.min(data,d=>d.orders);
    const max=d3.max(data,d=>d.orders);

    const y=d3.scaleLinear()
    .domain([0,max])
    .range([graphHeight,0])


    const x=d3.scaleBand()
    .domain(data.map(d=>d.name))
    .range([0,500])
    .paddingInner(0.2)
    .paddingOuter(0.2)


    // create & call axes
    // create axis with scale obj
    const xAxis=d3.axisBottom(x);
    const yAxis=d3.axisLeft(y).ticks(3)
    .tickFormat(d=>`${d} orders`);
    // call axes from group 
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup.selectAll('text')
    .attr("transform",`rotate(-40)`)
    .attr("text-anchor",'end')
    .attr("fill",'orange')

    console.log(x('veg curry'))
    // join data to rects
    const rects=graph.selectAll('rect')
    .data(data)

    rects.attr("width",x.bandwidth())
    .attr("height",(d)=>graphHeight-y(d.orders))
    .attr("fill",'orange')
    .attr("x",(d,i)=>x(d.name))
    .attr("y",(d,i)=>y(d.orders))

   rects.enter().append('rect')
   .attr("width",x.bandwidth())
   .attr("height",(d)=>graphHeight-y(d.orders))
    .attr("fill",'orange')
    .attr("x",(d,i)=>x(d.name))
    .attr("y",(d,i)=>y(d.orders))



    }
)