## Development

---

### Install

```bash
tnpm install
```

### Run

```bash
npm start
```

### Build

```bash
npm run build
```

### Publish

```text
Copy index.html and dist/* to a http server directory.
```

## Desgin

---

![image.png](/uploads/B15ABF86750A47CE9755DED870B81C48/image.png)

![image.png](/uploads/A5FCD3A29D604CB8B8AB65E4C2A3FF62/image.png)

## Arduino核心逻辑实现

---

前端通过http请求和CodingAgent交互。
前端将Arduino代码、开发板配置传给CodingAgent编译，返回编译后的hex文件内容。
前端将编译后的hex文件内容转成base64、开发板配置、串口信息传给CodingAgent烧录到Arduino板子，websocket返回编译结果。

### 编译代码:

> CodingAgent调用arduino-cli命令实现 

`http://127.0.0.1:8991/compile` POST 

request

```json
{ 
  "port":"/dev/cu.wchusbserial1410",
  "code":"// the setup function runs once when you press reset or power the board\nvoid setup() {\n  // initialize digital pin LED_BUILTIN as an output.\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\n// the loop function runs over and over again forever\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)\n  delay(1000);                       // wait for a second\n}\n",
  "fqbn":"arduino:avr:uno"
}
```

response
```json
{
  "code":"arduino:avr:uno",
  "output":"Sketch uses 884 bytes (2%) of program storage space. Maximum is 32256 bytes.\nGlobal variables use 9 bytes (0%) of dynamic memory, leaving 2039 bytes for local variables. Maximum is 2048 bytes.\n",
  "result":":100000000C945C000C946E000C946E000C946E00CA\r\n:100010000C946E000C946E000C946E000C946E00A8\r\n:100020000C946E000C946E000C946E000C946E0098\r\n:100030000C946E000C946E000C946E000C946E0088\r\n:100040000C9495000C946E000C946E000C946E0051\r\n:100050000C946E000C946E000C946E000C946E0068\r\n:100060000C946E000C946E00000000002400270029\r\n:100070002A0000000000250028002B0004040404CE\r\n:100080000404040402020202020203030303030342\r\n:10009000010204081020408001020408102001021F\r\n:1000A00004081020000000080002010000030407FB\r\n:1000B000000000000000000011241FBECFEFD8E0B8\r\n:1000C000DEBFCDBF21E0A0E0B1E001C01D92A930AC\r\n:1000D000B207E1F70E94DF000C94B8010C94000015\r\n:1000E0003FB7F8948091050190910601A091070116\r\n:1000F000B091080126B5A89B05C02F3F19F00196C5\r\n:10010000A11DB11D3FBFBA2FA92F982F8827BC0171\r\n:10011000CD01620F711D811D911D42E0660F771F99\r\n:10012000881F991F4A95D1F708951F920F920FB615\r\n:100130000F9211242F933F938F939F93AF93BF936D\r\n:100140008091010190910201A0910301B0910401FD\r\n:100150003091000123E0230F2D3758F50196A11DA2\r\n:10016000B11D209300018093010190930201A0939F\r\n:100170000301B09304018091050190910601A091C3\r\n:100180000701B09108010196A11DB11D80930501E1\r\n:1001900090930601A0930701B0930801BF91AF911E\r\n:1001A0009F918F913F912F910F900FBE0F901F90B5\r\n:1001B000189526E8230F0296A11DB11DD2CF789481\r\n:1001C00084B5826084BD84B5816084BD85B582605C\r\n:1001D00085BD85B5816085BD80916E00816080930D\r\n:1001E0006E00109281008091810082608093810076\r\n:1001F0008091810081608093810080918000816086\r\n:10020000809380008091B10084608093B1008091E0\r\n:10021000B00081608093B00080917A008460809308\r\n:100220007A0080917A00826080937A0080917A00CF\r\n:10023000816080937A0080917A00806880937A0050\r\n:100240001092C100CDE9D0E0FE01249109E810E050\r\n:10025000F8018491882399F090E0880F991FFC01A0\r\n:10026000E859FF4FA591B491FC01EE58FF4F8591DD\r\n:1002700094918FB7F8949C91292B2C938FBF31EBDD\r\n:10028000832E30E0932E40E0A42E40E0B42EF40103\r\n:100290008491FE019491F80124912223D9F08823BE\r\n:1002A00059F0833009F44DC008F040C0813009F4A2\r\n:1002B0004EC0823009F44FC0E22FF0E0EE0FFF1F76\r\n:1002C000EE58FF4FA591B4918FB7F8942C91922BD3\r\n:1002D0009C938FBF0E9470002B013C0188EEC82EBA\r\n:1002E00083E0D82EE12CF12C0E947000641975096E\r\n:1002F00086099709683E734081059105A8F3F1E0EE\r\n:10030000CF1AD108E108F10828EE420E23E0521E70\r\n:10031000611C711CC114D104E104F10429F7A1147A\r\n:10032000B10409F4B4CF0E940000B1CF8730B1F01E\r\n:100330008830D1F0843009F0BFCF809180008F7D6C\r\n:1003400003C0809180008F7780938000B5CF84B503\r\n:100350008F7784BDB1CF84B58F7DFBCF8091B00006\r\n:100360008F778093B000A8CF8091B0008F7DF9CFB8\r\n:04037000F894FFCF2F\r\n:00000001FF\r\n"
}
```

