// Tipos
var batman: string = "Bruce";
var superman: string = "Clark";

var existe: boolean = false;
console.log("\n-----\\\\TIPOS DE DATOS//-----");
console.log('batman es de tipo: ' + typeof batman);
console.log('superman es de tipo: ' + typeof superman);
console.log('existe es de tipo: ' + typeof existe);

// Tuplas
var parejaHeroes: [string, string] = [batman, superman];
var villano: [string, number, boolean] = ["Lex Lutor", 5, true];
console.log("\n-----\\\\TUPLAS//-----");
console.log(parejaHeroes);
console.log(villano);

// Arreglos
var aliados: string[] = ["Mujer Maravilla", "Acuaman", "San", "Flash"];
console.log("\n-----\\\\AREGLOS(ARRAYS)//-----");
console.log(aliados);

//Enumeraciones
var fuerzaFlash = 5;
var fuerzaSuperman = 100;
var fuerzaBatman = 1;
var fuerzaAcuaman = 0;

enum HeroStrength {
  acuaman = fuerzaAcuaman,
  batman = fuerzaBatman,
  flash = fuerzaFlash,
  superman = fuerzaSuperman
}

console.log("\n-----\\\\ENUMERACIONES//-----");
console.log(HeroStrength);


// Retorno de funciones
console.log("\n-----\\\\RETORNO DE DATOS//-----");
function activar_batiseñal(): string {
  return "activada";
}

function pedir_ayuda(): void {
  console.log("Auxilio!!!");
}

// Aserciones de Tipo
console.log("\n-----\\\\ASERCIONES//-----");
var poder = "100";
var largoDelPoder = <number>poder.length;
console.log(largoDelPoder);
