//成生签名  
function createSign(consumer_secret, token_secret, url, method, params){  
    var key=encode(consumer_secret||"")+'&'+encode(token_secret||"");  
    var turl=[];  
    turl.push(method.toUpperCase());  
    turl.push(encode(url));  
    turl.push(encode($.param(sortByKey(params))));  
    /*Fix:  
     * 1, Use '=' to pad base64 
     * 2, Use Upper Hex Format 
     */  
    return b64_hmac_sha1(key, turl.join("&"));  
}  
  
//合并参数  
function createParam(params){  
    var timestamp = (new Date()).getTime();  
    var tmps={  
        oauth_signature_method: "HMAC-SHA1",  
        oauth_version: "1.0",  
        oauth_timestamp: Math.round(timestamp/1000),  
        oauth_nonce: timestamp  
    };  
    for(var k in params){  
        tmps[k]=params[k];  
    }  
    return tmps;  
}  
  
//参数排序  
function sortByKey(paramArr){  
    var keys=[];  
    for(var k in paramArr){  
        keys.push(k);  
    }  
    keys=keys.sort();  
    var params={};  
    for(var k in keys){  
        params[keys[k]]=paramArr[keys[k]];  
    }  
    return params;  
}  
  
//url编码  
function encode(s){  
    s = encodeURIComponent(s);  
    s = s.replace(/\!/g, "%21");  
    s = s.replace(/\*/g, "%2A");  
    s = s.replace(/\'/g, "%27");  
    s = s.replace(/\(/g, "%28");  
    s = s.replace(/\)/g, "%29");  
    return s;  
}  
  
///////////////////////////////////////////////////////////////////////////////  
/** 
 * 通用api 
 * @param string apiurl  api地址 
 * @param object param   其他接口特定的参数 
 * @param string method  调用方式GET/POST 
 */  
function apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, apiurl, param, method){  
    // 生成基本oauth参数表, 附加接口参数  
    var params=createParam(param);  
    // 添加oauth_consumer_key到oauth参数表中  
    if (oauth_consumer_key!="") params["oauth_consumer_key"] = oauth_consumer_key;  
    // 添加oauth_token到oauth参数表中  
    if (oauth_token != "") params["oauth_token"] = oauth_token;  
      
    // 生成签名  
    params["oauth_signature"]=createSign(consumer_secret  
            , oauth_token_secret  
            , apiurl  
            , method  
            , params  
            );  
      
    // http请求  
    doRequest(method, apiurl+"?"+$.param(params));  
}  
  
/** 
 * 生成临时token 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string callbackurl          回调url 
 * @return JSON 临时oauth_token和临时oauth_secret 
 */  
function requestToken(oauth_consumer_key, consumer_secret, callbackurl){  
    apis(oauth_consumer_key, consumer_secret  
            , "", ""  
            , "https://openapi.kuaipan.cn/open/requestToken"  
            , { oauth_callback : callbackurl }  
            , 'GET');  
}  
  
/** 
* 用户登录授权 
* @param string oauth_token          临时token 
* @return string 校验码 
*/  
function authorise(oauth_token){  
    doRequest( 'GET', 'https://www.kuaipan.cn/api.php?ac=open&op=authorise&oauth_token=' + oauth_token);  
}  
  
/** 
 * 生成正式token 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          临时oauth_token 
 * @param string oauth_token_secret   临时oauth_secret 
 * @param string oauth_verifier       校验码 
 * @return JSON 正式oauth_token和正式oauth_secret 
 */  
function accessToken(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, oauth_verifier){  
    apis(oauth_consumer_key, consumer_secret  
            , oauth_token, oauth_token_secret  
            , "https://openapi.kuaipan.cn/open/accessToken"  
            , { oauth_verifier: oauth_verifier}  
            , 'GET');  
}  
  
  
/** 
 * 获取用户信息 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @return JSON  用户信息 
 */  
function account_info(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret){  
    apis(oauth_consumer_key, consumer_secret  
            , oauth_token, oauth_token_secret  
            ,"http://openapi.kuaipan.cn/1/account_info"  
            ,{}  
            ,"GET");  
}  
  
/** 
 * 获取文件信息 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param bool   isroot               根目录类型 
 * @param string path                 查询目标 
 * @return JSON 文件（夹）信息 
 */  
function metadata(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, isroot, path){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            , "http://openapi.kuaipan.cn/1/metadata/"+(isroot?"kuaipan":"app_folder") + "/" + path  
            , {}  
            , "GET");  
}  
  
/** 
 * 获取分享链接 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param bool   isroot               根目录类型 
 * @param string path                 文件路径 
 * @param string name                 设定一个共享名字 
 * @param string access_code          设定一个访问密码 
 * @return string 共享地址 
 */  
