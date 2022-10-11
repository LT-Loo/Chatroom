/* Route to manage image file uploads */

const isFileValid = (file) => {
    const type = file.mimetype.split("/").pop(); // Extract extension of file
    const validTypes = ["jpg", "jpeg", "png"];
    if (validTypes.indexOf(type) === -1) {return false;}
    else {return true;}
}

const addFile = (filename) => {}

module.exports = function(db, app, formidable, fs, path, ObjectID) {
    app.post('/upload', (req, res) => {
        // console.log("run upload");
        var form = new formidable.IncomingForm(); // Receive file request
        const uploadFolder = path.join(__dirname, "../images"); // Directory to store image files
        form.options.uploadDir = uploadFolder; // Set upload directory
        form.options.multiples = true; // Allow multiple files upload
        form.options.keepExtensions = true;
        // console.log(uploadFolder);
        // console.log(req.body);
        
        // console.log(req.body);

        // File parsing
        form.parse(req, async function(err, fields, files) {
            // console.log("parse file");
            if (err) {
                console.log("Error parsing files");
                return res.status(400).json({
                    status: "Fail",
                    message: "There was an error parsing the files.",
                    error: err
                });
            }

            console.log(files);

            if (files) { // Single File
                // console.log("single file upload");
                const file = files; // Retrieve file
                // console.log(myFile);
                const isValid = isFileValid(file); // File validation

                // Generate valid file name (Replace spaces with dashes)
                // const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

                if (!isValid) {
                    return res.status(400).json({
                        statud: "Fail",
                        message: "Invalid file type"
                    });
                }

                // Rename file in directory
                // console.log("rename file");
                let oldpath = file.image.filepath;
                let newpath = form.options.uploadDir + "/" + file.image.newFilename;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) {
                        console.log("Error parsing file.");
                        return res.status(400).json({
                            status: "Fail",
                            message: "Encountered error when parsing file",
                            error: err
                        });
                    }

                    res.send({success: true, filename: file.image.newFilename});
                });

                // console.log(file);

                // Store file in database
                // let result = db.collection("user").updateOne({_id: new ObjectID(userID)}, {$set: {pfp: file.image.newFilename}});
                // if (result.acknowledged) {
                //     console.log(`Succesfully updated pfp of user ${userID}.`);
                // }
                
            } 
        });
    });

    app.post('/uploadImgChat', (req, res) => {
        // console.log("run upload");
        var form = new formidable.IncomingForm(); // Receive file request
        const uploadFolder = path.join(__dirname, "../images"); // Directory to store image files
        form.options.uploadDir = uploadFolder; // Set upload directory
        form.options.multiples = true; // Allow multiple files upload
        form.options.keepExtensions = true;
        // console.log(uploadFolder);
        // console.log(req.body);
        
        // console.log(req.body);

        // File parsing
        form.parse(req, async function(err, fields, files) {
            // console.log("parse file");
            if (err) {
                console.log("Error parsing files");
                return res.status(400).json({
                    status: "Fail",
                    message: "There was an error parsing the files.",
                    error: err
                });
            }

            // console.log(files);
            // console.log(files.images.length);

            if (!files.images.length) { // Single File
                // console.log("single file upload");
                const file = files.images; // Retrieve file
                // console.log(myFile);
                const isValid = isFileValid(file); // File validation

                // Generate valid file name (Replace spaces with dashes)
                // const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

                if (!isValid) {
                    return res.status(400).json({
                        statud: "Fail",
                        message: "Invalid file type"
                    });
                }

                console.log("SINGLE FILE");
                console.log(file);

                // Rename file in directory
                // console.log("rename file");
                // let oldpath = file.image.filepath;
                // let newpath = form.options.uploadDir + "/" + file.image.newFilename;
                // fs.rename(oldpath, newpath, function (err) {
                //     if (err) {
                //         console.log("Error parsing file.");
                //         return res.status(400).json({
                //             status: "Fail",
                //             message: "Encountered error when parsing file",
                //             error: err
                //         });
                //     }

                //     res.send({success: true, filename: file.newFilename});
                // });

            } else {

                console.log("MULTIPLE FILESS");

                // const file = files;
                let i = 0;
                let filenames = [];
                for (let file of files.images) {
                    const isValid = isFileValid(file); // File validation

                    // Generate valid file name (Replace spaces with dashes)
                    // const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

                    // console.log(file);

                    if (!isValid) {
                        return res.status(400).json({
                            statud: "Fail",
                            message: "Invalid file type"
                        });
                    }

                    // console.log("SINGLE FILE");

                    // Rename file in directory
                    // console.log("rename file");
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
                    filenames.push(file.newFilename);
                }
                res.send({success: true, filenames: filenames});
            }
        });
    });
}