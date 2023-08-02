const editJsonFile = require("edit-json-file")
const fs = require("fs");

const main = () => {
    let baseUri;
    process.argv.forEach(function (val, index, array) {
        if (index == 2) {
            baseUri = val
        }
    });
    const IMAGE_BASE_URI = "YOUR_IMAGE_BASE_URI"

    let totalFiles = 0;
    fs.readdir("./metadata", (err, files) => {
        if (err) {
            console.log(err);
        } else {
            totalFiles = files.length
            console.log('totalFiles: ', totalFiles);
            if (totalFiles === 0) return;
        
            for(let i = 1; i <= totalFiles; i++) {
                let file = editJsonFile(`./metadata/${i}.json`);
                file.set("image", `${IMAGE_BASE_URI}${i}.png`)
                file.save()
        
                fs.rename(`./metadata/${i}.json`, `./metadata/${i}`, (err) => {
                    console.log(err);
                })
            }
        }
    })
}

main()