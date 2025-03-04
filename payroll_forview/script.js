script.js

document.getElementById('payroll-period').innerText = 'January 1 - 31, 2025';
document.getElementById('sheet-no').innerText = '1';
document.getElementById('total-sheets').innerText = '1';

document.addEventListener("DOMContentLoaded", function() {
    const downloadBtn = document.getElementById('download-pdf');

    if (!downloadBtn) {
        console.error("Download button not found!");
        return;
    }

    downloadBtn.addEventListener('click', function() {
        console.log("Download button clicked!");

        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert("jsPDF library is not loaded!");
            return;
        }

        let pdf = new jsPDF({
            orientation: 'l',  // Landscape mode
            unit: 'in',        
            format: 'letter'   // Letter size (8.5 x 11 inches)
        });

        let pages = document.querySelectorAll('.page');

        if (pages.length === 0) {
            alert("No content found to export!");
            return;
        }

        let margin = 0.3; // Set a narrow margin (0.3 inches)

        // Hide the button without affecting layout
        downloadBtn.style.visibility = "hidden"; 

        let addPage = (index) => {
            if (index >= pages.length) {
                pdf.save('payroll-letter-landscape.pdf'); 

                // Show the button again after saving
                downloadBtn.style.visibility = "visible";  
                return;
            }

            let element = pages[index];

            html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
                let imgData = canvas.toDataURL('image/png');

                let pageWidth = 11 - (margin * 2);  // Adjust width for margin
                let pageHeight = (canvas.height * pageWidth) / canvas.width; 

                if (index > 0) pdf.addPage("letter", "l"); 
                pdf.addImage(imgData, 'PNG', margin, margin, pageWidth, pageHeight);

                addPage(index + 1);
            }).catch(error => {
                console.error("Error capturing page:", error);
                alert("An error occurred while generating the PDF.");
                downloadBtn.style.visibility = "visible"; // Restore button if error happens
            });
        };

        addPage(0);
    });
});