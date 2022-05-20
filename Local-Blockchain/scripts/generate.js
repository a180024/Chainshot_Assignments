import EC from "elliptic";

const ec = new EC.ec("secp256k1");

const key = ec.genKeyPair();

console.log({
  privateKey: key.getPrivate().toString(16),
  publicKey: key.getPublic().encode("hex"),
});
