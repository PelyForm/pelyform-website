const notFound = (req, res, next) => {
    console.log("Not Found");
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Not Found</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }
                img {
                    width: 200px;
                    /* Removed fixed height */
                }
                h1 {
                    color: #333;
                    font-weight: 700;
                }
            </style>
        </head>
        <body>
            <img src="https://novateur-resource.s3.eu-north-1.amazonaws.com/logo.webp" alt="Logo">
            <img src="https://static.vecteezy.com/system/resources/previews/015/131/133/original/crossing-sign-error-404-png.png" alt="404">
        </body>
        </html>
    `)
}

module.exports = notFound;
