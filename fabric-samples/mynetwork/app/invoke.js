/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
const userName = "TharinduSA";
const { FileSystemWallet, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");

const ccpPath = path.resolve(__dirname, ".", "connection.json");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

async function main() {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(wallet);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(
      "TharinduSA"
    );
    if (!userExists) {
      console.log(
        'An identity for the user "TharinduSA" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    } else {
      console.log("user");
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: "TharinduSA",
      discovery: { enabled: false }
    });

    // const a = await gateway.connect(ccp, connectionOptions);

    // // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");
    // console.log(network);

    // Get the contract from the network.
    const contract = network.getContract("fabcar");
    // console.log(contract);
    // ``;
    // Submit the specified transaction.
    // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
    // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
    await contract.submitTransaction(
      "createCar",
      "CAR12",
      "Honda",
      "Accord",
      "Black",
      "Tom"
    );
    console.log("Transaction has been submitted");

    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}

main();
