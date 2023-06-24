import os from 'os';
import path from 'path';
import fs from 'fs';
import { Readable, pipeline} from 'stream';
import crypto from 'crypto';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';


class FileManager extends Readable {
    constructor() {
        super();
        this.username = process.argv[process.argv.length - 1].split('=')[1];
        this.currentDirectory = `${os.homedir().split(':')[0]}:/Users/${this.username}`;
    }

    _read() {
        process.stdin.on('data', (data) => {
            const command = data.toString().trim();
            this.processCommand(command);
        });
    }

    processCommand(command) {
        const [operation, ...args] = command.trim().split(' ');

        try {
            switch (operation) {
                case 'decompress':
                    if (args.length === 2) {
                        const sourceFilePath = args[0];
                        const destinationFilePath = args[1];

                        const brotli = createBrotliDecompress();
                        const sourceFileStream = fs.createReadStream(sourceFilePath);
                        const destinationFileStream = fs.createWriteStream(destinationFilePath);

                        sourceFileStream
                            .on('error', (err) => {
                                console.log('Operation failed');
                                console.log(`You are currently in ${this.currentDirectory}`);
                            })
                            .pipe(brotli)
                            .on('error', (err) => {
                                console.log('Operation failed');
                                console.log(`You are currently in ${this.currentDirectory}`);
                            })
                            .pipe(destinationFileStream)
                            .on('error', (err) => {
                                console.log('Operation failed');
                                console.log(`You are currently in ${this.currentDirectory}`);
                            })
                            .on('finish', () => {
                                console.log(`You are currently in ${this.currentDirectory}`);
                            });
                    } else {
                        console.log('Invalid input');
                        console.log(`You are currently in ${this.currentDirectory}`);
                    }
                    break;

                case 'compress':
                    if (args.length === 2) {
                        const sourceFilePath = args[0];
                        const destinationFilePath = args[1];

                        const brotli = createBrotliCompress();
                        const sourceFileStream = fs.createReadStream(sourceFilePath);
                        const destinationFileStream = fs.createWriteStream(destinationFilePath);

                        sourceFileStream
                            .on('error', (err) => {
                                console.log('Operation failed');
                                console.log(`You are currently in ${this.currentDirectory}`);
                            })
                            .pipe(brotli)
                            .on('error', (err) => {
                                console.log('Operation failed');
                                console.log(`You are currently in ${this.currentDirectory}`);
                            })
                            .pipe(destinationFileStream)
                            .on('error', (err) => {
                                console.log('Operation failed');
                                console.log(`You are currently in ${this.currentDirectory}`);
                            })
                            .on('finish', () => {
                                console.log(`You are currently in ${this.currentDirectory}`);
                            });
                    } else {
                        console.log('Invalid input');
                        console.log(`You are currently in ${this.currentDirectory}`);
                    }
                    break;

                case 'hash':
                    if (args.length === 1) {
                        const filePath = path.resolve(this.currentDirectory, args[0]);
                        fs.accessSync(filePath);
                        const fileData = fs.readFileSync(filePath);
                        const hash = crypto.createHash('sha256').update(fileData).digest('hex');
                        console.log(hash);
                    } else {
                        console.log('Invalid input');
                    }
                    console.log(`You are currently in ${this.currentDirectory}`);
                    break;
                case 'os':
                    if (args.length === 1) {
                        switch (args[0]) {
                            case '--EOL':
                                console.log(os.EOL);
                                break;
                            case '--cpus':
                                const cpus = os.cpus();

                                console.log(`Host machine CPUs info:`);
                                console.log(`Overall amount of CPUs: ${cpus.length}`);
                                cpus.forEach((cpu, index) => {
                                    console.log(`CPU ${index}:`);
                                    console.log(`Model: ${cpu.model}`);
                                    console.log(`Clock rate: ${cpu.speed / 1000} GHz`);
                                });
                                break;
                            case '--homedir':
                                console.log(os.homedir());
                                break;
                            case '--username':
                                console.log(os.userInfo().username);
                                break;
                            case '--architecture':
                                console.log(process.arch);
                                break;
                        }
                    } else {
                        console.log('Invalid input');
                    }
                    console.log(`You are currently in ${this.currentDirectory}`);
                    break;
                case 'rm':
                    if (args.length === 1) {
                        if (path.isAbsolute(args[0])) {
                            fs.unlinkSync(args[0]);
                        } else {
                            const absolutePath = path.resolve(this.currentDirectory, args[0]);
                            fs.unlinkSync(absolutePath);
                        }
                    } else {
                        console.log('Invalid input');
                    }
                    console.log(`You are currently in ${this.currentDirectory}`);
                    break;
                case 'mv':
                    if (args.length === 2) {
                        const sourceFile = args[0];
                        const destinationPath = args[1];
    
                        const sourcePath = path.resolve(this.currentDirectory, sourceFile);
                        const destinationFilePath = path.resolve(this.currentDirectory, destinationPath, path.basename(sourceFile));
    
                        const readStream = fs.createReadStream(sourcePath);
                        const writeStream = fs.createWriteStream(destinationFilePath);
    
                        pipeline(readStream, writeStream, (err) => {
                            if (err) {
                                console.log('Operation failed');
                            } else {
                                fs.unlinkSync(sourcePath);
                            }
                            console.log(`You are currently in ${this.currentDirectory}`);

                        });
                    } else {
                        console.log('Invalid input');
                        console.log(`You are currently in ${this.currentDirectory}`);
                    }
                    break;
                case 'cp':
                    if (args.length === 2) {
                        const sourceFile = args[0];
                        const destinationPath = args[1];

                        const sourcePath = path.resolve(this.currentDirectory, sourceFile);
                        const destinationFilePath = path.resolve(this.currentDirectory, destinationPath, path.basename(sourceFile));

                        const readStream = fs.createReadStream(sourcePath);
                        const writeStream = fs.createWriteStream(destinationFilePath);

                        pipeline(readStream, writeStream, (err) => {
                            if (err) {
                                console.log('Operation failed');
                            }
                            console.log(`You are currently in ${this.currentDirectory}`);
                        });
                    } else {
                        console.log('Invalid input');
                        console.log(`You are currently in ${this.currentDirectory}`);

                    }
                    break;
                case 'rn':
                    if (args.length === 2) {
                        const filePath = args[0];
                        const newFileName = args[1];

                        if (path.isAbsolute(filePath)) {
                            const newPath = path.join(path.dirname(filePath), newFileName);
                            fs.renameSync(filePath, newPath);
                        } else {
                            const absolutePath = path.resolve(this.currentDirectory, filePath);
                            const newPath = path.join(path.dirname(absolutePath), newFileName);
                            fs.renameSync(absolutePath, newPath);
                        }
                    } else {
                        console.log('Invalid input');
                    }
                    console.log(`You are currently in ${this.currentDirectory}`);
                    break;
                case 'add':
                    if (args.length === 1) {
                        const fileName = args[0];
                        const filePath = path.resolve(this.currentDirectory, fileName);

                        fs.writeFileSync(filePath, '');
                    } else {
                        console.log('Invalid input');
                    }
                    console.log(`You are currently in ${this.currentDirectory}`);
                    break;
                case 'cat':
                    if (args.length === 1) {
                        const filePath = path.resolve(this.currentDirectory, args[0]);
                        fs.access(filePath, fs.constants.R_OK, (err) => {
                            if (err) {
                                console.log('Operation failed');
                                console.log(`You are currently in ${this.currentDirectory}`);
                            } else {
                                const fileStream = fs.createReadStream(filePath, 'utf8');
                                fileStream.on('data', (data) => {
                                    console.log(data);
                                });
                                fileStream.on('end', () => {
                                    console.log(`You are currently in ${this.currentDirectory}`);
                                });
                                fileStream.on('error', (err) => {
                                    console.log('Operation failed');
                                    console.log(`You are currently in ${this.currentDirectory}`);
                                });
                            }
                        });
                    } else {
                        console.log('Invalid input');
                        console.log(`You are currently in ${this.currentDirectory}`);
                    }
                    break;

                case 'ls':
                    if (args.length === 0) {
                        const files = fs.readdirSync(this.currentDirectory);

                        console.log('index\tName\tType');

                        files.forEach((file, index) => {
                            const filePath = path.join(this.currentDirectory, file);
                            let fileStats;

                            try {
                                fileStats = fs.statSync(filePath);
                            } catch (error) {
                                return;
                            }

                            const fileType = fileStats.isDirectory() ? 'directory' : 'file';
                            console.log(`${index}\t${file}\t${fileType}`);
                        });
                    } else {
                        console.log('Invalid input');
                    }
                    console.log(`You are currently in ${this.currentDirectory}`);
                    break;

                case 'cd':
                    if (args.length === 1) {
                        if (path.isAbsolute(args[0])) {
                            fs.accessSync(args[0]);
                            this.currentDirectory = args[0];
                        } else {
                            const absolutePath = path.resolve(this.currentDirectory, args[0]);
                            fs.accessSync(absolutePath);
                            this.currentDirectory = absolutePath;
                        }
                    } else {
                        console.log('Invalid input');
                    }
                    console.log(`You are currently in ${this.currentDirectory}`);
                    break;
                case 'up':
                    if (args.length === 0) {
                        const parsedPath = path.parse(this.currentDirectory);
                        if (parsedPath.root !== parsedPath.dir + path.sep) {
                            this.currentDirectory = path.dirname(this.currentDirectory);
                        }
                    } else {
                        console.log('Invalid input');
                    }
                    console.log(`You are currently in ${this.currentDirectory}`);
                    break;
                case '.exit':
                    if (args.length === 0) {
                        console.log(`Thank you for using File Manager, ${this.username}, goodbye!`);
                        process.exit(0);
                    } else {
                        console.log('Invalid input');
                        console.log(`You are currently in ${this.currentDirectory}`);
                    }
                    break;
                default:
                    console.log('Invalid input');
                    console.log(`You are currently in ${this.currentDirectory}`);
                    break;
            }
        } catch (err) {
            console.log('Operation failed');
            console.log(`You are currently in ${this.currentDirectory}`);
        }
    }
}

const fileManager = new FileManager();

console.log(`Welcome to the File Manager, ${fileManager.username}!`);

console.log(`You are currently in ${fileManager.currentDirectory}`);

fileManager._read();

process.on('SIGINT', () => {
    console.log(`Thank you for using File Manager, ${fileManager.username}, goodbye!`);
    process.exit(0);
});