function shares(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, isroot, path, name/*共享名不能有非法字符*/, access_code){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            , "http://openapi.kuaipan.cn/1/shares/" + (isroot?"kuaipan":"app_folder") + "/" + path  
            , {name: name, access_code: access_code}  
            , "GET");  
}  
  
/** 
 * 新建文件 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param bool   isroot               根目录类型 
 * @param string folder_name          文件夹名称 
 */  
function create_folder(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, isroot, folder_name){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            , "http://openapi.kuaipan.cn/1/fileops/create_folder"  
            , {root: (isroot? "kuaipan" : "app_folder"), path: folder_name}  
            , "GET");  
}  
  
/** 
 * 删除文件（夹） 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param bool   isroot               根目录类型  
 * @param string path                 删除的文件（夹）名称 
  */  
function Delete(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, isroot, path, to_recycle){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            , "http://openapi.kuaipan.cn/1/fileops/delete"  
            , {root: (isroot?"kuaipan":"app_folder"), path: path, to_recycle: to_recycle}  
            ,"GET");  
}  
  
/** 
 * 移动文件（夹） 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param bool   isroot               根目录类型  
 * @param string src                  移动的源文件（夹）名称 
 * @param string dest                 移动的目标文件（夹）名称 
 */  
function move(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, isroot, src, dest){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            ,"http://openapi.kuaipan.cn/1/fileops/move"  
            ,{root: (isroot?"kuaipan":"app_folder"), from_path: src, to_path: dest}  
            ,"GET");  
}  
  
/** 
 * 复制文件（夹） 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param bool   isroot               根目录类型  
 * @param string src                  复制的源文件（夹）名称 
 * @param string dest                 复制的目标文件（夹）名称 
 */  
function copy(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, isroot, src, dest){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            ,"http://openapi.kuaipan.cn/1/fileops/copy"  
            ,{root: (isroot?"kuaipan":"app_folder"), from_path: src, to_path: dest}  
            ,"GET");  
}  
  
/** 
 * 获取上传服务器地址 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @return string 上传服务器地址url 
 */  
function upload_locate(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            , "http://api-content.dfs.kuaipan.cn/1/fileops/upload_locate"  
            , {}  
            , "GET");  
}  
  
/** 
 * 生成文件上传时候的post的地址 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param string upload_url           上传服务器地址url 
 * @param string isroot               根目录类型 
 * @param [True/False] overwrite      是否覆盖以及存在的同名文件 
 * @param string path                 上传的位置（包括文件名和扩展） 
 */  
function upload_file(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, upload_url, isroot, overwrite, path){  
    //[Sample] http://p3.dfs.kuaipan.cn/cdlnode/  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            , upload_url + "/1/fileops/upload_file"  
            , {  
                root : (isroot? "kuaipan": "app_folder"),  
                overwrite: (overwrite ? "True": "False"),   
                path: path,  
                }  
            , "POST");// 上传的数据本体，由用户通过表单提交  
}  
  
/** 
 * 下载文件 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param string isroot               根目录类型 
 * @param string path                 下载的位置（包括文件名和扩展） 
 */  
function download_file(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, isroot, path){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            , "http://api-content.dfs.kuaipan.cn/1/fileops/download_file"  
            , {  
                root: (isroot?"kuaipan":"app_folder"),   
                path: path  
              }  
            ,"GET");  
}  
  
/** 
 * 获取缩略图 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param string isroot               根目录类型 
 * @param string path                 图片文件的位置（包括文件名和扩展） 
 * @param int    w                    缩略图的宽度 
 * @param int    h                    缩略图的高度 
  */  
function thumbnail(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, isroot, path, w, h){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            , "http://conv.kuaipan.cn/1/fileops/thumbnail"  
            , {  
                root: (isroot?"kuaipan":"app_folder"),   
                path: path,   
                width: w, height: h  
              }  
            ,"GET");  
}  
  
/** 
 * 文档转换 
 * @param string oauth_consumer_key   开发者key 
 * @param string consumer_secret      开发者密钥 
 * @param string oauth_token          正式oauth_token 
 * @param string oauth_token_secret   正式oauth_secret 
 * @param string isroot               根目录类型 
 * @param string path                 转档文件的位置（包括文件名和扩展） 
 * @param string type                 转档文件的类型 
 * @param string view                 显示设备的类型 
 * @param string zip                  是否生成zip压缩的html 
 */  
function documentView(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret, isroot, path, type, view, zip){  
    apis(oauth_consumer_key, consumer_secret, oauth_token, oauth_token_secret  
            , "http://conv.kuaipan.cn/1/fileops/documentView"  
            ,{  
                root: (isroot?"kuaipan":"app_folder"),   
                path: path,   
                type: "txt",   
                view: "normal",  
                zip: 1  
            }  
            ,"GET");  
}  
