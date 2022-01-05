import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
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

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [allAvailableTransactions, setAllAvailableTransactions] = useState([])
  const [transactioCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };


  const getAllTransactions = async()=>{
      try {
        if (!ethereum) return Swal.fire({
          icon: "info",
          title: "MetaMask Not Found.",
          text: "Please Install Meta ask!",
          footer: '<a href="">how to install metamask on chrom</a>',
        });
              const transactionContract = getEthereumContract();
      const availableTransactions = await transactionContract.getAllTransactions()
      const structuredTransactions = availableTransactions.map((transaction)=>({
        addressTo: transaction.receiver,
        addressFrom:transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message:transaction.message,
        keyword:transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }))
      setAllAvailableTransactions([...structuredTransactions])
      } catch (error) {
        console.log(error);
        throw new Error("No Ethereum Object");
      }
  }
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return Swal.fire({
        icon: "info",
        title: "MetaMask Not Found.",
        text: "Please Install Meta ask!",
        footer:
          '<a href="https://www.geeksforgeeks.org/how-to-install-and-use-metamask-on-google-chrome/" target="_blank" >how to install metamask on chrome?</a>',
      });;

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      console.log(accounts);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("no accounts found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.transactioCount;
      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);
      throw new ErrorEvent("No ethereum object.");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum)
        return Swal.fire({
          icon: "info",
          title: "MetaMask Not Found.",
          text: "Please Install Meta ask!",
          footer:
            '<a href="https://www.geeksforgeeks.org/how-to-install-and-use-metamask-on-google-chrome/" target="_blank" >how to install metamask on chrome?</a>',
        });
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new ErrorEvent("No ethereum object.");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum)
        return Swal.fire({
          icon: "info",
          title: "MetaMask Not Found.",
          text: "Please Install Meta ask!",
          footer:
            '<a href="https://www.geeksforgeeks.org/how-to-install-and-use-metamask-on-google-chrome/" target="_blank" >how to install metamask on chrome?</a>',
        });
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 2100 GWEI,
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`success - ${transactionHash.hash}`);
      const transactionCount = await transactionContract.transactioCount;
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        isLoading,
        currentAccount,
        formData,
        sendTransaction,
        handleChange,
  allAvailableTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
