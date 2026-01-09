const bcrypt = require("bcryptjs");

(async () => {
  const password = "mm1234"; // <-- EXACT password you type
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
})();
