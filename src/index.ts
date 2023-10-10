#!/usr/bin/env node


const { Command } = require("commander");
const figlet = require("figlet");
const fs = require("fs");
const path = require("path");

const program = new Command();
console.log(figlet.textSync("Solidity Interfacer"));

program.version("0.0.1").description("A CLI Tool to get Solidity Interface from a contract").option("-p, --path  [value]", "File Path")

program.parse(process.argv);

const options = program.opts();


const extractSolidityInterface = (filePath: string): string | null => {
    try {
        const solidityCode: string = fs.readFileSync(filePath, 'utf-8');
        const lines: string[] = solidityCode.split('\n');
        let isInsideContract = false;
        let interfaceContent: string[] = [];
        let contractName = '';

        for (const line of lines) {
            if (!isInsideContract) {
                if (line.trim().startsWith('contract ')) {
                    isInsideContract = true;
                    const contractParts = line.trim().split(' ');
                    contractName = contractParts[1];
                    interfaceContent.push(`pragma solidity ^0.8.19;`);
                    interfaceContent.push(`interface I${contractName} {`);
                }
            } else {
                if (line.trim().startsWith('function ')) {
                    const funcParts = line.trim().split(' ');
                    if (funcParts.includes("{")) {
                        funcParts.splice(funcParts.indexOf("{"), 1);
                    }
                    const funcDeclaration = funcParts.join(' ');
                    interfaceContent.push(`    ${funcDeclaration}; `);
                }
            }
        }
        interfaceContent.push(`}`);

        if (!contractName) {
            throw new Error('No contract found in the Solidity file.');
        }

        return interfaceContent.join('\n');
    } catch (error) {
        console.error(`Error reading or extracting contract interface from the Solidity file: ${error}`);
        return null;
    }
}

if (options.path) {
    console.log("\n")
    const filepath = `${options.path}`;
    console.log("File Loaded: ", filepath);
    const iface = extractSolidityInterface(options.path);
    const fname = "I" + options.path.split("/").splice(-1)[0].split(".")[0] + ".sol";
    fs.writeFile(path.dirname(options.path) + `/${fname}`, iface, (err: any) => {
        if (err) {
            console.log(err)
        }
    });
    console.log("\n")
    console.log("Successfully Wrote Interface to:", path.dirname(options.path) + `/${fname}`)
    console.log("\n")
}
