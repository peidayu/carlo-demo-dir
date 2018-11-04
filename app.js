const carlo = require('carlo');
const path = require('path');
const fs = require('fs');

(async () => {
  // Launch the browser.
  const app = await carlo.launch();

  // Terminate Node.js process on app window closing.
  app.on('exit', () => process.exit());

  // Tell carlo where your web files are located.
  app.serveFolder(path.join(__dirname, './views'));

  await app.exposeFunction('exit', () => {
    console.log('close app');
    process.exit();
  });

  // list dir
  await app.exposeFunction('ls', (pathname) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, pathname), (err, list) => {
            console.log('read dir -> ' + path.join(__dirname, pathname));
            if (err) {
                reject(err);
            } else {
                resolve(list.map(item => {
                    const stat = fs.statSync(path.join(__dirname, pathname, item));
                    return {
                        name: item,
                        isdir: stat.isDirectory(),
                        stat: stat,
                    };
                }));
            }
        });
    });
  });

  // Navigate to the main page of your app.
  await app.load('index.html');
})();
