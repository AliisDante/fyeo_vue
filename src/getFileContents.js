import { createWorker } from 'tesseract.js';

function extractFileContent(file, setter, wait){
    let contents = "";

    console.log(typeof file)
    if (typeof file === 'string' || file instanceof String){
        setter.value = file;
        wait.value = false;
        return;
    }

    if (file.type.includes("jpeg") || file.type.includes("png")){
        // return "image";
        ocr(file, setter, wait);
    }else if(file.type.includes("text")
    //  || file.type.includes("docx")
     ){    
        // return "text";
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend=function(){extractFileContent(reader.result, setter, wait);}
    }else{
        return "unknown"
    }
}

async function ocr(file, setter, wait){
    const worker = await createWorker('eng');
    console.log("ocr starting!");
    (async () => {
        const { data: { text } } = await worker.recognize(file);
        extractFileContent(text, setter, wait);
        await worker.terminate();
    })();
}

export default extractFileContent;