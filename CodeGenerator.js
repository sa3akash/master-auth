const codeGenerator = (length = 6) => {
  const code = Array.from(
    { length },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");

  return code;
};

const code = codeGenerator(4);
console.log(code)