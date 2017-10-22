module.exports = function(dateRanges, sentimentsByMonth){
    return (
        `          
        <div id='curve_chart'></div>
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <script type="text/javascript">
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        var table = [];
        var dateRanges = [${dateRanges.map((el) => `"${el.join(" - ")}"`)}];
        var sentiments = [${sentimentsByMonth.map((el) => `${el}`)}];
        
        for (let i = 0; i < 12; i++){
            table.push([dateRanges[i], sentiments[i]]);
        }
        
        function drawChart() {
          var parsed = JSON.parse(JSON.stringify([['Date Range', 'Sentiment']].concat(table)))
          var data = google.visualization.arrayToDataTable(parsed);
        
          var options = {
            title: 'Positivity Analysis per Month',
            curveType: 'function',
            legend: { position: 'bottom' }
          };
          
          var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        
          chart.draw(data, options)
          }
        window.onresize = function(event){
            drawChart();
        };
        </script>
        `       
    );
};