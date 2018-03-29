// Convierta este archivo de ES5 a ES6 - JavaScript 2015
// OJO: No es a TypeScript, solo JAVASCRIPT

console.log('\n-----\\\\EJERCICIO PARA TRANSFORMAR CÓDIGO JAVASCRIPT ES5 A ES6//-----');
console.log('\n');

// ==============================
//  Spiderman info
// ==============================
// Constantes?
const HEROE = "Spiderman";

// Declaracion de letiables?
let spiderman = "Peter Parker",
  venom1 = "Eddie Brock";

// Destructuracion de arreglos?
let versiones = ["Spider-Man 2099", "Spider-Girl", "Ultimate Spider-Man"];

let spiderman2099 = versiones[0];
let spidergirl = versiones[1];
let ultimate = versiones[2];

let [version1, version2, version3] = versiones;

console.log(`Versiones de Spiderman: ${version1}, ${version2}, ${version3}`);

// Destructuracion de objetos?
let enemigos = {
  venom: "Eddie Brock",
  carnage: "Cletus Kasady",
  sandman: "William Baker"
};

let {
  venom,
  carnage,
  sandman
} = enemigos;

console.log(`Enemigos: ${venom}, ${carnage}, ${sandman}`);


// Ciclo for Of?
for (let i = 0; i <= versiones.length - 1; i++) {
  let spider = versiones[i];
  console.log(spider);
}

for (let version of versiones) {
  console.log("Iteración de versiones de Spiderman Bucle foroF:" + version);
}