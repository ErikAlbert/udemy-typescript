// Crear interfaces

interface Auto {
  encender: boolean;
  velocidadMaxima: number;
  acelear(): void;
}

// Cree una interfaz para validar el auto (el valor enviado por parametro)
function conducirBatimovil(auto: Auto): void {
  auto.encender = true;
  auto.velocidadMaxima = 100;
  auto.acelear();
}

let batimovil = {
  encender: false,
  velocidadMaxima: 0,
  acelear() {
    console.log("...... run!!!");
  }
}

// Cree una interfaz con que permita utilzar el siguiente objeto
// utilizando propiedades opcionales

interface Acciones {
  reir?: boolean;
  comer: boolean;
  llorar: boolean;
}

let guason = {
  reir: true,
  comer: true,
  llorar: false
}

function reir(guason): void {
  if (guason.reir) {
    console.log("JAJAJAJA");
  }
}


// Cree una interfaz para la siguiente funcion

interface Ciudad {
  (ciudadanos: string[]): number
}

function ciudadGotica(ciudadanos: string[]): number {
  return ciudadanos.length;
}

// Cree una interfaz que obligue crear una clase
// con las siguientes propiedades y metodos

/*
  propiedades:
    - nombre
    - edad
    - sexo
    - estadoCivil
    - imprimirBio(): void // en consola una breve descripcion.
*/

interface Persona {
  nombre: string;
  edad: number;
  sexo: string;
  estadoCivil: string;
  imprimirBio(): void;
}

class Ciudadano implements Persona {
  nombre: string;
  edad: number;
  sexo: string;
  estadoCivil: string;
  imprimirBio(): void {
    console.log('Descripción del ciudadano!');
  }
  fechaNacimiento: Date

  constructor(date: Date) {
    this.fechaNacimiento = date;
  }
}

let ciudadano: Ciudadano = new Ciudadano(new Date('1988-08-24'));


console.log('ejercicio 5');
console.log(ciudadano);
