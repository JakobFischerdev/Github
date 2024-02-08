let BigNumber = require('bignumber.js');

global.crypto = require('crypto')
BigNumber.config({ CRYPTO: true }); // use the cryptographically secure random number generator
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
BigNumber.set({ROUNDING_MODE: BigNumber.ROUND_DOWN});



class RSA {
  constructor(config = {bits: 16, Prime1: 0, Prime2: 0, E: 0, D: 0}) {
    //one can define all the variables by themself or they will be generated

    //{bits: bits, Prime1: p, Prime2: q, E: e, D: d}
      this.config = config;

      //checks if it is a prime and bigint
      if ( this.isPrime(config.p) && typeof config.p === "bigint") {
        this.p = config.p;
      } else if (config.p) {
        console.error(
          "Error: Prime1 is not a prime number or not of type BigInt"
        );
      }

      if (this.isPrime(config.q) && typeof config.q === "bigint") {
        this.q = config.q;
      } else if (config.q) {
        console.error(
          "Error: Prime2 is not a prime number or not of type BigInt"
        );
      }

      if (typeof config.e === "bigint") this.e = e;
      else if(config.e) console.error("Error: E is not of type BigInt");

      if (typeof config.d === "bigint") this.d = d;
      else if(config.e) console.error("Error: E is not of type BigInt");

      this.bits = config.bits;
    
    
  }

  async generateKeys() {
    //Step 1
    //generate two prime numbers
    this.p = this.p || (await this.generatePrime());
    this.q = this.q || (await this.generatePrime());

    //Step 2
    //calculate n
    this.n = this.n || this.p * this.q;

    //Step 3
    //calculate phi
    this.phi = (this.p - 1n) * (this.q - 1n);

    //Step 4
    //calculate e
    this.e = this.e || 65537n;

    //check if e is coprime to phi
    while (this.gcd(this.e, this.phi) != 1n) {
      e += 2n;
    }

    //Step 5
    //calculate d
    this.d = this.modInverse(this.e, this.phi);

    return {
      p: this.p,
      q: this.q,
      e: this.e,
      d: this.d,
      n: this.n,
    };
  }

  //gcd using the Euclidean algorithm
  gcd(a, b) {
    let r; //remainder
    do {
      r = a % b;
      a = b;
      b = r;
    } while (r != 0);
    return a;
  }

  isPrime(num) {
    //checks if a number is prime



    if (!num) {
      return false;
    }

    num = new BigNumber(num.toString());

    if (num.modulo(2).eq(0) || num.modulo(3).eq(0)) {
      return false;
    }

    // prime numbers are always of the form 6n+-1,
    // we can start at 5 since we have already checked 2 and 3
    for (let i = 5; num.sqrt().gt(i); i = i + 6) {
      if (
        num.modulo(i).eq(0) ||
        num.modulo(i + 2).eq(0)
      ) {
        return false;
      }
    }
    return true;
  }

  generatePrime(bits) {
    bits = bits || this.bits;
    //generate random Prime Number between 2^bits and 2^(bits+1)
    return new Promise((resolve, reject) => {
      let num;

      do {
        let random = BigNumber.random();
        let max = new BigNumber(2).pow(bits + 1);
        let min = new BigNumber(2).pow(bits);
        let rand = random.mul(max.minus(min));
        rand = rand.round(0, BigNumber.ROUND_HALF_EVEN);
        num = rand.plus(min);
      } while (!this.isPrime(num));

      return resolve(BigInt(num.toString()));
    });
  }

  modInverse(a, b) {
    a = new BigNumber(a);
    b = new BigNumber(b);
    let b_old = b;

    let x = new BigNumber(0);
    let y = new BigNumber(1);
    let q = new Array();
    let i = 0;
    let r;

    do {
      let buffer = a.dividedBy(b).floor();
      q[i] = buffer;
      r = a.minus(q[i].times(b));
      a = b;
      b = r;

      i++;
    } while (!r.equals(1));

    for (; i > 0; i--) {
      let buffer = y;
      y = x.minus(q[i - 1].times(y));
      x = buffer;
    }

    if (x < 0) {
      x = x.plus(b_old);
    }

    return BigInt(x.toString());
  }

  qme(a, b, c1) {
    //modular exponentiation

    let result = 1n;
    b = BigInt(b);
    a = BigInt(a);
    c1 = BigInt(c1);

    while (b != 0n) {
      if (b % 2n == 1n) {
        result = (result * a) % c1;
      }
      a = (a * a) % c1;
      b = b >> 1n;
    }

    return result % c1;
  }

  ChartoCode(s){
    let charCode = new String(); 
    
    for(let i = 0; i < s.length; i++){
        let code = s.charCodeAt(i);
        charCode += code;
    }
    
    return charCode;
}



CodetoChar(cs){


  cs = new String(cs);
  let string = new String();

  let codeLength = 2;
  

   // Split the string into chunks of 'codeLength' characters
   for (let i = 0; i < cs.length; i += codeLength) {
    if(cs[i] == 1 || cs[i] == 2)
      codeLength = 3;
    else
      codeLength = 2;

    let code = cs.substr(i, codeLength);

    // Convert each ASCII code to a character and add it to the string
    string += String.fromCharCode(parseInt(code));


  }


  
  return string;

}


  async encrypt(m) {

    

    m = BigInt(this.ChartoCode(m));

    if(!m){
      console.error("Error: message not defined");
      return false;
    } 

    if(m > this.n){
      console.error("Error: Message to big\n Make P and Q bigger but note that generating new Primes may take very long depending on how big config.bits is")
      return false;
    }

    if(this.e && this.n && this.d) 
      return this.qme(m, this.e, this.n);
    else{
      await this.generateKeys();
      if(m > this.n){
        console.error("Error: Message to big\n Make P and Q bigger but note that generating new Primes may take very long depending on how big config.bits is")
        return false;
      }
      return this.qme(m, this.e, this.n);
    }


  }

  async decrypt(c) {

    if(!c){
      console.error("Error: encrypted message not defined");
      return false;
    } 

    if(this.e && this.n && this.d && c) 
      return this.CodetoChar(this.qme(c, this.d, this.n).toString());
    else 
      console.error("Error: encrypted message or keys not defined") 
  }
}

module.exports = RSA;


