/**
 * Convert the given files to Markdown by using [markitdown](https://github.com/microsoft/markitdown)
 */
export async function convertToMarkdown(files: Array<File>) {
  const python = await installPython();

  const convertedFiles: Array<[string, Blob]> = [];
  for (const file of files) {
    const filename = `/${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    python.FS.writeFile(filename, uint8Array);
    console.log(`File ${file.name} loaded into Pyodide`);

    const result = python.runPython(`
              from markitdown import MarkItDown
              
              markitdown = MarkItDown()
              result = markitdown.convert("${filename}")
              result.text_content
            `);

    const blob = new Blob([result], { type: "text/markdown" });
    convertedFiles.push([file.name, blob]);
  }

  return convertedFiles;
}

// @ts-expect-error: The Pyodide library is globally available
let pyodide = null;

/**
 * Installs the Python interpreter by loading all the libraries and WASM file.
 * This can take a couple seconds. Or even more time on a slow connection. 
 */
async function installPython() {
  // @ts-expect-error: The Pyodide library is globally available
  if (pyodide) {
    return pyodide;
  }
  console.log("loading pyodide");
  // @ts-expect-error: The Pyodide library is globally available
  pyodide = await window.loadPyodide();
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("markitdown==0.0.1a2");

  return pyodide;
}
