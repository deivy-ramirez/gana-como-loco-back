const Code = require('../models/Code');

async function generateCodes() {
  const totalCodes = 1000;
  const winningCodes = 400;
  const prizes = [
    { amount: 1000000, count: 50 },
    { amount: 200000, count: 150 },
    { amount: 50000, count: 200 }
  ];

  let codes = [];

  // Generar códigos ganadores
  for (let prize of prizes) {
    for (let i = 0; i < prize.count; i++) {
      codes.push({
        codigo: Math.floor(100 + Math.random() * 900).toString(), // Código de 3 dígitos
        premio: prize.amount
      });
    }
  }

  // Generar códigos no ganadores
  for (let i = 0; i < totalCodes - winningCodes; i++) {
    codes.push({
      codigo: Math.floor(100 + Math.random() * 900).toString(),
      premio: 0
    });
  }

  // Mezclar los códigos
  codes = codes.sort(() => Math.random() - 0.5);

  // Guardar en la base de datos
  try {
    await Code.insertMany(codes);
    console.log('Códigos generados y guardados exitosamente');
    return { success: true, message: 'Códigos generados y guardados exitosamente' };
  } catch (error) {
    console.error('Error al generar códigos:', error);
    return { success: false, message: 'Error al generar códigos' };
  }
}

module.exports = generateCodes;