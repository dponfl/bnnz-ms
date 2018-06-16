//
//
// (async () => {
//
//   try {
//
//
//
//   } catch (err) {
//     console.error(moduleName + methodName + ', Catch block, Error:');
//     console.error('statusCode: ' + err.statusCode);
//     console.error('message: ' + err.message);
//     console.error('error: ');
//     console.dir(err.error);
//     console.error('options: ');
//     console.dir(err.options);
//
//     reject();
//   }
// })();
//
//
//
//
// console.error(moduleName + methodName + ', messageCreate error');
// console.dir(saveMessageRecord);
//
//
//
// let saveMessageRecord = await storageGatewayServices.messageCreate({
//
// });
//
// if (saveMessageRecord && saveMessageRecord.code == 200) {
//   resolve();
// } else {
//   console.error(moduleName + methodName + ', messageCreate error');
//   console.dir(saveMessageRecord);
//   reject();
// }
//
//
// let commandRec = {
//   message: params.text,
//   message_format: 'command',
//   messenger: command.messenger,
//   message_originator: 'client',
//   owner: command.id,
// };
//
//
//
//
//
//
//
//
