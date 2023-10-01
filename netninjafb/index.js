
const svg = d3.select('.canvas').append('svg')
    .attr("width", 600)
    .attr('height', 600);

const margin = { left: 70, top: 10, right: 100, bottom: 100 };
const graphHeight = 600 - margin.top - margin.bottom;
const graphWidth = 600 - margin.right - margin.left;

const graph = svg.append('g')
    .attr("width", graphWidth)
    .attr('height', graphHeight)
    .attr("transform", `translate(${margin.left},${margin.top})`);


const xAxisGroup = graph.append('g')
    .attr("transform", `translate(0,${graphHeight})`)

const yAxisGroup = graph.append('g')
// scales
const y = d3.scaleLinear()
    .range([graphHeight, 0])

const x = d3.scaleBand()
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2)

// create axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y).ticks(3)
    .tickFormat(d => `${d} orders`);

// externalise transiiton as varibale
const t = d3.transition().duration(3500);

const update = (data) => {
    y.domain([0, d3.max(data, d => d.orders)]);
    x.domain(data.map(d => d.name));
    // actual drawing of axes happen when ter called , hence tat part alone isnide update()
    // redraw axes via call()
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // join data 
    const rects = graph.selectAll('rect')
        .data(data)


    // remove extra shapes
    rects.exit().transition(500).remove();

    // update existing shapes
    rects.attr("width", x.bandwidth())
        .attr("fill", 'orange')
        .attr("x", (d, i) => x(d.name))
        // .transition(t)
        //     .attr("height", (d) => graphHeight - y(d.orders))
        //     .attr("y", (d, i) => y(d.orders))


    // append enter selection to dom
    rects.enter().append('rect')
        .attr("width", 0)
        .attr("y", graphHeight)
        .attr("height", 0)
        .attr("fill", 'orange')
        .attr("x", (d, i) => x(d.name))
        .merge(rects)
        .transition(t)
            .attrTween("width",widthTween)
            .attr("y", (d, i) => y(d.orders))
            .attr("height", (d) => graphHeight - y(d.orders))


    xAxisGroup.selectAll('text')
        .attr("transform", `rotate(-40)`)
        .attr("text-anchor", 'end')
        .attr("fill", 'orange')




}
var data = [];
db.collection('dishes').onSnapshot(res => {
    res.docChanges().forEach(change => {
        console.log(change)
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

const widthTween=(d)=>{
    const i=d3.interpolate(0,x.bandwidth());
    return function(t){
        return i(t);
    }
}