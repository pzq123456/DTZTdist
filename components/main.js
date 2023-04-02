
//<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
// import from the url 
import 'https://cdn.jsdelivr.net/npm/chart.js';

// Create a class for the element
class PopUpInfo extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
      // Create a shadow root
      const shadow = this.attachShadow({mode: 'open'});
      // get data
      this.data = this.getAttribute('data');

      // convert data "[[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]]" to array
      this.data = JSON.parse(this.data);
      //console.log(this.data);

      const wrapper = document.createElement('div');
      wrapper.setAttribute('class', 'wrapper');

      const btn1 = document.createElement('button');
      btn1.setAttribute('id', 'pre');
      btn1.setAttribute('class', 'btn');
      btn1.setAttribute('style', 'width: 25%; height: 100%; ');
      btn1.textContent = 'pre';
      const btn2 = document.createElement('button');
      btn2.setAttribute('id', 'tmx');
      btn2.setAttribute('class', 'btn');
      btn2.setAttribute('style', 'width: 25%; height: 100%; ');
      btn2.textContent = 'tmx';
      const btn3 = document.createElement('button');
      btn3.setAttribute('id', 'tmn');
      btn3.setAttribute('class', 'btn');
      btn3.setAttribute('style', 'width: 25%; height: 100%; ');
      btn3.textContent = 'tmn';
      const btn4 = document.createElement('button');
      btn4.setAttribute('id', 'tmp');
      btn4.setAttribute('class', 'btn');
      btn4.setAttribute('style', 'width: 25%; height: 100%; ');
      btn4.textContent = 'tmp';


      /**
       * <div>
          <canvas id="myChart"></canvas>
        </div>
       */
      const canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'myChart');

  
      // Create some CSS to apply to the shadow dom
      const style = document.createElement('style');
  
      style.textContent = `
      .btn {
        background-color: rgba(0, 0, 0, 0.508);
        border: none;
        color: white;
        border-radius: 12 px;
      }
      .btn:hover {
        background-color: rgba(0, 0, 0, 0.09);
        color: black;
      }
      `;
  
      // Attach the created elements to the shadow dom
      shadow.appendChild(style);
      shadow.appendChild(wrapper);
      wrapper.appendChild(btn1);
      wrapper.appendChild(btn2);
      wrapper.appendChild(btn3);
      wrapper.appendChild(btn4);
      wrapper.appendChild(canvas);

      // setup chart
      const labels = Array.from({length: 120}, (_, i) => 2001 + Math.floor(i / 12) + (i % 12 + 1) / 100);
      this.chart = setupChart(canvas, this.data[0], labels);

      // add event listener
      btn1.addEventListener('click', () => {
        this.chart.data.datasets[0].data = this.data[0];
        this.chart.config.type = 'bar';
        this.chart.data.datasets[0].label = 'Pre';
        this.chart.options.scales.y.title.text = 'mm/Month';
        this.chart.data.datasets[0].backgroundColor = 'rgba(75, 192, 192, 0.2)';
        this.chart.data.datasets[0].borderColor = 'rgba(75, 192, 192, 1)';
        this.chart.update();
      }
      );
      btn2.addEventListener('click', () => {
        this.chart.data.datasets[0].data = this.data[2];
        this.chart.config.type = 'line';
        this.chart.data.datasets[0].label = 'Tmx';
        this.chart.options.scales.y.title.text = 'Celsius Degree';
        this.chart.data.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.2)';
        this.chart.data.datasets[0].borderColor = 'rgba(255, 99, 132, 1)';
        this.chart.data.datasets.push({
          label: 'Tmn',
          data: this.data[3],
        });
        this.chart.data.datasets.push({
          label: 'Tmp',
          data: this.data[1],
        });
        this.chart.update();
        this.chart.data.datasets.pop();
        this.chart.data.datasets.pop();
      }
      );
      btn3.addEventListener('click', () => {
        this.chart.data.datasets[0].data = this.data[3];
        this.chart.config.type = 'line';
        this.chart.data.datasets[0].label = 'Tmn';
        this.chart.options.scales.y.title.text = 'Celsius Degree';
        this.chart.data.datasets[0].backgroundColor = 'rgba(54, 162, 235, 0.2)';
        this.chart.data.datasets[0].borderColor = 'rgba(54, 162, 235, 1)';
        this.chart.data.datasets.push({
          label: 'Tmx',
          data: this.data[2],
        });
        this.chart.data.datasets.push({
          label: 'Tmp',
          data: this.data[1],
        });
        this.chart.update();
        this.chart.data.datasets.pop();
        this.chart.data.datasets.pop();
      }
      );
      btn4.addEventListener('click', () => {
        this.chart.data.datasets[0].data = this.data[1];
        this.chart.config.type = 'line';
        this.chart.data.datasets[0].label = 'Tmp';
        this.chart.options.scales.y.title.text = 'Celsius Degree';
        this.chart.data.datasets[0].backgroundColor = 'rgba(255, 206, 86, 0.2)';
        this.chart.data.datasets[0].borderColor = 'rgba(255, 206, 86, 1)';
        this.chart.data.datasets.push({
          label: 'Tmx',
          data: this.data[2],
        });
        this.chart.data.datasets.push({
          label: 'Tmn',
          data: this.data[3],
        });
        this.chart.update();
        this.chart.data.datasets.pop();
        this.chart.data.datasets.pop();
      }
      );

    }
    // upDate(data) {
    //   this.data = data;
    //   this.chart.data.datasets[0].data = this.data[0];
    //   this.chart.update();
    // }
  }
  
// Define the new element
customElements.define('popup-info', PopUpInfo);


// setup and return the chart object
function setupChart(canvas, data, labels) {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pre',
          data: data,
          borderWidth: 1,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
        }]
      },
      options: {
        scales: {
          x:{
              title: {
                  display: true,
                  text: 'Year'
              },
          },
          y: {
              title: {
                  display: true,
                  text: 'mm/Month'
              },
          }
        }
      }
    });
}




  