const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const { Blockchain, Block } = require('./blockchain'); // Adjust the path to your blockchain implementation

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Initialize Blockchain
const blockchain = new Blockchain();

async function getIndex(){
    try {
        // Replace with your Laravel API endpoint
        const url = 'http://localhost:8000/api/admin/blocks/get-index';     
        // Optional: If you need to send any data (e.g., for POST requests)
        // Example of a GET request
        const response = await axios.get(url);
       
        return  response.data
        
      } catch (error) {
        
        console.error('Error calling Laravel API:', error.response ? error.response.data : error.message);
      }
}

// API endpoint to add a new block
app.post('/add-block', async (req, res) => {
    const privateKey = fs.readFileSync('private_key.pem', 'utf8');
    const publicKey = fs.readFileSync('public_key.pem', 'utf8');   
    const index = await getIndex()
    const newBlock = new Block(index, new Date().toISOString(), { amount: 10 });
    blockchain.addBlock(newBlock, privateKey);
    // res.status(201).json({ message: 'Block added successfully', block: newBlock ,privateKey:privateKey});
    try {
        // Replace with your Laravel API endpoint
        const url = 'http://localhost:8000/api/admin/blocks';     
        // Optional: If you need to send any data (e.g., for POST requests)
        const requestData = newBlock;    
        // Example of a GET request
        const response = await axios.post(url, requestData);
        console.log('GET Response:', response.data);    
        res.status(201).json(newBlock);
        
      } catch (error) {
        res.status(201).json('Error calling Laravel API:', error.response ? error.response.data : error.message);
        // console.error('Error calling Laravel API:', error.response ? error.response.data : error.message);
      }
  //api
});

// API endpoint to get all blocks
app.post('/blocks/isChainValid', async(req, res) => {
    try {
        // Replace with your Laravel API endpoint
        const url = 'http://localhost:8000/api/admin/blocks/get-all';     
        // Optional: If you need to send any data (e.g., for POST requests)        
        // Example of a GET request
        const response = await axios.get(url);
        // console.log('GET Response:', response.data);    
        const publicKey = fs.readFileSync('public_key.pem', 'utf8');   
        const isValid = blockchain.isChainValid(publicKey,response.data);
        res.status(201).json(isValid);
        
      } catch (error) {
        res.status(201).json('Error calling Laravel API:', error.response ? error.response.data : error.message);
        // console.error('Error calling Laravel API:', error.response ? error.response.data : error.message);
      }
    
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
