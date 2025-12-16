function greet(name) {
  return `Hello, ${name}!`;
}

function Animal(name, species) {
  this.name = name;
  this.species = species;
  this.speak = function () {
    return `${this.name} the ${this.species} says hello!`;
  };
}

function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.getInfo = function () {
    return `${this.year} ${this.make} ${this.model}`;
  };
}

let dogesh = new Animal("Dogesh", "Dog");
console.log(dogesh.speak());
