const multer = require('multer');
const { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const apiError = require('../utils/apiError');
const firebaseConfig = require("../config/firebase.config").firebaseConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|gif|webp/;
const ALLOWED_VIDEO_TYPES = /mp4|mpeg|avi|quicktime|webm/;
const ERROR_MESSAGE = 'Error: File type not allowed. Only JPG, JPEG, PNG, GIF, WEBP for images, and MP4, MPEG, AVI, MOV, WEBM for videos are allowed.';

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const isImage = ALLOWED_IMAGE_TYPES.test(file.mimetype);
        const isVideo = ALLOWED_VIDEO_TYPES.test(file.mimetype);

        // Check if the file is either an image or a video
        if (isImage || isVideo) {
            return cb(null, true); // Accept the file
        }

        // If the file type is not allowed, reject it with a custom error
        return cb(new apiError(ERROR_MESSAGE, 400));
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "heroVideo", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
]);

function getFileNameWithTimestamp(fileOriginName) {
    try {
        if (!fileOriginName || typeof fileOriginName !== 'string') {
            throw new Error('Invalid file name. Input must be a non-empty string.');
        }
        fileOriginName = fileOriginName.trim();
        if (fileOriginName === '' || /^[.]+$/.test(fileOriginName)) {
            throw new Error('File name cannot be empty or just dots.');
        }
        const lastDotIndex = fileOriginName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            const fileNameWithoutExtension = fileOriginName;
            const fileName = `${fileNameWithoutExtension}_${Date.now()}`;
            return fileName;
        }
        const fileNameWithoutExtension = fileOriginName.slice(0, lastDotIndex).trim();
        const fileExtension = fileOriginName.slice(lastDotIndex + 1).trim();
        if (!fileExtension) {
            throw new Error('File name must have a valid extension.');
        }
        const fileName = `${fileNameWithoutExtension}_${Date.now()}.${fileExtension}`;
        return fileName;
    } catch (error) {
        return null;
    }
}

const uploadToStorage = async (fileOriginName, mimeType, buffer, fileType) => {
    try {
        const fileName = getFileNameWithTimestamp(fileOriginName);

        // Reference to Firebase storage path
        const storageRef = ref(storage, `files/${fileType}/${fileName}`);
        const metadata = { contentType: mimeType };

        // Upload file to Firebase Storage
        const snapshot = await uploadBytesResumable(storageRef, buffer, metadata);

        // Get the download URL after successful upload
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        throw new apiError(`Failed to upload file: ${error.message}`, 500);
    }
};


// Function to delete files from Firebase Storage
const deleteFile = async (fileUrl) => {
    try {
        if (fileUrl && fileUrl !== null && fileUrl !== undefined && fileUrl !== "") {
            const filePath = fileUrl.split('/o/')[1].split('?alt=media')[0];
            const storageRef = ref(storage, decodeURIComponent(filePath));
            await deleteObject(storageRef);
            return true;
        }
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
            return false;
        }
        throw new apiError(`Failed to delete file: ${error.message}`, 500);
    }
};


// Function to update files in Firebase Storage
const updateFile = async (existingFile, fileOriginName, mimeType, buffer, fileType) => {
    try {
        if (!existingFile && existingFile !== null && existingFile !== undefined && existingFile !== "") {
            // Delete the existing file
            const filePath = existingFile.split('/o/')[1].split('?alt=media')[0];
            const storageRef = ref(storage, decodeURIComponent(filePath));
            if (storageRef) {
                await deleteObject(storageRef);
            }
        }
        const fileName = getFileNameWithTimestamp(fileOriginName);
        // Reference to Firebase storage path
        const storageRef = ref(storage, `files/${fileType}/${fileName}`);
        const metadata = { contentType: mimeType };
        // Upload file to Firebase Storage
        const snapshot = await uploadBytesResumable(storageRef, buffer, metadata);
        // Get the download URL after successful upload
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        throw new apiError(`Failed to update file: ${error.message}`, 500);
    }
};

// Export functions for use in other parts of the application
module.exports = { updateFile, uploadToStorage, deleteFile, upload };
