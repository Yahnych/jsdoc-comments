const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const minimist = require('minimist');

// Get the arguments from commandline
const args = minimist(process.argv.slice(2), {
    string: ['filter', 'dir'],
    alias: {
        f: 'filter',
        d: 'dir'
    }
});

if (!args.dir) {
    // eslint-disable-next-line no-console
    console.log('Requires "--dir" or "-d" argument for output directory');
    process.exit(1);
}

if (!args._.length) {
    // eslint-disable-next-line no-console
    console.log('Requires additional argument for files to source');
    process.exit(1);
}

// Clean and create the output directory
const dir = path.resolve(args.dir);
fs.ensureDirSync(dir);

// Convert the filter to RegExp
let filter = args.filter;
if (filter) {
    if (typeof filter === 'string') {
        filter = filter.split(',');
    }
    filter = new RegExp('(' + filter.join('|') + ')');
}

// Loop through all the arguments for globs
args._.forEach((arg) => {

    // Get files for glob
    const files = glob.sync(arg);

    // Loop through the files
    files.forEach((file) => {

        // Load the file contents
        let buffer = fs.readFileSync(path.resolve(file), 'utf8');

        // Comment regex for JSDoc style blocks
        const comments = buffer.match(/[^\S\r\n]*\/(?:\*{2})([\W\w]+?)\*\//gm);

        if (comments) {
            // Support filters for excluding certain types
            // of comments from the list
            if (filter) {
                for (let i = comments.length - 1; i >= 0; i--) {
                    if (filter.test(comments[i])) {
                        comments.splice(i, 1);
                    }
                }
            }
            buffer = comments.join('\n\n');
        }
        else {
            buffer = '';
        }

        // Trim the buffer
        buffer = buffer.trim();

        // If there's any comments the save
        if (buffer) {
            const {ext} = path.parse(file);
            const output = path.resolve(dir, file.replace(ext, '.js'));
            fs.ensureDirSync(path.dirname(output));
            fs.writeFileSync(output, buffer);
        }
    });
});