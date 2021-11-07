from flask import Flask, jsonify
from flask_cors import cross_origin
from web3 import Web3
import json
from pymongo import MongoClient
import pymongo
import time
import threading

app = Flask(__name__)


@app.route('/')
@cross_origin()
def hello_world():
    ret = {
        'description': "This is flask server for blockchain explorer"
    }
    return jsonify(ret)


@app.route('/get-ongoing-auctions')
@cross_origin()
def get_ongoing_auctions():
    auctions = []
    for document in ongoing_auction_col.find({}):
        if time.time() > document["end_time"]:
            try:
                past_auction_col.insert_one(document)
                ongoing_auction_col.delete_one({"_id": document["_id"]})
            except pymongo.errors.DuplicateKeyError:
                continue
            except Exception as e:
                print(e)
        else:
            auctions.append(document)
    ret = {
        'ongoingAuctions': auctions
    }
    return jsonify(ret)


@app.route('/get-past-auctions')
@cross_origin()
def get_past_auctions():
    auctions = []
    for document in past_auction_col.find({}):
        auctions.append(document)
    ret = {
        'pastAuctions': auctions
    }
    return jsonify(ret)


def blockchain_scanner(w3):
    global total_blocks
    while True:
        time.sleep(1)
        total_blocks = w3.eth.block_number


def add_auctions_in_database(auctions):
    for auction in auctions:
        if time.time() < auction["end_time"]:
            try:
                ongoing_auction_col.insert_one(auction)
            except pymongo.errors.DuplicateKeyError:
                continue
        else:
            try:
                past_auction_col.insert_one(auction)
            except pymongo.errors.DuplicateKeyError:
                continue


def extract_auctions_from_transactions(w3, transactions_id):
    auctions = []
    for transaction_id in transactions_id:
        # transaction = w3.eth.get_transaction(transaction_id)
        transaction_receipt = w3.eth.getTransactionReceipt(transaction_id)
        if transaction_receipt["contractAddress"] is None:
            continue
        contract_address = transaction_receipt["contractAddress"]
        code = w3.eth.getCode(contract_address).hex()
        for contract in contracts:
            if code != contract["deployedBytecode"]:
                continue
            contract_instance = w3.eth.contract(address=contract_address, abi=contract["abi"])
            end_time = float(contract_instance.functions.auctionEndTime().call())
            auctions.append({
                "_id": contract_address,
                "contract_address": contract_address,
                "end_time": end_time,
                "contract_name": contract["contractName"]
            })
    return auctions


def block_scanner(w3):
    current_block = 0
    while True:
        if current_block == total_blocks:
            print("Total blocks : ", total_blocks)
            time.sleep(3)
            continue
        current_block += 1
        block = web3.eth.get_block(current_block)
        transactions = block["transactions"]
        auctions = extract_auctions_from_transactions(w3, transactions)
        add_auctions_in_database(auctions)


total_blocks = 0
web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
if not web3.isConnected():
    print("Blockchain Not Connected !!!")
    exit()
mongo_client = MongoClient(port=27000)
db = mongo_client["auctionsdb"]
ongoing_auction_col = db["ongoing_auc"]
past_auction_col = db["past_auc"]
contracts = [json.load(open("../backend/build/contracts/forwardAuction.json")),
             json.load(open("../backend/build/contracts/backwardAuction.json"))]
threading.Thread(target=blockchain_scanner, args=(web3,), daemon=True).start()
threading.Thread(target=block_scanner, args=(web3,), daemon=True).start()
app.run()
