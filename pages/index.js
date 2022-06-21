import { useState, useEffect } from "react";
import Web3 from "web3";
import { ADDRESS, ABI } from "../Contract";

export default function Home() {
  const [TokenBalance, setTokenBalance] = useState(null);
  const [Id, setId] = useState(null);
  const [Account, setAccount] = useState(null);
  const [UserBalance, setUserBalance] = useState(null);
  const [ChangeBalance, setChangeBalance] = useState(0);
  const HRPC = "https://ropsten.infura.io/v3/Your-Key";
  const WRPC = "wss://ropsten.infura.io/ws/v3/Your-Key";

  function fetchTokenBalance() {
    const provider = new Web3.providers.HttpProvider(HRPC);
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(ABI, ADDRESS);
    contract.methods
      .getBalance()
      .call()
      .then((bal) => {
        setTokenBalance(web3.utils.fromWei(bal, "ether"));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function connectMeta() {
    let provider = window.ethereum;
    if (typeof provider !== "undefined") {
      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(accounts[0]);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
      window.ethereum.on("accountsChanged", function (accounts) {
        setAccount(accounts[0]);
      });
    }
    const web3 = new Web3(provider);
    web3.eth.net.getId().then((id) => {
      setId(id);
    });
  }

  function fetchUserBalance() {
    if (Account !== null) {
      const web3 = new Web3(new Web3.providers.HttpProvider(HRPC));
      web3.eth
        .getBalance(Account)
        .then((bal) => {
          setUserBalance(web3.utils.fromWei(bal, "ether"));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleChangeBalance() {
    let provider = window.ethereum;
    if (
      ChangeBalance !== null &&
      ChangeBalance > 0 &&
      typeof provider !== "undefined"
    ) {
      const web3 = new Web3(provider);
      let contract = new web3.eth.Contract(ABI, ADDRESS);
      contract.methods
        .changeBalance(web3.utils.toWei(ChangeBalance, "ether"))
        .send({ from: Account })
        .then(() => {
          setChangeBalance(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    fetchTokenBalance();
    const web3 = new Web3(new Web3.providers.WebsocketProvider(WRPC));
    const contract = new web3.eth.Contract(ABI, ADDRESS);
    contract.events.Event({}).on("data", () => {
      fetchTokenBalance();
    });
  }, []);

  useEffect(() => {
    fetchUserBalance();
  }, [Account]);

  return (
    <section className="space-y-2">
      <h1 className="text-4xl text-center text-blue-500 font-semibold underline-offset-4 pb-10 underline">
        CodeOnChain Web3js Crash Course
      </h1>
      <p className="text-center text-2xl text-blue-500">
        Token Balance = {TokenBalance} Eth
      </p>
      {Account ? (
        <>
          <p className="text-center text-2xl text-blue-500">ChainId = {Id}</p>
          <p className="text-center text-2xl text-blue-500">
            Account = {Account}
          </p>
          <p className="text-center text-2xl text-blue-500">
            User Balance = {UserBalance} Eth
          </p>
          <div className="flex flex-col items-center gap-y-2">
            <input
              type="number"
              onChange={(e) => {
                setChangeBalance(e.target.value);
              }}
              value={ChangeBalance}
              className="bg-gray-200 px-3 py-1 outline-none rounded-none"
            />
            <button
              onClick={handleChangeBalance}
              className="bg-blue-600 rounded-2xl px-4 py-2 text-white"
            >
              Change Balance
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-row justify-center">
          <button
            onClick={connectMeta}
            className="bg-blue-500 rounded-2xl px-4 py-2 text-white"
          >
            Connect Metamask
          </button>
        </div>
      )}
    </section>
  );
}
