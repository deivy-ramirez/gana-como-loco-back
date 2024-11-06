const mongoose = require('mongoose');
const User = require('../models/User');
const Auth = require('../models/Auth');
const fs = require('fs');
require('dotenv').config();

async function logAndDeleteSpamUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Fechas específicas del ataque
    const startDate = new Date('2024-11-02T23:43:39.504+00:00');
    const endDate = new Date('2024-11-03T00:18:29.586+00:00');

    // Crear archivo de log con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = `users_log_${timestamp}.txt`;
    const writeStream = fs.createWriteStream(logFile);

    const writeLog = (message) => {
      console.log(message);
      writeStream.write(message + '\n');
    };

    writeLog('=== INICIO DEL PROCESO DE ELIMINACIÓN ===');
    writeLog(`Fecha y hora: ${new Date().toLocaleString()}`);
    writeLog(`Rango de fechas para eliminación: ${startDate.toISOString()} - ${endDate.toISOString()}\n`);

    // Buscar usuarios creados en el rango de fechas específico
    const users = await User.find({
      _id: {
        $gte: mongoose.Types.ObjectId.createFromTime(startDate.getTime() / 1000),
        $lte: mongoose.Types.ObjectId.createFromTime(endDate.getTime() / 1000)
      }
    });

    writeLog(`Total de usuarios encontrados: ${users.length}\n`);

    let deletedCount = 0;
    for (const user of users) {
      try {
        const auth = await Auth.findOne({ userId: user._id });
        
        const userDetails = [
          '\n--- DATOS DEL USUARIO ---',
          `ID: ${user._id}`,
          `Nombre: ${user.nombre}`,
          `Cédula: ${user.cedula}`,
          `Fecha de Nacimiento: ${user.fechaNacimiento}`,
          `Correo: ${auth ? auth.correo : 'No encontrado'}`,
          `Fecha de creación: ${user._id.getTimestamp().toLocaleString()}`,
          '------------------------'
        ].join('\n');

        writeLog(userDetails);

        if (auth) {
          await Auth.deleteOne({ _id: auth._id });
          writeLog(`Auth eliminado para usuario ${user._id}`);
        }
        
        await User.deleteOne({ _id: user._id });
        writeLog(`Usuario eliminado: ${user._id}`);
        
        deletedCount++;

      } catch (error) {
        writeLog(`ERROR al procesar usuario ${user._id}: ${error.message}`);
      }
    }

    const summary = [
      '\n=== RESUMEN DE LA OPERACIÓN ===',
      `Total de usuarios procesados: ${users.length}`,
      `Usuarios eliminados exitosamente: ${deletedCount}`,
      `Usuarios con error: ${users.length - deletedCount}`,
      '==============================='
    ].join('\n');

    writeLog(summary);
    writeStream.end();

    console.log(`\nProceso completado. Los logs se han guardado en: ${logFile}`);
    process.exit(0);

  } catch (error) {
    console.error('Error general:', error);
    fs.appendFileSync('error_log.txt', `${new Date().toISOString()} - ${error.stack}\n`);
    process.exit(1);
  }
}

// Confirmación antes de ejecutar
console.log('ADVERTENCIA: Este script eliminará usuarios de la base de datos.');
console.log('Rango de fechas para eliminación:');
console.log('Inicio: 2024-11-02T23:43:39.504+00:00');
console.log('Fin:    2024-11-03T00:18:29.586+00:00');
console.log('¿Estás seguro de que deseas continuar? (s/N)');

process.stdin.once('data', (data) => {
  const response = data.toString().trim().toLowerCase();
  if (response === 's') {
    logAndDeleteSpamUsers();
  } else {
    console.log('Operación cancelada');
    process.exit(0);
  }
});