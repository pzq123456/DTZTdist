import 'https://cdn.jsdelivr.net/npm/chart.js';
// "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.2.1/chart.js" 
// Create a class for the element
class Yield extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        // Create a shadow root
        const shadow = this.attachShadow({mode: 'open'});
        // get data
        this.data = this.getAttribute('data');
        this.data = JSON.parse(this.data);
        this.labels = this.getAttribute('labels');
        this.labels = JSON.parse(this.labels);
        this.name = this.getAttribute('name');

        // create canvas
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'myChart');

        // Attach the created elements to the shadow dom
        shadow.appendChild(canvas);
        // setup chart
        this.chart = setupChart(canvas, this.data, this.labels, this.name);

    }
  }
  
// Define the new element
customElements.define('yield-info', Yield);


function setupChart(canvas, data, labels, name) {
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Yield',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data,
            }]
        },
        options: {
            plugins: {
                title: {
                  display: true,
                  text: name+'-冬小麦年产量',
                    font: {
                        size: 20
                    },
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                    display: true,
                    text: '年份',
                    font: {
                        size: 10,
                        weight: 'bold',
                        lineHeight: 1.2,
                    },
                    padding: {top: 20, left: 0, right: 0, bottom: 0}
                    }
                },
                y: {
                    display: true,
                    title: {
                    display: true,
                    text: '产量： 吨/公顷',
                    font: {
                        size: 10,
                        style: 'normal',
                        lineHeight: 1.2
                    },
                    padding: {top: 30, left: 0, right: 0, bottom: 0}
                    }
                }
                }
        },
              
    });
    return chart;
}

  
