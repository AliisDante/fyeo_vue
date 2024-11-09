import extractContent from "./getFileContents"
import { checkSensitiveWords } from "./wordcheck";

const contents =  "my name is jele"
const parameters = {
    "internal": {
      "location": {
        "value": true,
        "regex": /e/i
      },
      "address": {
        "value": true,
        "regex": [/address/i]
      }
    },
    "confidential": {
      "NIRC": {
        "value": true,
        "regex": /[a-z]\d{7}[a-z]/i
      }
    }
  }

function scanFile(file){
    //check if its not text/docx, then do ocr
    let contents = extractContent(file);

    //determine classification level based on parameters
    checkSensitiveWords(contents, parameters, file.name);


    // if anything in confidential is true, set to confidential
    // if anything in internal is true, set to internal
    // else public 

    //check with ai (future)
}

// testing of parameters checker
const stringContent = "ABBBBC"

checkSensitiveWords(stringContent, parameters, "teststring")

