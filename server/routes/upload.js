/* Route to manage image file uploads */

// File validation - Only image file accepted
const isFileValid = (file) => {
    const type = file.mimetype.split("/").pop(); // Extract extension of file
    const validTypes = ["jpg", "jpeg", "png"];
    if (validTypes.indexOf(type) === -1) {return false;}
    else {return true;}
}


module.exports = function(db, app, formidable, fs, path, ObjectID) {

    // Save image in server
    const saveFile = (file, form) => {
        const isValid = isFileValid(file); // File validation

        if (!isValid) {
            return res.status(400).json({
                status: "Fail",
                message: "Invalid file type"
            });
        }

        // Rename path directory
        let oldpath = file.filepath;
        let newpath = form.options.uploadDir + "/" + file.newFilename;
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                console.log("Error parsing file.");
                return res.status(400).json({
                    status: "Fail",
                    message: "Encountered error when parsing file",
                    error: err
                });
            }  
        });
        console.log(file.newFilename);
        return file.newFilename;
    }

    app.post('/uploadImages', (req, res) => {

        var form = new formidable.IncomingForm(); // Receive file request
        const uploadFolder = path.join(__dirname, "../images"); // Directory to store image files
        form.options.uploadDir = uploadFolder; // Set upload directory
        form.options.multiples = true; // Allow multiple files upload
        form.options.keepExtensions = true;

        let filenames = [];

        // File parsing
        form.parse(req, async function(err, fields, files) {

            if (err) {
                console.log("Error parsing files");
                return res.status(400).json({
                    status: "Fail",
                    message: "There was an error parsing the files.",
                    error: err
                });
            }

            if (!files.images.length) { // Single File
                filenames.push(saveFile(files.images, form));
            } else { // Multiple files

                for (let file of files.images) {
                    filenames.push(saveFile(file, form));
                } 
            }

            res.send({success: true, filenames: filenames});
        });
    });
}