const Network = require("./Network");
const aws = require("aws-sdk");

const fs = require("fs");
const path = require("path");
const { appConfig } = require("../config/constant");
const { isObject } = require("./isAnything");



aws.config.update({
    accessKeyId: appConfig.api.aws.accessKey ,
    secretAccessKey: appConfig.api.aws.secretKey,
    region: appConfig.api.aws.region,
});

class Image extends Network {
    async downloadBinary(url) {
        try {
            const response = await this.axiosInstance({
                method: 'get',
                url,
                responseType: 'arraybuffer'
            });
            return { err: null, data: response.data, headers: response.headers };
        } catch (error) {
            return this.formatError(error);
        }
    }
}

class S3 {
    constructor() {
        this.s3 = new aws.S3();
    }

    handleError(err) {
        // Check if err is an object and has a code property
        console.log(err);
        if (isObject(err) && 'code' in err) {
            console.log(err);
            switch (err.code) {
                case 'NoSuchBucket':
                    return 'The specified bucket does not exist.';
                case 'InvalidBucketName':
                    return 'The specified bucket name is not valid.';
                case 'BucketAlreadyExists':
                    return 'The requested bucket name is not available.';
                case 'NoSuchKey':
                    return 'The specified key does not exist.';
                default:
                    return 'An error occurred with AWS S3.';
            }
        } else if (err instanceof TypeError) {
            return 'A type error occurred.';
        } else if (err instanceof RangeError) {
            return 'A range error occurred.';
        } else {
            // If err is not an object or doesn't have a code property, return a generic message
            return 'An error occurred.';
        }
    }

    async uploadFile(fileName, fileContent) {
        console.log(appConfig.api.aws.bucketName);
        const params = {
            Bucket: appConfig.api.aws.bucketName,
            Key: fileName,
            Body: fileContent
        };

        try {
            const file = await this.s3.upload(params).promise();
            const contentUrl = this.getUrl(fileName);
            return { err: false, data: contentUrl };
        } catch (err) {
            return { err: true, data: this.handleError(err) };
        }
    }

    async downloadFile(fileName, bucketName) {
        const params = {
            Bucket: bucketName,
            Key: fileName
        };

        try {
            const contentUrl = await this.s3.getObject(params).promise();
            return { err: false, data: contentUrl };
        } catch (err) {
            return { err: true, data: this.handleError(err) };
        }
    }

    async deleteFile(fileName) {
        const params = {
            Bucket: appConfig.api.aws.bucketName,
            Key: fileName
        };

        try {
            await this.s3.deleteObject(params).promise();
            return { err: false, data: "File deleted successfully." };
        } catch (err) {
            console.error("AWS S3 File Delete Error: ", err);
            return { err: true, data: this.handleError(err) };
        }
    }

    async uploadImageFromUrl(url) {
        try {
            // Initialize ExtendedNetwork instance with empty base URL
            const imageLib = new Image('');

            // Download image from URL
            const downloadedImage = await imageLib.downloadBinary(url);
            if (downloadedImage.err) {
                throw new Error('Error downloading image: ' + downloadedImage.data);
            }

            // Detect image type and generate a file name
            const imageType = downloadedImage.headers['content-type'];
            const extension = imageType.split('/')[1] || 'jpg';
            const fileName = `image-${Date.now()}.${extension}`;

            // Convert image data to Buffer
            const fileContent = Buffer.from(downloadedImage.data);

            // Upload image to S3
            const uploadResult = await this.uploadFile(fileName, fileContent);
            if (uploadResult.err) {
                throw new Error('Error uploading image to S3: ' + uploadResult.data);
            }

            // Construct the AWS link of the uploaded image
            return { err: false, data: fileName }; // Return AWS link
        } catch (error) {
            return {
                err: true,
                data: error.message
            }
        }
    }

    async downloadPublicImage(url) {
        try{
            const network = new Network();
            const {err, data} = await network.makeRequest("GET", url);
            //return image type i.e. 
        }
        catch(e){
            return {
                err: true,
                data: e.message || e
            
            }
        }
    }

    getUrl(fileName) {
        return `https://${appConfig.api.aws.bucketName}.s3.amazonaws.com/${encodeURIComponent(fileName)}`
    }
    
    async existFile(fileName) {
        const params = {
            Bucket: appConfig.api.aws.bucketName,
            Key: fileName
        };

        try {
            await this.s3.headObject(params).promise();
            return { err: false, data: true };
        } catch (err) {
            if (err.code === 'NotFound') {
                return { err: false, data: false };
            } else {
                return { err: true, data: this.handleError(err) };
            }
        }
    }
}


module.exports = new S3();