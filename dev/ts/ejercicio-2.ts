// Funciones Básicas
function sumar(a: number, b: number): number {
  return a + b;
}

var contar = function (heroes: string[]) {
  return heroes.length;
};

var superHeroes: string[] = ["Flash", "Arrow", "Superman", "Linterna Verde"];
contar(superHeroes);

//Parametros por defecto
function llamarBatman(llamar: boolean = true): void {
  if (llamar) {
    console.log("Batiseñal activada");
  }
}

llamarBatman();

// Rest?
function unirheroes(...personas: string[]): string {
  return personas.join(", ");
}


//Tipo funcion
function noHaceNada(numero: number, texto: string, booleano: boolean, arreglo: any[]): any {

  let arr: any[] = [];
  for (const key in arguments) {
    arr.push(arguments[key])
  }

  return arr.join(",");
}


// Crear el tipo de funcion que acepte la funcion "noHaceNada"
let noHaceNadaTampoco: (number: number, string: string, boolean: boolean, array: any[]) => void;

console.log(noHaceNadaTampoco = noHaceNada(5, 'nombre', true, ['perico', 17, 'hola']));
