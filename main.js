const http = require('http');
const shell = require('shelljs');
const eURL = require('url');
const site_server = http.createServer();
const logger = require('logger').createLogger("vpn.log");
const TronWeb = require('tronweb')
const bcrypt = require('bcrypt');
const fs = require('fs');
const httpPort = 3000;
const version = 2.2;
const resolveConfFile = "/etc/resolv.conf"
const serverConfFile = "/etc/openvpn/server/server.conf"
let Contract = null;
let tronWeb = null;
let smartAddress = "";



startHttpServer();
async function startHttpServer() {

  
    logger.info("http server start ...");

    site_server.on('error', (err)=>{
        logger.error("http server error ", err.stack);
    });

    site_server.on('request', async function (req, res) {

        logger.info("*** start request", req.method);

        try {

            let U = eURL.parse(req.url, true);
            logger.info("request info", req.method, JSON.stringify(U));

            if (req.method === "GET") {
                switch (U.pathname.replace(/^\/|\/$/g, '')) {
                    case "create" :
                        await addVpn(req, res, U.query);
                        break;
                    case "remove" :
                        await removeVpn(req, res, U.query);
                        break;
                    default :
                        logger.info("pathname not found !", U.pathname);
                }
            }

            logger.info("*** end request");

        }catch (e) {
            logger.error("DANGER !!!! >>> in request ", e.message);
        }

        res.end();
    });

    site_server.listen(httpPort);
    logger.info("http server listen on " + httpPort);
}

async function addVpn(req, res, query){

    
    const result = shell.exec('/home/bvpn/openvpn-install.sh', { async: true });
  result.stdin.write('1\n'); // Enter 1
  result.stdin.write(query.publicKey+'\n'); // Enter name 'ali'
  result.stdin.write('1\n'); // Press Enter
     result.stdin.end();
//     let lastdata = readDataFromFile()
//     lastdata.push('ali')
//      writeDataToFile(lastdata)
//   let last = getLastIndex()
//      logger.info('last index',last)

    
}




async function removeVpn(req, res, query){

 const result = shell.exec('/home/bvpn/openvpn-install.sh', { async: true });

  
  result.stdin.write('2\n'); // Enter 1
  result.stdin.write(query.publicKey+'\n'); // Enter name 'ali'
 

  result.stdin.end();
}

// async function checkUser(req, res, query){

//     if(!tronWeb.isAddress(query.public_key)){
//         res.write('false');
//         return;
//     }

//     let user = await Contract.users(query.public_key).call()

//     if(!user.isExist){
//         res.write('false');
//         return;
//     }

//     let now = new Date();

//     if(tronWeb.BigNumber(user.expireDate).toNumber() * 1000 < now.getTime()){
//         res.write('false');
//         return;
//     }

//     let hash = user.securityKey.replace(/^\$2y(.+)$/i, '$2a$1');
//     let passCheck = await bcrypt.compare(query.password, hash);

//     if(!passCheck) {
//         res.write('false');
//         return;
//     }


//     res.write('true');
//     return;

// }

// async function networkUsage(req, res, query){

//     let _file = "";
//     let _version = "<version>" + version + "</version>";
//     _file += shell.echo(_version);
//     _file += shell.echo("<tun0>");
//     _file += shell.exec("vnstat -s -i tun0");
//     _file += shell.echo("</tun0>");
//     _file += shell.echo("<eth0>");
//     _file += shell.exec("vnstat -s -i eth0");
//     _file += shell.echo("</eth0>");
//     _file += shell.echo("<ens3>");
//     _file += shell.exec("vnstat -s -i ens3");
//     _file += shell.echo("</ens3>");

//     res.write(_file);

// }

// async function info(req, res, query){

//     let _file = "";
//     let _version = "<version>" + version + "</version>";
//     let _dns = "<dns>\n" + version + "\n</dns>";
//     _file += shell.echo(_version);
//     _file += shell.echo(_dns);
//     _file += shell.echo("<tun0>");
//     _file += shell.exec("vnstat -s -i tun0");
//     _file += shell.echo("</tun0>");
//     _file += shell.echo("<eth0>");
//     _file += shell.exec("vnstat -s -i eth0");
//     _file += shell.echo("</eth0>");
//     _file += shell.echo("<ens3>");
//     _file += shell.exec("vnstat -s -i ens3");
//     _file += shell.echo("</ens3>");


//     _file += shell.echo("<dns_server>");
//     try {
//         let f1 = await fs.readFileSync(resolveConfFile, "utf8");
//         let ns = f1.split("\n");
//         for (let i = 0; i < ns.length; i++) {
//             if (ns[i].substr(0, 10) === "nameserver") {
//                 _file += shell.echo(ns[i].substr(10).trim());
//             }
//         }
//     }catch (e) {
//         console.log(e);
//     }
//     _file += shell.echo("</dns_server>");

//     _file += shell.echo("<dns_openvpn>");
//     try {
//         let f2 = await fs.readFileSync(serverConfFile, "utf8");
//         let ov_ns = f2.split("\n");
//         for (let i = 0; i < ov_ns.length; i++) {
//             if (ov_ns[i].substr(0, 21) === "push \"dhcp-option DNS") {
//                 _file += shell.echo(ov_ns[i].substr(21).trim().replace('"', ""));
//             }
//         }
//     }catch (e) {
//         console.log(e);
//     }
//     _file += shell.echo("</dns_openvpn>");

//     res.write(_file);

// }


// async function update(req, res, query){



// }

// async function changeDNS(req, res, query){

//     let new_dns = query.dns;

//     if(Array.isArray(new_dns)) {
//         try {
//             let f2 = await fs.readFileSync(serverConfFile, "utf8");
//             let ov_ns = f2.split("\n");
//             let _file = "";
//             for (let i = 0; i < ov_ns.length; i++) {
//                 if (ov_ns[i].trim().length > 0)
//                     if (ov_ns[i].substr(0, 21) !== "push \"dhcp-option DNS") {
//                         _file += ov_ns[i] + "\n";
//                     }
//             }

//             for (let i = 0; i < new_dns.length; i++) {
//                 _file += "push \"dhcp-option DNS " + new_dns[i] + "\"\n";
//             }

//             await fs.writeFileSync(serverConfFile, _file);

//         } catch (e) {
//             console.log(e);
//         }

//         try {
//             let _file = "";
//             for (let i = 0; i < new_dns.length; i++) {
//                 _file += "nameserver " + new_dns[i] + "\n";
//             }

//             await fs.writeFileSync(resolveConfFile, _file);

//         } catch (e) {
//             console.log(e);
//         }

//         try{
//             shell.exec("systemctl restart openvpn");
//         }catch (e) {

//         }
//     }

// }