const mapper = {
    2005: 0,
    2006: 1,
    2007: 2,
    2008: 3,
    2009: 4,
    2010: 5,
    2011: 6,
    2012: 7,
    2013: 8,
    2014: 9
}
class animationMap extends HTMLElement {
    constructor() {

        // Always call super first in constructor
        super(); 
        this.yeildList = null;
        this.year = 2005;
        // Create a shadow root
        const shadow = this.attachShadow({mode: 'open'});
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        const toolBar = document.createElement('div');
        toolBar.setAttribute('class', 'toolBar');
        const name = document.createElement('div');
        name.setAttribute('class', 'name');
        name.innerHTML = '动态地图----Year: ' + this.year;
        const range = document.createElement('input');
        range.setAttribute('class', 'range');
        range.setAttribute('type', 'range');
        range.setAttribute('min', '2005');
        range.setAttribute('max', '2014');
        range.setAttribute('value', this.year);
        range.setAttribute('step', '1');
        // range.addEventListener('input', (e) => {
        //     this.year = e.target.value;
        //     name.innerHTML = '动态地图----Year: ' + this.year;
        // }
        // );
        toolBar.appendChild(name);
        toolBar.appendChild(range);
        // Create canvas 
        const canvas = document.createElement('canvas');
        canvas.setAttribute('class', 'canvas');
        canvas.setAttribute('width', '590');
        canvas.setAttribute('height', '490');


        // Create some CSS to apply to the shadow dom
        const style = document.createElement('style');
        style.textContent = `
        .toolBar {
            display: flex;
            flex-direction: row;
            height: 30px;
            background-color: rgba(61, 59, 59, 0.508);
        }
        `;

        // Attach the created elements to the shadow dom
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(toolBar);
        wrapper.appendChild(canvas);

        // draw the map
        drawMap(canvas);
        drawPointsInit(canvas,this);

        range.addEventListener('input', (e) => {
            this.year = e.target.value;
            name.innerHTML = this.year;
            update(canvas, this.year);
        })

        animation(range,name,canvas, 2005);
    }
  }
  
  // Define the new element
  customElements.define('animation-map', animationMap);

function drawBorder(canvas){

    let height = canvas.height;
    let width = canvas.width;
    let context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.lineTo(0, 0);
    context.stroke();
}

function drawMap(canvas) {

    let context = canvas.getContext('2d');
    context.strokeStyle = "#000";
    drawBorder(canvas);

    var path = d3.geoPath()
    .context(context)
    .projection(d3.geoMercator()
        .center([105,31])
        .scale(750)
        .translate([canvas.width / 2, canvas.height / 2]));
    context.lineWidth = 0.3;

    // draw the map
    shapefile.open("shape/01.shp", null)
        .then(function(source) {
            return source.read().then(function next(result) {
            if (result.done) return;
            // fill with gray
            // set the stroke color to white
            context.fillStyle = "#ccc";
            context.strokeStyle = "#fff";
            context.beginPath();
            path(result.value);
            context.fill();
            context.stroke();
            return source.read().then(next);
            });
        })
        .catch(function(error) {
            console.error(error.stack);
    });
}

function drawPointsInit(canvas,map){
    let context = canvas.getContext('2d');
    var path = d3.geoPath()
    .context(context)
    .projection(d3.geoMercator()
        .center([105,31])
        .scale(750)
        .translate([canvas.width / 2, canvas.height / 2]));
    context.lineWidth = 0.3;

    d3.csv("yield.csv").then(function(data) {
        let yeildList = [];
 
        for (let j = 2005; j < 2015; j++) {
                let tmp = [];
                for (let i = 0; i < data.length; i++) {
                    tmp.push(data[i][j]);
                }
                yeildList.push(tmp);
            }


        for (let i = 0; i < data.length; i++) {
            let county_ID = data[i].ID;
            let county_name = data[i].County;
            let county_longitude = data[i].lon;
            let county_latitude = data[i].lat;
            // draw the point
            context.beginPath();
            path.pointRadius(2);
            // add the point radius bigger
            path.pointRadius(3);
            path({type: "Point", coordinates: [county_longitude, county_latitude]});
            // calculate the color by the yield
            let yield_value = data[i][map.year];
            let color = calculateColor(yield_value, yeildList[0]);
            context.fillStyle = color;
            context.fill();
            context.stroke();

            drawLegend(yield_value, yeildList[0], context, canvas.height, canvas.width, 10, 290);
        }
    });
}


