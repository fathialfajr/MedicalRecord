const hre = require("hardhat");

async function main() {
    const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const Greeter = await hre.ethers.getContractFactory("Greeter");
    const greeter = await Greeter.attach(greeterAddress);

    console.log("Current greeting: ", await greeter.greeting());

    await greeter.setGreeting("HEllo, Hardhat!");
    console.log("New greeting: ", await greeter.greeting());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
