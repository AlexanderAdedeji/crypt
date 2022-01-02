require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/pdC0IZJTTPj3rKGDS1rF1rjg7oPUMHz1",
      accounts: [
        "9777fbe0845531aaf883e1fbc02410606dbf2f44d35f4724f6f12d4d0bd40bc6",
      ],
    },
  },
};
