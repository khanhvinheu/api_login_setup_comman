<template>
    <div>
        
    </div>
  </template>
  
  <script>
import { ec as EC } from 'elliptic';
const ec = new EC('secp256k1');
  export default {
    data() {
      return {
          
      };
    },
    async mounted(params) { 
        const keyPair = ec.genKeyPair();
        const publicKey = keyPair.getPublic('hex');
        const privateKey = keyPair.getPrivate('hex');
        console.log(publicKey, privateKey);
        
       
    },
    methods: {
        
    },
  };
  </script>
  
  