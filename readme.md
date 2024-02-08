# RSA Module

This is a Node.js module for RSA encryption and decryption.


## Usage

Create a new RSA object with the desired configuration:

(You don't need to define a configuration)

```javascript
let config = {bits: 16, Prime1: 0, Prime2: 0, E: 0, D: 0}
let rsa = new RSA(config);
```

The `RSA` constructor takes a configuration object with the following properties:

- `bits`: The number of bits in the RSA key. Default is 16. If you make bits, you wont be able to generate a Prime I would suggest a maximum of 45 bits.
- `Prime1`: The first prime number. If not provided, it will be generated.
- `Prime2`: The second prime number. If not provided, it will be generated.
- `E`: The public exponent. If not provided, it will be generated.
- `D`: The private exponent. If not provided, it will be generated.

## Methods

The `RSA` class provides several methods for encryption, decryption, and key generation:

- `generateKeys()`: This method is used to generate the public and private keys for the RSA encryption. It uses the provided or generated prime numbers and public exponent to calculate `d`, `e` and `n`. It returns an object: `{p ,q, e, d, n}`

- `isPrime(num)`: This method checks if a number is prime. It takes a BigInt number as input and returns a boolean value indicating whether the number is prime or not.

- `generatePrime(bits)`: This method generates a prime number of a given bit length. It uses a random number generator to generate a random number of the specified bit length, then checks if the number is prime. If not, it generates a new number and checks again, repeating this process until a prime number is found.

- `encrypt(message)`: This method encrypts a message using the public key. It takes a string message as input, converts the message to a BigInt representation, and then uses the public key to encrypt the message. The encrypted message is returned as a BigInt.

- `decrypt(encryptedMessage)`: This method decrypts an encrypted message using the private key. It takes an encrypted message as a BigInt, uses the private key to decrypt the message, and then converts the BigInt representation back to a string. The decrypted message is returned as a string.

## Errors

If the provided prime numbers are not prime or not of type BigInt, an error will be logged to the console.

## License

This project is licensed under the MIT License.
