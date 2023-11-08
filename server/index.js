const express = require('express')
const encryption = require('./encryption/encryption')
const tableCreate = require('./encryption/table')
const sharp = require('sharp')
const fs = require('fs');

const PORT = 5000

const app = express()

const start = async () => {
    await sharp("images/image.jpg").grayscale().jpeg().toFile("images/grayimage.jpg")
    
    let width, height
    const img = sharp('images/grayimage.jpg');
    img
    .metadata()
    .then(function(metadata) {
        width = metadata.width
        height = metadata.height
    })

    const arrayBuffer = await sharp('images/grayimage.jpg')
        .extractChannel(0)
        .raw()
        .toBuffer();
    
    const brightArray = [...arrayBuffer]

    fs.unlinkSync("data.txt")
    let masterKey = tableCreate()

    for (let i = 0; i < masterKey.size; i++) {
        await fs.appendFile('data.txt', `${i}: ${masterKey.get(i)}\n`, (error) => {
            if (error) {
                console.error(error);
            } 
        });
    }
    

    const input = Uint8Array.from(encryption(brightArray, masterKey)); // or Uint8ClampedArray
    const newImage = sharp(input, {
        raw: {
            width: width,
            height: height,
            channels: 1
        }
    });
    newImage.toFile('images/newGrayImage5.jpg')

    app.listen(PORT, () => {
        console.log('Сервер запущен');
    })
}

start()