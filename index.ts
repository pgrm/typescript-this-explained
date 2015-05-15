/// <reference path="typings/tsd.d.ts" />

class A {
	classDesc = 'a Class A';
	ma1 = () => {
		if (!this) {
			console.log("This doesn't exist");
		} else if (this == <any>global) {
			console.log("`this` is `global`")
		} else {
			console.log(this.classDesc);
		}
	}
	ma2() {
		if (!this) {
			console.log("This doesn't exist");
		} else if (this == <any>global) {
			console.log("`this` is `global`")
		} else {
			console.log(this.classDesc);
		}
	}
}

class B {
	classDesc = 'b Class B';
	mb1 = () => {
		if (!this) {
			console.log("This doesn't exist");
		} else if (this == <any>global) {
			console.log("`this` is `global`")
		} else {
			console.log(this.classDesc);
		}
	}
	mb2() {
		if (!this) {
			console.log("This doesn't exist");
		} else if (this == <any>global) {
			console.log("`this` is `global`")
		} else {
			console.log(this.classDesc);
		}
	}
}

var a = new A();
var b = new B();

a.ma1(); // prints 'a Class A'
a.ma2(); // prints 'a Class A'
b.mb1(); // prints 'b Class B'
b.mb2(); // prints 'b Class B'

console.log();
console.log("so far clear? - let's go to the next step ...");
console.log();

var fa1 = a.ma1;
var fa2 = a.ma2;
var fb1 = b.mb1;
var fb2 = b.mb2;

fa1(); // prints 'a Class A' - because it is defined with an arrow (=>)
fa2(); // prints '`this` is `global`' - if the function isn't called on any object, the default object (in nodejs `global` and in the browser `window` is used for `this`)
fb1(); // prints 'b Class B' - because it is defined with an arrow (=>)
fb2(); // prints '`this` is `global`' - if the function isn't called on any object, the default object (in nodejs `global` and in the browser `window` is used for `this`)

console.log();
console.log("let's make it more tricky ...");
console.log();

fa1.bind(a)(); // prints 'a Class A' - is the same as a.ma1()
fa2.bind(a)(); // prints 'a Class A' - is the same as a.ma2()
fb1.bind(b)(); // prints 'b Class B' - is the same as b.mb1()
fb2.bind(b)(); // prints 'b Class B' - is the same as b.mb2()

console.log();
console.log("ok - let's finish this up ...");
console.log();

// notice, a and b in bind are mixed, compared to last try

fa1.bind(b)(); // prints 'a Class A' - is the same as b.ma1(), however `this` doesn't change because of the arrow (=>)
fa2.bind(b)(); // prints 'b Class B' - is the same as b.ma2()
fb1.bind(a)(); // prints 'b Class B' - is the same as a.mb1(), however `this` doesn't change because of the arrow (=>)
fb2.bind(a)(); // prints 'a Class A' - is the same as a.mb2()

// TypeScript forbids in some cases having a function defined with arrow syntax (=>) 
// outside of another function or a class
var individualM1 = () => {
	if (!this) {
		console.log("This doesn't exist");
	} else if (this == <any>global) {
		console.log("`this` is `global`")
	} else {
		console.log(this.classDesc);
	}
}

var individualM2 = function() {
	if (!this) {
		console.log("This doesn't exist");
	} else if (this == <any>global) {
		console.log("`this` is `global`")
	} else {
		console.log(this.classDesc);
	}
}

console.log();
console.log("let's try som additional and individual functions now...");
console.log();

individualM1(); // prints 'undefined' - see further down why it prints 'undefined' 
individualM2(); // prints '`this` is `global`' - for the same reason fa2() and fb2()
individualM1.bind(a)(); // prints 'undefined' - is the same as a.individualM1(), however `this` doesn't change because of the arrow (=>)
individualM2.bind(a)(); // prints 'a Class A' - is the same as a.individualM2()
individualM1.bind(b)(); // prints 'undefined' - is the same as b.individualM1(), however `this` doesn't change because of the arrow (=>)
individualM2.bind(b)(); // prints 'b Class B' - is the same as b.individualM2()

