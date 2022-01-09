const diCaprioBirthYear = 1974;
const age = function(year) { 
    return year - diCaprioBirthYear
}
const today = new Date().getFullYear()
const ageToday = age(today)


const width = 1000
const height = 800
const margin = {
    top: 10,
    bottom: 40,
    left: 40,
    right: 10
}

const svg = d3.select("#chart").append("svg").attr("id", "svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

var x = d3.scaleBand().range([0, width - margin.left - margin.right ]).padding(0.2)
var y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])

const axisGroup = svg.append("g").attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y).ticks(20)

var tooltip = elementGroup.append("g").attr("id", "tooltip")
var maxRefLine = tooltip.append("line").attr("id", "maxRefLine")
var maxRefText = tooltip.append("text").attr("id", "maxRefText")

d3.csv("data.csv").then(data => {
    data.map(d =>{
        d.age = +d.age
        d.year = +d.year
    })
        
    x.domain(data.map(d => d.year))
    y.domain([
        d3.min(data.map(d => d.age-2)),
        ageToday
    ])

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)


    maxRefLine
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(d3.max(data.map(d => d.age))))
        .attr("y2", y(d3.max(data.map(d => d.age))))

    maxRefText
        .attr("transform", `translate(${width-110}, ${y(d3.max(data.map(d => d.age))) -4})`)
        .text("Age Limit")

    var elements = elementGroup.selectAll("rect").data(data)

    var colours = d3.scaleOrdinal().domain((data.map(d => d.name))).range(d3.schemeRdYlGn[8])

    elements.enter().append("rect")
        .attr("height", d => height - margin.top - margin.bottom - y(d.age)) 
        .attr("y", d => y(d.age)) 
        .attr("x", d => x(d.year)) 
        .attr("width", x.bandwidth()) 
        .attr('id', d=> d.name)
        .attr("fill", d => colours(d.name))
        .append("title").text(d => d.name)
     
    elements.enter().append("text")
        .attr("fill", "black")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.age))
        .attr("dx", x.bandwidth()/2)
        .attr('dy', '1em')
        .text(d=> d.age)

    elements.enter().append("line")
        .attr("x1", x(d3.min(data.map(d => d.year))) + x.bandwidth()/2) 
        .attr("x2", x(d3.max(data.map(d => d.year))) + x.bandwidth()/2)
        .attr("y1", y(age(1998)))
        .attr("y2", y(age(2019)))
    
 /*   elements.enter().append("path")
        .attr("id", "Di_Caprio")
        .attr("d", d3.line()
        .x(d => x(d3.min(data.map(d => d.year))) + x.bandwidth()/2)
        .y(d => d.age(2019)))*/

    elements.enter().append("circle")
        .attr("cx", d => x(d.year) + x.bandwidth()/2) 
        .attr("cy",  y(age(1998)))
        .attr("r", 8)
    
    
        
})



