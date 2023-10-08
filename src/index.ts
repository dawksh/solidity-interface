const { Command } = require("commander");
const figlet = require("figlet");
const fs = require("fs");
const path = require("path");

const program = new Command();
console.log(figlet.textSync("Solidity Interfacer"));

program.version("0.0.1").description("A CLI Tool to get Solidity Interface from a contract").option("-p, --path  [value]", "File Path")

program.parse(process.argv);

const options = program.opts();


const extractSolidityInterface = (filePath: string) => {
    const solidityCode: string = fs.readFileSync(filePath, 'utf-8');
    const interfacePattern: RegExp = /interface\s+(\w+)\s*\{([\s\S]*?)\}/g;

    const matches: RegExpMatchArray[] = [...solidityCode.matchAll(interfacePattern)];

    const interfaces: string[] = matches.map((match) => {
        const [, interfaceName, interfaceContent] = match;
        return `interface ${interfaceName} ${interfaceContent}`;
    });

    return interfaces.join('\n\n')
}

if (options.path) {
    console.log("\n")
    const filepath = `${__dirname}/${options.path}`;
    console.log("File Loaded: ", filepath);
    const iface = extractSolidityInterface(filepath);
    console.log(iface);

}
