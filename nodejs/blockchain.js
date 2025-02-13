const crypto = require('crypto');
const fs = require('fs');
const {isString} = require('lodash');
const path = require('path');
const axios = require("axios");
const usb = require('usb');
const axiosRetry = require('axios-retry').default;

axiosRetry(axios, {
    retries: 3, // Số lần thử lại tối đa
    retryDelay: (retryCount) => {
        console.log(`Thử lại lần ${retryCount}...`);
        return retryCount * 1000; // Chờ 1s, 2s, 3s...
    },
    retryCondition: (error) => {
        // Chỉ retry nếu lỗi không phải 4xx
        return error.response && error.response.status >= 500;
    }
});

// Định nghĩa Block
class Block {
    constructor(index, timestamp, data, previousHash = '', signature = '', hash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.signature = signature;
        this.hash = hash; // Khóa hash ban đầu
    }

    // Tính hash cho block
    // Tính hash cho block (bỏ qua chữ ký)
    calculateHash() {
        const dataToHash =
            this.index +
            this.timestamp +
            JSON.stringify(this.data) +
            this.previousHash;  // Không bao gồm chữ ký

        console.log(`Dữ liệu để hash (Block ${this.index}): ${dataToHash}`); // Log để kiểm tra

        return crypto.createHash('sha256').update(dataToHash).digest('hex');
    }


    // Khóa hash để tránh chỉnh sửa sau khi tính toán
    lockHash() {
        this.hash = this.calculateHash();
        console.log(`Hash đã khóa cho Block ${this.index}: ${this.hash}`); // Log hash để kiểm tra
    }

    // Ký block bằng private key sau khi hash đã được khóa
    signBlock(privateKey) {
        const sign = crypto.createSign('SHA256');
        sign.update(this.hash).end();
        this.signature = sign.sign(privateKey, 'hex');
        console.log(`Chữ ký cho Block ${this.index}: ${this.signature}`); // Log chữ ký để kiểm tra
    }

    // Xác minh chữ ký của block
    verifySignature(publicKey) {
        const verify = crypto.createVerify('SHA256');
        verify.update(this.hash).end();
        return verify.verify(publicKey, this.signature, 'hex');
    }
}

// Định nghĩa Blockchain
class Blockchain {
    constructor() {
        this.getLastBlock().then(async (data) => {
            if (data) {
                this.chain = [this.genBlock(data)]
            } else {
                this.chain = [this.createGenesisBlock()]
            }
        })
    }

    genBlock(currentBlock) { 
        if (currentBlock && currentBlock.data) {
            try {
                const parsedData = currentBlock.data;
                return new Block(
                    currentBlock.index, 
                    currentBlock.timestamp, 
                    parsedData, 
                    currentBlock.previousHash, 
                    currentBlock.signature, 
                    currentBlock.hash
                );
            } catch (error) {
                console.error("Lỗi JSON.parse:", error.message);
                return null; // Hoặc xử lý lỗi phù hợp
            }
        } else {
            console.error("currentBlock hoặc currentBlock.data bị undefined!");
            return null;
        }
    }
    

    // async getLastBlock() {
    //     try {
    //         const url = 'http://localhost:8000/api/admin/blocks/get-last';
    //         // Optional: If you need to send any data (e.g., for POST requests)
    //         // Example of a GET request
    //         const response = await axios.get(url);
    //         return response.data;
    //     } catch (error) {
    //         return error.response ? error.response.data : error.message;
    //         // console.error('Error calling Laravel API:', error.response ? error.response.data : error.message);
    //     }
    // }