### 上传代码
> CodingAgent调用upload功能实现

`http://127.0.0.1:8991/upload` POST 

request

```json
{
  "board":"arduino:avr:uno",
  "port":"/dev/cu.wchusbserial1410",
  "network":false,
  "commandline":"\"{runtime.tools.avrdude.path}/bin/avrdude\" \"-C{runtime.tools.avrdude.path}/etc/avrdude.conf\" -v  -patmega328p -carduino \"-P{serial.port}\" -b115200 -D \"-Uflash:w:{build.path}/{build.project_name}.hex:i\"",
  "filename":"serial_mirror.hex","hex":"OjEwMDAwMDAwMEM5NDVDMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDBDQQ0KOjEwMDAxMDAwMEM5NDZFMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDBBOA0KOjEwMDAyMDAwMEM5NDZFMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDA5OA0KOjEwMDAzMDAwMEM5NDZFMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDA4OA0KOjEwMDA0MDAwMEM5NDk1MDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDA1MQ0KOjEwMDA1MDAwMEM5NDZFMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDA2OA0KOjEwMDA2MDAwMEM5NDZFMDAwQzk0NkUwMDAwMDAwMDAwMjQwMDI3MDAyOQ0KOjEwMDA3MDAwMkEwMDAwMDAwMDAwMjUwMDI4MDAyQjAwMDQwNDA0MDRDRQ0KOjEwMDA4MDAwMDQwNDA0MDQwMjAyMDIwMjAyMDIwMzAzMDMwMzAzMDM0Mg0KOjEwMDA5MDAwMDEwMjA0MDgxMDIwNDA4MDAxMDIwNDA4MTAyMDAxMDIxRg0KOjEwMDBBMDAwMDQwODEwMjAwMDAwMDAwODAwMDIwMTAwMDAwMzA0MDdGQg0KOjEwMDBCMDAwMDAwMDAwMDAwMDAwMDAwMDExMjQxRkJFQ0ZFRkQ4RTBCOA0KOjEwMDBDMDAwREVCRkNEQkYyMUUwQTBFMEIxRTAwMUMwMUQ5MkE5MzBBQw0KOjEwMDBEMDAwQjIwN0UxRjcwRTk0REYwMDBDOTRCODAxMEM5NDAwMDAxNQ0KOjEwMDBFMDAwM0ZCN0Y4OTQ4MDkxMDUwMTkwOTEwNjAxQTA5MTA3MDExNg0KOjEwMDBGMDAwQjA5MTA4MDEyNkI1QTg5QjA1QzAyRjNGMTlGMDAxOTZDNQ0KOjEwMDEwMDAwQTExREIxMUQzRkJGQkEyRkE5MkY5ODJGODgyN0JDMDE3MQ0KOjEwMDExMDAwQ0QwMTYyMEY3MTFEODExRDkxMUQ0MkUwNjYwRjc3MUY5OQ0KOjEwMDEyMDAwODgxRjk5MUY0QTk1RDFGNzA4OTUxRjkyMEY5MjBGQjYxNQ0KOjEwMDEzMDAwMEY5MjExMjQyRjkzM0Y5MzhGOTM5RjkzQUY5M0JGOTM2RA0KOjEwMDE0MDAwODA5MTAxMDE5MDkxMDIwMUEwOTEwMzAxQjA5MTA0MDFGRA0KOjEwMDE1MDAwMzA5MTAwMDEyM0UwMjMwRjJEMzc1OEY1MDE5NkExMURBMg0KOjEwMDE2MDAwQjExRDIwOTMwMDAxODA5MzAxMDE5MDkzMDIwMUEwOTM5Rg0KOjEwMDE3MDAwMDMwMUIwOTMwNDAxODA5MTA1MDE5MDkxMDYwMUEwOTFDMw0KOjEwMDE4MDAwMDcwMUIwOTEwODAxMDE5NkExMURCMTFEODA5MzA1MDFFMQ0KOjEwMDE5MDAwOTA5MzA2MDFBMDkzMDcwMUIwOTMwODAxQkY5MUFGOTExRQ0KOjEwMDFBMDAwOUY5MThGOTEzRjkxMkY5MTBGOTAwRkJFMEY5MDFGOTBCNQ0KOjEwMDFCMDAwMTg5NTI2RTgyMzBGMDI5NkExMURCMTFERDJDRjc4OTQ4MQ0KOjEwMDFDMDAwODRCNTgyNjA4NEJEODRCNTgxNjA4NEJEODVCNTgyNjA1Qw0KOjEwMDFEMDAwODVCRDg1QjU4MTYwODVCRDgwOTE2RTAwODE2MDgwOTMwRA0KOjEwMDFFMDAwNkUwMDEwOTI4MTAwODA5MTgxMDA4MjYwODA5MzgxMDA3Ng0KOjEwMDFGMDAwODA5MTgxMDA4MTYwODA5MzgxMDA4MDkxODAwMDgxNjA4Ng0KOjEwMDIwMDAwODA5MzgwMDA4MDkxQjEwMDg0NjA4MDkzQjEwMDgwOTFFMA0KOjEwMDIxMDAwQjAwMDgxNjA4MDkzQjAwMDgwOTE3QTAwODQ2MDgwOTMwOA0KOjEwMDIyMDAwN0EwMDgwOTE3QTAwODI2MDgwOTM3QTAwODA5MTdBMDBDRg0KOjEwMDIzMDAwODE2MDgwOTM3QTAwODA5MTdBMDA4MDY4ODA5MzdBMDA1MA0KOjEwMDI0MDAwMTA5MkMxMDBDREU5RDBFMEZFMDEyNDkxMDlFODEwRTA1MA0KOjEwMDI1MDAwRjgwMTg0OTE4ODIzOTlGMDkwRTA4ODBGOTkxRkZDMDFBMA0KOjEwMDI2MDAwRTg1OUZGNEZBNTkxQjQ5MUZDMDFFRTU4RkY0Rjg1OTFERA0KOjEwMDI3MDAwOTQ5MThGQjdGODk0OUM5MTI5MkIyQzkzOEZCRjMxRUJERA0KOjEwMDI4MDAwODMyRTMwRTA5MzJFNDBFMEE0MkU0MEUwQjQyRUY0MDEwMw0KOjEwMDI5MDAwODQ5MUZFMDE5NDkxRjgwMTI0OTEyMjIzRDlGMDg4MjNCRQ0KOjEwMDJBMDAwNTlGMDgzMzAwOUY0NERDMDA4RjA0MEMwODEzMDA5RjRBMg0KOjEwMDJCMDAwNEVDMDgyMzAwOUY0NEZDMEUyMkZGMEUwRUUwRkZGMUY3Ng0KOjEwMDJDMDAwRUU1OEZGNEZBNTkxQjQ5MThGQjdGODk0MkM5MTkyMkJEMw0KOjEwMDJEMDAwOUM5MzhGQkYwRTk0NzAwMDJCMDEzQzAxODhFRUM4MkVCQQ0KOjEwMDJFMDAwODNFMEQ4MkVFMTJDRjEyQzBFOTQ3MDAwNjQxOTc1MDk2RQ0KOjEwMDJGMDAwODYwOTk3MDk2ODNFNzM0MDgxMDU5MTA1QThGM0YxRTBFRQ0KOjEwMDMwMDAwQ0YxQUQxMDhFMTA4RjEwODI4RUU0MjBFMjNFMDUyMUU3MA0KOjEwMDMxMDAwNjExQzcxMUNDMTE0RDEwNEUxMDRGMTA0MjlGN0ExMTQ3QQ0KOjEwMDMyMDAwQjEwNDA5RjRCNENGMEU5NDAwMDBCMUNGODczMEIxRjAxRQ0KOjEwMDMzMDAwODgzMEQxRjA4NDMwMDlGMEJGQ0Y4MDkxODAwMDhGN0Q2Qw0KOjEwMDM0MDAwMDNDMDgwOTE4MDAwOEY3NzgwOTM4MDAwQjVDRjg0QjUwMw0KOjEwMDM1MDAwOEY3Nzg0QkRCMUNGODRCNThGN0RGQkNGODA5MUIwMDAwNg0KOjEwMDM2MDAwOEY3NzgwOTNCMDAwQThDRjgwOTFCMDAwOEY3REY5Q0ZCOA0KOjA0MDM3MDAwRjg5NEZGQ0YyRg0KOjAwMDAwMDAxRkYNCg==",
  "data":"OjEwMDAwMDAwMEM5NDVDMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDBDQQ0KOjEwMDAxMDAwMEM5NDZFMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDBBOA0KOjEwMDAyMDAwMEM5NDZFMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDA5OA0KOjEwMDAzMDAwMEM5NDZFMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDA4OA0KOjEwMDA0MDAwMEM5NDk1MDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDA1MQ0KOjEwMDA1MDAwMEM5NDZFMDAwQzk0NkUwMDBDOTQ2RTAwMEM5NDZFMDA2OA0KOjEwMDA2MDAwMEM5NDZFMDAwQzk0NkUwMDAwMDAwMDAwMjQwMDI3MDAyOQ0KOjEwMDA3MDAwMkEwMDAwMDAwMDAwMjUwMDI4MDAyQjAwMDQwNDA0MDRDRQ0KOjEwMDA4MDAwMDQwNDA0MDQwMjAyMDIwMjAyMDIwMzAzMDMwMzAzMDM0Mg0KOjEwMDA5MDAwMDEwMjA0MDgxMDIwNDA4MDAxMDIwNDA4MTAyMDAxMDIxRg0KOjEwMDBBMDAwMDQwODEwMjAwMDAwMDAwODAwMDIwMTAwMDAwMzA0MDdGQg0KOjEwMDBCMDAwMDAwMDAwMDAwMDAwMDAwMDExMjQxRkJFQ0ZFRkQ4RTBCOA0KOjEwMDBDMDAwREVCRkNEQkYyMUUwQTBFMEIxRTAwMUMwMUQ5MkE5MzBBQw0KOjEwMDBEMDAwQjIwN0UxRjcwRTk0REYwMDBDOTRCODAxMEM5NDAwMDAxNQ0KOjEwMDBFMDAwM0ZCN0Y4OTQ4MDkxMDUwMTkwOTEwNjAxQTA5MTA3MDExNg0KOjEwMDBGMDAwQjA5MTA4MDEyNkI1QTg5QjA1QzAyRjNGMTlGMDAxOTZDNQ0KOjEwMDEwMDAwQTExREIxMUQzRkJGQkEyRkE5MkY5ODJGODgyN0JDMDE3MQ0KOjEwMDExMDAwQ0QwMTYyMEY3MTFEODExRDkxMUQ0MkUwNjYwRjc3MUY5OQ0KOjEwMDEyMDAwODgxRjk5MUY0QTk1RDFGNzA4OTUxRjkyMEY5MjBGQjYxNQ0KOjEwMDEzMDAwMEY5MjExMjQyRjkzM0Y5MzhGOTM5RjkzQUY5M0JGOTM2RA0KOjEwMDE0MDAwODA5MTAxMDE5MDkxMDIwMUEwOTEwMzAxQjA5MTA0MDFGRA0KOjEwMDE1MDAwMzA5MTAwMDEyM0UwMjMwRjJEMzc1OEY1MDE5NkExMURBMg0KOjEwMDE2MDAwQjExRDIwOTMwMDAxODA5MzAxMDE5MDkzMDIwMUEwOTM5Rg0KOjEwMDE3MDAwMDMwMUIwOTMwNDAxODA5MTA1MDE5MDkxMDYwMUEwOTFDMw0KOjEwMDE4MDAwMDcwMUIwOTEwODAxMDE5NkExMURCMTFEODA5MzA1MDFFMQ0KOjEwMDE5MDAwOTA5MzA2MDFBMDkzMDcwMUIwOTMwODAxQkY5MUFGOTExRQ0KOjEwMDFBMDAwOUY5MThGOTEzRjkxMkY5MTBGOTAwRkJFMEY5MDFGOTBCNQ0KOjEwMDFCMDAwMTg5NTI2RTgyMzBGMDI5NkExMURCMTFERDJDRjc4OTQ4MQ0KOjEwMDFDMDAwODRCNTgyNjA4NEJEODRCNTgxNjA4NEJEODVCNTgyNjA1Qw0KOjEwMDFEMDAwODVCRDg1QjU4MTYwODVCRDgwOTE2RTAwODE2MDgwOTMwRA0KOjEwMDFFMDAwNkUwMDEwOTI4MTAwODA5MTgxMDA4MjYwODA5MzgxMDA3Ng0KOjEwMDFGMDAwODA5MTgxMDA4MTYwODA5MzgxMDA4MDkxODAwMDgxNjA4Ng0KOjEwMDIwMDAwODA5MzgwMDA4MDkxQjEwMDg0NjA4MDkzQjEwMDgwOTFFMA0KOjEwMDIxMDAwQjAwMDgxNjA4MDkzQjAwMDgwOTE3QTAwODQ2MDgwOTMwOA0KOjEwMDIyMDAwN0EwMDgwOTE3QTAwODI2MDgwOTM3QTAwODA5MTdBMDBDRg0KOjEwMDIzMDAwODE2MDgwOTM3QTAwODA5MTdBMDA4MDY4ODA5MzdBMDA1MA0KOjEwMDI0MDAwMTA5MkMxMDBDREU5RDBFMEZFMDEyNDkxMDlFODEwRTA1MA0KOjEwMDI1MDAwRjgwMTg0OTE4ODIzOTlGMDkwRTA4ODBGOTkxRkZDMDFBMA0KOjEwMDI2MDAwRTg1OUZGNEZBNTkxQjQ5MUZDMDFFRTU4RkY0Rjg1OTFERA0KOjEwMDI3MDAwOTQ5MThGQjdGODk0OUM5MTI5MkIyQzkzOEZCRjMxRUJERA0KOjEwMDI4MDAwODMyRTMwRTA5MzJFNDBFMEE0MkU0MEUwQjQyRUY0MDEwMw0KOjEwMDI5MDAwODQ5MUZFMDE5NDkxRjgwMTI0OTEyMjIzRDlGMDg4MjNCRQ0KOjEwMDJBMDAwNTlGMDgzMzAwOUY0NERDMDA4RjA0MEMwODEzMDA5RjRBMg0KOjEwMDJCMDAwNEVDMDgyMzAwOUY0NEZDMEUyMkZGMEUwRUUwRkZGMUY3Ng0KOjEwMDJDMDAwRUU1OEZGNEZBNTkxQjQ5MThGQjdGODk0MkM5MTkyMkJEMw0KOjEwMDJEMDAwOUM5MzhGQkYwRTk0NzAwMDJCMDEzQzAxODhFRUM4MkVCQQ0KOjEwMDJFMDAwODNFMEQ4MkVFMTJDRjEyQzBFOTQ3MDAwNjQxOTc1MDk2RQ0KOjEwMDJGMDAwODYwOTk3MDk2ODNFNzM0MDgxMDU5MTA1QThGM0YxRTBFRQ0KOjEwMDMwMDAwQ0YxQUQxMDhFMTA4RjEwODI4RUU0MjBFMjNFMDUyMUU3MA0KOjEwMDMxMDAwNjExQzcxMUNDMTE0RDEwNEUxMDRGMTA0MjlGN0ExMTQ3QQ0KOjEwMDMyMDAwQjEwNDA5RjRCNENGMEU5NDAwMDBCMUNGODczMEIxRjAxRQ0KOjEwMDMzMDAwODgzMEQxRjA4NDMwMDlGMEJGQ0Y4MDkxODAwMDhGN0Q2Qw0KOjEwMDM0MDAwMDNDMDgwOTE4MDAwOEY3NzgwOTM4MDAwQjVDRjg0QjUwMw0KOjEwMDM1MDAwOEY3Nzg0QkRCMUNGODRCNThGN0RGQkNGODA5MUIwMDAwNg0KOjEwMDM2MDAwOEY3NzgwOTNCMDAwQThDRjgwOTFCMDAwOEY3REY5Q0ZCOA0KOjA0MDM3MDAwRjg5NEZGQ0YyRg0KOjAwMDAwMDAxRkYNCg==",
  "extra":{
    "wait_for_upload_port":false,
    "use_1200bps_touch":false
  },
  "extrafiles":[],"signature":"06d861706dc3a9cad3824cd7c374568eb5d7f55c057bdb72726e0846575b6dc61d0c07e0628f0e51d7828307fefdfce702d8253dde90d67a554f8a795fa2c994469b10971fa2f198956493778fedf9fa4941dc6d9fa07648b477bb6cd27e2a82ea027171036fce1bc87745584a3377a055cedc09486e25de9e005415c4aa38f73b840dac6769ea82fbce2e39ba903b01738ec7cdf4688a255fcf80dfe5cd91cc7c6764133cdd5761be5f7bed3f59a888614aded15c347eceab5d169671bfba10fc0f7a5db07c504271917bdb3075c7b213a3facb915e48dd74077d88c59b94e0ebbff126994831c634f31d3a2d7edc754524b77aabde296a7ca3be13d86ff19a"
}
```

response: 耗费过长，使用ws回包。

### CodingAgent

代码地址：

https://git.code.oa.com/wynnechen/arduino_create_agent

基于 https://github.com/arduino/arduino-create-agent 开发。

### arduino-cli

代码地址：

https://git.code.oa.com/wynnechen/arduino-cli

基于 https://github.com/arduino/arduino-cli 开发，主要实现 `upload index` / `install core` / `compile` 等功能。

### 前端连接层：SocketDamon

基于 https://github.com/arduino/arduino-create-agent-js-client 开发