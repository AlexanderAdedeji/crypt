import React, { useEffect, useState } from "react";
import { ethers, Signer } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log({
    provider,
    signer,
    transactionContract,
  });
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  // const []
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please Install metamask");

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      console.log(accounts);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        // getAllTransactions();
      } else {
        console.log("no accounts found");
      }
    } catch (error) {
        console.log(error)
        throw new Error("No Ethereum Object")
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new ErrorEvent("No ethereum object.");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount }}>
      {children}
    </TransactionContext.Provider>
  );
};
