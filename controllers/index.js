const fs = require('fs');
const path = require('path');

function loadControllers(dir, controllers = {}) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      // Jika itu direktori, panggil rekursif lagi
      loadControllers(filePath, controllers);
    } else {
      // Jika itu file, tambahkan ke daftar controllers
      const controller = require(filePath);
      const fileName = path.parse(file).name;
      controllers[fileName] = controller;
    }
  });

  return controllers;
}

const controllers = loadControllers(__dirname);

module.exports = controllers;