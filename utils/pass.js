import bcrypt from "bcrypt";
const saltRounds = 10;
// export const encryptedPass = async (password) => {
//   const salt = await bcrypt.genSalt(saltRounds); //await pauses here, and will resume once it has the Promise resolved
//   console.log("Here is the salt:", salt);

//   const hash = await bcrypt.hash(password, salt);
//   console.log("Here is the hash", hash);
//   return hash;
// };

export const encryptedPass = bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.log("error while trying to bcrypt", err);
    return;
  }
  return hash;
});
