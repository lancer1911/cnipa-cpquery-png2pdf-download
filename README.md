# CNIPA CPQuery PNG to PDF Downloader

This Tampermonkey script enhances the user experience on the CNIPA CPQuery website by enabling the download of PNG images as a merged PDF document. Particularly useful for older files displayed in PNG format, which users cannot directly download, this script adds a convenient download button to the first image for easy download.

## Features

- **Automatic Detection:** Detects when a target PNG image is displayed on the page.
- **Download Button:** Adds a "Download Image and Generate PDF" button to the top right corner of the image.
- **PDF Conversion:** Allows users to download all PNG images on the page as a single merged PDF file, preserving the original image quality.

## Installation

1. Ensure you have Tampermonkey installed in your browser. If not, download and install it from [Tampermonkey's website](https://www.tampermonkey.net/).
2. Open Tampermonkey in your browser and click on the Dashboard.
3. Click on the Utilities tab on the Dashboard.
4. Under the URL box, paste the URL of the script hosted on GitHub or any other platform where the `.user.js` file is located, then click Import.
5. Tampermonkey will prompt you to install the script. Review the script's code and click Install if everything looks okay.

## Usage

Once installed, navigate to the [CNIPA CPQuery website](https://cpquery.cponline.cnipa.gov.cn/). The script automatically detects PNG images and adds a download button to their top right corner. Click this button to download the images as a single PDF document.

## Contributions

Contributions are welcome! If you have suggestions for improving this script, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
