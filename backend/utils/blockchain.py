# utils/blockchain.py

import hashlib
import json
from datetime import datetime

class SimplePrivateBlockchain:
    def __init__(self):
        self.chain = []
        self.create_block(data="Genesis Block")

    def create_block(self, data):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': str(datetime.now()),
            'data': data,
            'previous_hash': self.get_previous_hash(),
            'hash': ''
        }
        block['hash'] = self.hash_block(block)
        self.chain.append(block)
        return block

    def get_previous_hash(self):
        return self.chain[-1]['hash'] if self.chain else '0'

    def hash_block(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def get_chain(self):
        return self.chain
