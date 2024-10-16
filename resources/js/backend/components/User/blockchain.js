const CryptoJS = require('crypto-js');

// Định nghĩa Block
class Block {
  constructor(index, timestamp, data, previousHash = '', signature = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.signature = signature;
    this.hash = ''; // Khóa hash ban đầu
  }

  // Tính hash cho block (bỏ qua chữ ký)
  calculateHash() {
    const dataToHash =
      this.index +
      this.timestamp +
      JSON.stringify(this.data) +
      this.previousHash;  // Không bao gồm chữ ký

    console.log(`Dữ liệu để hash (Block ${this.index}): ${dataToHash}`); // Log để kiểm tra

    return CryptoJS.SHA256(dataToHash).toString(); // Sử dụng CryptoJS để tính hash
  }

  // Khóa hash để tránh chỉnh sửa sau khi tính toán
  lockHash() {
    this.hash = this.calculateHash();
    console.log(`Hash đã khóa cho Block ${this.index}: ${this.hash}`); // Log hash để kiểm tra
  }

  // Ký block bằng private key sau khi hash đã được khóa
  signBlock(privateKey) {
    const hashToSign = this.hash; // Sử dụng hash đã khóa
    const signature = CryptoJS.HmacSHA256(hashToSign, privateKey).toString(); // Sử dụng HMAC để ký

    this.signature = signature;
    console.log(`Chữ ký cho Block ${this.index}: ${this.signature}`); // Log chữ ký để kiểm tra
  }

  // Xác minh chữ ký của block
  verifySignature(publicKey) {
    const hashToVerify = this.hash; // Sử dụng hash đã khóa
    const expectedSignature = CryptoJS.HmacSHA256(hashToVerify, publicKey).toString(); // Ký lại với publicKey

    return this.signature === expectedSignature; // So sánh chữ ký
  }
}

// Định nghĩa Blockchain
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  // Tạo block đầu tiên (Genesis Block)
  createGenesisBlock() {
    const genesisBlock = new Block(0, new Date().toISOString(), { message: 'Genesis Block' }, '0');
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
    this.saveToAPI()
  }

   // Lưu blockchain tới API
   async saveToAPI() {
    try {
      const response = await axios.post('/api/admin/blocks',  this.getLatestBlock());
      console.log(`Blockchain đã được lưu thành công: ${response.data}`);
    } catch (error) {
      console.log();
      
      console.error(`Lỗi khi lưu blockchain: ${error.message}`);
    }
  }

  // Xác thực toàn bộ chuỗi blockchain
  isChainValid(publicKey) {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      console.log(`Kiểm tra Block ${currentBlock.index}...`);
      console.log(`Hash hiện tại: ${currentBlock.hash}`);
      console.log(`Hash tính lại: ${currentBlock.calculateHash()}`);

      // Kiểm tra hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log(`Block ${currentBlock.index}: Hash không khớp.`);
        return false;
      }

      // Kiểm tra previousHash
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log(`Block ${currentBlock.index}: Previous hash không khớp.`);
        return false;
      }

      // Kiểm tra chữ ký
      if (!currentBlock.verifySignature(publicKey)) {
        console.log(`Block ${currentBlock.index}: Chữ ký không hợp lệ.`);
        return false;
      }
    }
    return true;
  }
}

module.exports = { Blockchain, Block };
