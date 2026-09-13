const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");

const fileSection = document.getElementById("fileSection");
const fileList = document.getElementById("fileList");
const fileCount = document.getElementById("fileCount");

const convertButton =
    document.getElementById("convertButton");

const progressSection =
    document.getElementById("progressSection");

const resultSection =
    document.getElementById("resultSection");

const downloadButton =
    document.getElementById("downloadButton");

const startAgain =
    document.getElementById("startAgain");

const errorSection =
    document.getElementById("errorSection");

const errorMessage =
    document.getElementById("errorMessage");

const errorAgain =
    document.getElementById("errorAgain");


let selectedFiles = [];


/* -----------------------------------------------
   File selection
------------------------------------------------ */

fileInput.addEventListener(
    "change",
    function () {

        selectedFiles = [
            ...fileInput.files
        ];

        showFiles();

    }
);


/* -----------------------------------------------
   Drag & Drop
------------------------------------------------ */

dropZone.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        dropZone.classList.add("dragover");

    }
);


dropZone.addEventListener(
    "dragleave",
    function () {

        dropZone.classList.remove(
            "dragover"
        );

    }
);


dropZone.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        dropZone.classList.remove(
            "dragover"
        );

        selectedFiles = [
            ...event.dataTransfer.files
        ];

        showFiles();

    }
);


/* -----------------------------------------------
   Display files
------------------------------------------------ */

function showFiles() {

    if (selectedFiles.length === 0) {

        fileSection.classList.add(
            "hidden"
        );

        return;
    }


    fileList.innerHTML = "";


    selectedFiles.forEach(
        function (file) {

            const item =
                document.createElement("div");

            item.className = "file-item";


            const icon =
                document.createElement("div");

            icon.className = "file-icon";

            icon.textContent = "HEIC";


            const info =
                document.createElement("div");

            info.className = "file-info";


            const name =
                document.createElement("div");

            name.className = "file-name";

            name.textContent = file.name;


            const size =
                document.createElement("div");

            size.className = "file-size";

            size.textContent =
                formatBytes(file.size);


            info.appendChild(name);
            info.appendChild(size);


            item.appendChild(icon);
            item.appendChild(info);


            fileList.appendChild(item);

        }
    );


    fileCount.textContent =
        selectedFiles.length;


    fileSection.classList.remove(
        "hidden"
    );
}


/* -----------------------------------------------
   Convert
------------------------------------------------ */

convertButton.addEventListener(
    "click",
    async function () {

        if (selectedFiles.length === 0) {
            return;
        }


        const formData =
            new FormData();


        selectedFiles.forEach(
            function (file) {

                formData.append(
                    "files",
                    file
                );

            }
        );


        fileSection.classList.add(
            "hidden"
        );

        dropZone.classList.add(
            "hidden"
        );

        errorSection.classList.add(
            "hidden"
        );

        progressSection.classList.remove(
            "hidden"
        );


        try {

            const response =
                await fetch(
                    "/convert",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            if (!response.ok) {

                let message =
                    "Conversion failed.";

                try {

                    const data =
                        await response.json();

                    message =
                        data.error || message;

                } catch (e) {
                    // Ignore JSON parsing errors
                }

                throw new Error(message);
            }


            const blob =
                await response.blob();


            const url =
                window.URL.createObjectURL(
                    blob
                );


            downloadButton.href = url;

            downloadButton.download =
                "converted_images.zip";


            progressSection.classList.add(
                "hidden"
            );

            resultSection.classList.remove(
                "hidden"
            );

        }
        catch (error) {

            progressSection.classList.add(
                "hidden"
            );

            errorMessage.textContent =
                error.message;

            errorSection.classList.remove(
                "hidden"
            );
        }

    }
);


/* -----------------------------------------------
   Start again
------------------------------------------------ */

function resetApp() {

    selectedFiles = [];

    fileInput.value = "";

    fileList.innerHTML = "";

    fileSection.classList.add(
        "hidden"
    );

    progressSection.classList.add(
        "hidden"
    );

    resultSection.classList.add(
        "hidden"
    );

    errorSection.classList.add(
        "hidden"
    );

    dropZone.classList.remove(
        "hidden"
    );
}


startAgain.addEventListener(
    "click",
    resetApp
);


errorAgain.addEventListener(
    "click",
    resetApp
);


/* -----------------------------------------------
   Format file size
------------------------------------------------ */

function formatBytes(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        parseFloat(
            (
                bytes /
                Math.pow(1024, index)
            ).toFixed(1)
        )
        + " "
        + units[index]
    );
}

