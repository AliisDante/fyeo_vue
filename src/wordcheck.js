// export function checkSensitiveWords(contents, parameters, fileName) {
    
//     // check confidential paramter first
//     if ("confidential" in parameters) {
//         let confidentialParams = parameters["confidential"];

//         for (let key in confidentialParams) {
//             let param = confidentialParams[key];
//             if (param.value && param.regex.test(contents)) {

//                 // handle confidential parameter violation
//                 console.error(`Sensitive data detected in file: ${fileName} - ${key} (CONFIDENTIAL)`);
//                 return;
//             }
//         }
//     }

//     // check internal parameter
//     if ("internal" in parameters && parameters["internal"].location) {
//         const regex = parameters["internal"].location.regex;

//         if (regex.test(contents)) {
//             console.error(`Sensitive location detected in file: ${fileName} (INTERNAL)`);
//             return;
//         }
//     }
// }

export function checkSensitiveWords(contents, parameters, fileName) {
    let result = [];
    let sensitiveContent = '';
  
    // check confidential param first
    if ("confidential" in parameters) {
      let confidentialParams = parameters["confidential"];
  
      for (let key in confidentialParams) {
        let param = confidentialParams[key];
        if (param.value && param.regex[0].test(contents)) {
          // handle confidential parameter violation
          console.error(`Sensitive data detected in file: ${fileName} - ${key} (CONFIDENTIAL)`);
          // result = 'Sensitive data detected (CONFIDENTIAL)';
          // sensitiveContent = param.regex.exec(contents)[0]; // Get the detected sensitive content
          // return { result, sensitiveContent, key };
          result.push ({
            type: 'CONFIDENTIAL',
            key,
            content: contents.match(param.regex[0])[0]
          });
        }
      }
    }
  
    // check internal param
    // if ("internal" in parameters && parameters["internal"].location) {
    //   // const regex = parameters["internal"].location.regex;
    //   const regexArray = parameters["internal"].location.regex;

    //     // testing to see whether regexx is fine
    //   for (const regex of regexArray) {
    //     console.log('Regex pattern:', regex);
    //     console.log('Contents:', contents);
    //     console.log('Regex test result:', regex.test(contents));
    //     const match = contents.match(regex);
      

    //     if (match) {
    //       console.error(`Sensitive location detected in file: ${fileName} (INTERNAL)`);
    //       result.push({
    //         type: 'INTERNAL',
    //         key: 'Location',
    //         content: contents.match(regex)[0]
    //       });
    //     }
    //   }
    //   // console.log('Regex pattern:', regex);
    //   // console.log('Contents:', contents);
    //   // console.log('Regex test result:', regex.test(contents));
  
    //   // if (regex.test(contents)) {
    //   //   console.error(`Sensitive location detected in file: ${fileName} (INTERNAL)`);
    //   //   result = 'Sensitive location detected (INTERNAL)';
    //   //   sensitiveContent = regex.exec(contents)[0]; // Get the detected sensitive content
    //   //   return { result, sensitiveContent, key:"location" };
    //   // }
    // }

    if ("internal" in parameters) {
      const internalParams = parameters["internal"];

      for (const key in internalParams) {
        if (internalParams.hasOwnProperty(key)) {
          const param = internalParams[key];

          if (param.value && param.regex) {
            const regexArray = param.regex

            for (const regex of regexArray) {
              console.log('Regex pattern:', regex);
              console.log('Contents:', contents);
              // console.log('Regex test result:', regex.test(contents));
              const match = contents.match(regex);

              if (match) {
                console.error(`Sensitive ${key} detected in file: ${fileName}`);
                result.push({
                  type: 'INTERNAL',
                  key,
                  content: contents.match(regex)[0]
                });
              }
            }
          }
        }
      }
    }
  
    // No sensitive data detected
    if (result.length === 0) {
      console.log("No sensitive data detected in file: ${fileName}");
    }
    // console.log(`No sensitive data detected in file: ${fileName}`);
    // result = 'No sensitive data detected';
    // return { result, sensitiveContent };
    return result;
  }
  
