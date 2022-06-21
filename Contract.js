module.exports = {
  ADDRESS: "0x1c1D97D468FA50f444f3d8AA9c5D37128C0367b5",
  ABI: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "balance_",
          type: "uint256",
        },
      ],
      name: "changeBalance",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
      ],
      name: "Event",
      type: "event",
    },
    {
      inputs: [],
      name: "getBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};