/**
 * calculate the color by the yield
 * @param {number} yield_value
 * @param {array} yeildList
 */
function calculateColor(yield_value, yeildList) {
    // get the max and min value of the yield
    let max = d3.max(yeildList);
    let min = d3.min(yeildList);
    // console.log(max);
    // console.log(min);
    // calculate the color
    let color = d3.interpolateRdYlGn((yield_value - min) / (max - min));
    return color;
}


/**
 * draw the legend
 * @param {number} yield_value
 * @param {array} yeildList
 * @param {canvascontext2d} ctx
 * @param {number} height
 * @param {number} width
 * @param {number} x
 * @param {number} y
*/
function drawLegend(yield_value, yeildList, ctx, height, width, x, y) {
    
    // using x,y control the position of the legend
    // draw the rect in the canvas right bottom
    // get the max and min value of the yield
    let max = d3.max(yeildList);
    let min = d3.min(yeildList);
    // calculate the color
    
    // between max and min sample smoothly (100 samples)
    let colorList = d3.range(min, max, (max - min) / 100).map(function(d) {
        return d3.interpolateRdYlGn((d - min) / (max - min));
    });
    // draw the legend bar
    let legendWidth = 20;
    let legendHeight = 200;
    let legendX = x;
    let legendY = y;
    let legend = ctx.createLinearGradient(legendX, legendY, legendX, legendY + legendHeight);
    for (let i = 0; i < colorList.length; i++) {
        legend.addColorStop(i / colorList.length, colorList[i]);
    }
    ctx.fillStyle = legend;
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
    // draw the legend text
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    // max and min value
    ctx.fillText(max, legendX + legendWidth + 5, legendY + 10);
    ctx.fillText(min, legendX + legendWidth + 5, legendY + legendHeight - 10);
}

function update(canvas, year){
    console.log(year);
    let context = canvas.getContext('2d');
    clearCanvas(canvas);

    drawMap(canvas);
    var path = d3.geoPath()
    .context(context)
    .projection(d3.geoMercator()
        .center([105,31])
        .scale(750)
        .translate([canvas.width / 2, canvas.height / 2]));
    context.lineWidth = 0.3;

    d3.csv("yield.csv").then(function(data) {
        let yeildList = [];
 
        for (let j = 2005; j < 2015; j++) {
                let tmp = [];
                for (let i = 0; i < data.length; i++) {
                    tmp.push(data[i][j]);
                }
                yeildList.push(tmp);
            }

        for (let i = 0; i < data.length; i++) {
            let county_ID = data[i].ID;
            let county_name = data[i].County;
            let county_longitude = data[i].lon;
            let county_latitude = data[i].lat;
            // draw the point
            context.beginPath();
            path.pointRadius(2);
            // add the point radius bigger
            path.pointRadius(3);
            path({type: "Point", coordinates: [county_longitude, county_latitude]});
            // calculate the color by the yield
            let yield_value = data[i][year];

            let color = calculateColor(yield_value, yeildList[mapper[year]]);
            context.fillStyle = color;
            context.fill();
            context.stroke();

            drawLegend(yield_value, yeildList[mapper[year]], context, canvas.height, canvas.width, 10, 290);
        }
    });
}

function clearCanvas(canvas){
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// animation the map(change the slider value)
function animation(slider,output,canvas) {
    output.innerHTML = slider.value;
    slider.oninput = function() {
        output.innerHTML = this.value;
    }
    var id = setInterval(frame, 1000);

    function frame() {
        if (slider.value == 2014) {
            clearInterval(id);
        } else {
            slider.value++;
            output.innerHTML = slider.value;
            update(canvas,slider.value);
        }
    }
}