console.log();
console.log("Last question, why does individualM1 print always undefined? what is the value of `this`?");
console.log(this); // prints '{}' which equals to an empty object. That is the same `this` as inside individualM1 - that's why it always prints undefined

console.log();
console.log("Let's add a new class and see how it will behave now ...");
console.log();

class C {
	classDesc = 'c Class C';
	
	runF1 = (f: () => void) => { 
		f(); 
	}
	runF2(f: () => void) { 
		f(); 
	}
	
	runF1bound = (f: () => void) => { 
		f.apply(this); // is the same as f.bind(this)() 
	}
	runF2bound(f: () => void) { 
		f.apply(this); // is the same as f.bind(this)() 
	}
}

var c = new C();

c.runF1(a.ma1); // prints 'a Class A'
c.runF1(a.ma2); // prints '`this` is `global` - for the same reason as fa2() and fb2()
c.runF1(b.mb1); // prints 'b Class B'
c.runF1(b.mb2); // prints '`this` is `global` - for the same reason as fa2() and fb2()
c.runF2(a.ma1); // prints 'a Class A'
c.runF2(a.ma2); // prints '`this` is `global` - for the same reason as fa2() and fb2()
c.runF2(b.mb1); // prints 'b Class B'
c.runF2(b.mb2); // prints '`this` is `global` - for the same reason as fa2() and fb2()

console.log();
console.log("And now the same thing with bindings ...");
console.log();

c.runF1(a.ma1.bind(a)); // prints 'a Class A'
c.runF1(a.ma2.bind(a)); // prints 'a Class A'
c.runF1(b.mb1.bind(b)); // prints 'b Class B'
c.runF1(b.mb2.bind(b)); // prints 'b Class B'
c.runF2(a.ma1.bind(a)); // prints 'a Class A'
c.runF2(a.ma2.bind(a)); // prints 'a Class A'
c.runF2(b.mb1.bind(b)); // prints 'b Class B'
c.runF2(b.mb2.bind(b)); // prints 'b Class B'

console.log();
console.log("What about binding them explicitly ...");
console.log();

c.runF1bound(a.ma1); // prints 'a Class A' - because it is definde with the arrow notaions (=>)
c.runF1bound(a.ma2); // prints 'c Class C' - the same as c.ma2()
c.runF1bound(b.mb1); // prints 'b Class B' - because it is definde with the arrow notaions (=>)
c.runF1bound(b.mb2); // prints 'c Class C' - the same as c.mb2()
c.runF2bound(a.ma1); // prints 'a Class A' - because it is definde with the arrow notaions (=>)
c.runF2bound(a.ma2); // prints 'c Class C' - the same as c.ma2()
c.runF2bound(b.mb1); // prints 'b Class B' - because it is definde with the arrow notaions (=>)
c.runF2bound(b.mb2); // prints 'c Class C' - the same as c.mb2()

console.log();
console.log("And now, binding an already bound function ...");
console.log();

c.runF1bound(a.ma1.bind(a)); // prints 'a Class A' - because it is defined with the arrow notaion (=>)
c.runF1bound(a.ma2.bind(a)); // prints 'a Class A' - the first bind applies and can't be overwritten or changed
c.runF1bound(b.mb1.bind(b)); // prints 'b Class B' - because it is defined with the arrow notaion (=>)
c.runF1bound(b.mb2.bind(b)); // prints 'b Class B' - the first bind applies and can't be overwritten or changed
c.runF2bound(a.ma1.bind(a)); // prints 'a Class A' - because it is defined with the arrow notaion (=>)
c.runF2bound(a.ma2.bind(a)); // prints 'a Class A' - the first bind applies and can't be overwritten or changed
c.runF2bound(b.mb1.bind(b)); // prints 'b Class B' - because it is defined with the arrow notaion (=>)
c.runF2bound(b.mb2.bind(b)); // prints 'b Class B' - the first bind applies and can't be overwritten or changed
