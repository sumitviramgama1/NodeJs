var http = require("http");
var fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");
var api="5d8c1b26d0e75d7b28cf02c6a811a4f5"

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp-273.15).toFixed(2));
  temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min-273).toFixed(2));
  temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max-273).toFixed(2));
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=Anand&appid=5d8c1b26d0e75d7b28cf02c6a811a4f5` //paste your own api key from openweathermap.org 
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");