    async getLastBlock() {
        try {
            const blocksDir = path.join(__dirname, 'blocks'); // Thư mục chứa block
            const files = fs.readdirSync(blocksDir); // Lấy danh sách file
    
            if (files.length === 0) {
                throw new Error("Thư mục blocks trống!");
            }
    
            // Lọc file có dạng "block_xxx.json" và trích xuất số thứ tự
            const blockFiles = files
                .filter(file => file.match(/^block_\d+\.json$/)) // Lọc file đúng format
                .map(file => ({
                    name: file,
                    number: parseInt(file.match(/\d+/)[0]) // Lấy số từ tên file
                }))
                .sort((a, b) => b.number - a.number); // Sắp xếp giảm dần theo số
    
            if (blockFiles.length === 0) {
                throw new Error("Không tìm thấy file block nào!");
            }
    
            const lastFile = blockFiles[0].name; // File có số lớn nhất
            const filePath = path.join(blocksDir, lastFile);
            const data = fs.readFileSync(filePath, 'utf8'); // Đọc file
    
            return JSON.parse(data); // Trả về JSON
        } catch (error) {
            console.error("Lỗi đọc file:", error.message);
            return null;
        }
    }

    // Tạo block đầu tiên (Genesis Block)
    createGenesisBlock() {
        const genesisBlock = new Block(0, new Date().toISOString(), {message: 'Genesis Block'}, '0');
        genesisBlock.lockHash();
        return genesisBlock;
    }

    // Lấy block cuối cùng
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Thêm block mới
    addBlock(newBlock, privateKey) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.lockHash();
        newBlock.signBlock(privateKey);

        this.chain.push(newBlock);
        this.saveBlockToFile(newBlock);
    }

    // Lưu block vào file JSON
    saveBlockToFile(block) {
        const filePath = path.join(__dirname, 'blocks', `block_${block.index}.json`);
        fs.writeFileSync(filePath, JSON.stringify(block, null, 2));
        console.log(`Block ${block.index} đã được lưu tại ${filePath}`);
    }

    // Xác thực toàn bộ chuỗi blockchain
    isChainValid(publicKey, data, providedSignature) {
        var valid = false
        var validSign = false
        for (let i = 1; i < data.length; i++) {
            var currentBlock = data[i];
            currentBlock['data'] = JSON.parse(currentBlock['data'])
            currentBlock = new Block(currentBlock.index, currentBlock.timestamp, currentBlock.data, currentBlock.previousHash, currentBlock.signature, currentBlock.hash);

            var previousBlock = data[i - 1];
            if (previousBlock['data'] && isString(previousBlock['data'])) {
                previousBlock['data'] = JSON.parse(previousBlock['data'])
            }

            previousBlock = new Block(previousBlock.index, previousBlock.timestamp, previousBlock.data, previousBlock.previousHash, previousBlock.signature, previousBlock.hash);

            console.log(`Kiểm tra Block ${currentBlock.index}...`);
            console.log(`Hash hiện tại: ${currentBlock.hash}`);
            console.log(`Hash tính lại: ${currentBlock.calculateHash()}`);


            // Kiểm tra hash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`Block ${currentBlock.index}: Hash không khớp.`);
                valid = false;
            } else {
                valid = true
            }

            // Kiểm tra previousHash
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Block ${currentBlock.index}: Previous hash không khớp.`);
                valid = false;
            } else {
                valid = true
            }
            const isSignatureValid = currentBlock.verifySignature(publicKey);
            if (!isSignatureValid) {
                console.log(`Block ${currentBlock.index}: Chữ ký không hợp lệ.`);
                valid = false;
            } else {
                valid = true
            }

            if (currentBlock.signature === providedSignature) {
                console.log(`Block ${currentBlock.index}: Chữ ký khớp với chữ ký đã cung cấp.`);
                validSign = true
            }
        }
        return valid && validSign;
    }
}


function generateKeys(saveFile = true, id='id_user') {
    const {publicKey, privateKey} = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: {type: 'spki', format: 'pem'},
        privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
    });
    if (saveFile) {
        // Lưu khóa vào file        
        fs.writeFileSync('pem/private_key_'+id+'.pem', privateKey);
        fs.writeFileSync('pem/public_key_'+id+'.pem', publicKey);
        console.log('Cặp khóa đã được tạo và lưu.');        
    }
    return {mess:'Create key success', success: true,publicKey, privateKey}

}

module.exports = {Blockchain, Block, generateKeys};
