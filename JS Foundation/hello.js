// console.log("Hello World");

let teaFlavours =["green tea", "black tea", "oolong tea"];
let firstTea = teaFlavours[0];


let cities = ["london", "paris", "new york"];
let favouriteCity = cities[2];

let teaTypes = ["herbal tea", "masala chai", "jasmine tea"];
teaTypes[1]="white tea";

let citiesVisited = ["Mumbai","Sydney"];

citiesVisited.push("Berlin");


let teaOrders = ["chai", "iced tea", "earl grey"];
let lastOrder = teaOrders.pop();

let popularTeas =["green tea","oolong tea", "chai"];
let softCopyTeas = popularTeas;

let topCities = ["Berlin", "Singapore", "New York"];
let hardCopyCities = new Array(...topCities);

let europeanCities = ["Paris", "Rome"];
let asianCities = ["Tokyo", "Bangkok"];
let worldCities = [...europeanCities, ...asianCities];


let teaMenu = ["masala chai", "oolong tea", "oolong tea", "green tea"];
let menuLength = teaMenu.length;

let cityBucketList = ["Kyoto", "London", "Cape Town", "Vancouver"];

let isLondonInList = cityBucketList.includes("London");