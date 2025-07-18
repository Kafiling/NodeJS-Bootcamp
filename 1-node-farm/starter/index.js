const fs = require('fs'); // fs == file system
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate')
//----------------------------//
// File System

// // Blocking, synchronous way
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textInput);

// const textOutput = `This is what we know about avocado: ${textInput}.\nCreated on ${Date.now()}.`

// fs.writeFileSync('./txt/output.txt', textOutput);
// console.log('File written successfully!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3)

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written! 👀')
//             })
//         })
//     })
// })

// console.log('Will read file!')

//----------------------------//
// Server

// Syncournous code on top-level is ok
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)




const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)
    //Overview Page

    if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200, { 'content-type': 'text/html' })

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)
    }
    //Product Page
    else if (pathname === '/product') {
        const product = dataObj[query.id]
        res.writeHead(200, { 'content-type': 'text/html' })
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    }
    // API
    else if (pathname === '/api') {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(data)
    }
    // Not Found
    else {
        //writeHead(statusNumber,HeaderObject)
        //IMPORTANT header must be written before respond content
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('<h1>Page not found!</h1>')
    }
})

// server listening to port 8000, and at the IP address 127.0.0.1 (localhost)
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})

