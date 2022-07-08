import fs from 'fs';

async function run() {
    const args = process.argv.slice(2);

    switch (args[0]) {
        case 'rf':
            if (!args[1])
                throw new Error('Missing folder name');

            fs.rmSync(args[1], { recursive: true, force: true });
    }
}

await run();
