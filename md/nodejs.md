## fs
    
    //fs.readFile(filename, [encoding], [callback(err, data)]) 若指定encoding，则解析字符串；否则，为二进制Buffer
    fs.readFile('file.txt', 'utf-8', function(err, data){
      if(err){
        //error
      }else{
        //data
      }
    })
    //fs.writeFile(filename, [encoding], [callback(err)])
    
    
    
