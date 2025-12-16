function Person(name, age) {
  this.name = name;
  this.age = age;
}

let john = new Person("John", 30);
console.log(john.name);

Arrays.prototype.mrunal = function () {
  return "Hello Mrunal!";
};

let arr = [1, 2, 3];

console.log(arr.mrunal());

//Encapsulation
class BankAccount {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }

  getBalance() {
    return `${this.#balance}`;
  }
}

let account = new BankAccount();
console.log(account.deposit(100));
console.log(account.getBalance());

//Abstraction
class CoffeMachine {
  start() {
    //call db
    return `Starting the machine`;
  }

  brewCoffee() {
    return `Brewing coffee`;
  }

  pressStartButton() {
    let msg1 = this.start();
    let msg2 = this.bewCoffee();
    return `${msg1}+${msg2}`;
  }
}

let coffee = new CoffeeMachine();
Console.log(coffee.pressStartButton());

//Polymorphism
class Bird {
  fly() {
    return `Flying..`;
  }
}

class Penguin extends Bird {
  fly() {
    `Penguins can't fy`;
  }
}
let bird = new Bird();
let penguin = new Penguin();

console.log(bird.fly());
console.log(penguin.fly());

//static method
class Calculator {
  static add(a, b) {
    return a + b;
  }
}

let miniCal = new Calculator();
console.log(Calculator.add(5, 10));
console.log(miniCal.add(5, 10));
