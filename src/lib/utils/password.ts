import { bcrypt as hash, bcryptVerify as verify } from "hash-wasm";

const bcrypt = {
  hash,
  compare: verify,
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
	const salt = new Uint8Array(16);
  const hashedPassword = await bcrypt.hash({
    password,
    costFactor: saltRounds,
    salt,
  });
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  console.log("hashedPassword is ", hashedPassword);
  console.log("password is ", password);
  return await bcrypt.compare({
    password,
    hash: hashedPassword,
  });
}

export async function generatePassword(length: number = 10): Promise<string> {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * charset.length);
    randomString += charset.charAt(randomNumber);
  }
  return randomString;
}
