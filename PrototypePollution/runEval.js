function runCode (code, o) {
    let logCode = ""
    if (o.log){
          if (o.preface){
                  logCode = "console.log('" + o.preface + "');"
                }
          logCode += "console.log('Running Eval');"
        }

    eval(logCode + code);
}

options = {"log": true}
