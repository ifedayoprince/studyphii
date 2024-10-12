export async function downloadPDF(result: {pdf: string, filename: string}) {
  try {
    const blob = base64ToBlob(result.pdf, "application/pdf");
    const url = window.URL.createObjectURL(blob);
    const a = document.querySelector("#downloadButton") as HTMLAnchorElement;
    a.href = url;
    a.download = result.filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    // Handle error (e.g., show an error message to the user)
  }
}

function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
