type Car = {
  bodywork: string,
  model: string,
  security: boolean,
  passengers: number,
  action?: () => void
};


// Objetos
var batimovil: Car = {
  bodywork: "Negra",
  model: "6x6",
  security: true,
  passengers: 4
};

var bumblebee: Car = {
  bodywork: "Amarillo con negro",
  model: "4x2",
  security: true,
  passengers: 4,
  action() { // El metodo action es opcional
    console.log("Disparar");
  }
};

// Villanos debe de ser un arreglo de objetos personalizados
type Villain = {
  name: string,
  age: number,
  mutant: boolean,
};

let villanos: Villain[] = [
  {
    name: "Lex Luthor",
    age: 54,
    mutant: false
  },
  {
    name: "Erik Magnus Lehnsherr",
    age: 49,
    mutant: true
  },
  {
    name: "James Logan",
    age: undefined,
    mutant: true
  }
];

// Multiples tipos
// cree dos tipos, uno para charles y otro para apocalipsis
type Charles = {
  poder: string,
  estatura: number
};

type Apocalipsis = {
  lider: boolean,
  miembros: any[]
};

var charles: Charles = {
  poder: "psiquico",
  estatura: 1.78
};

var apocalipsis: Apocalipsis = {
  lider: true,
  miembros: ["Magneto", "Tormenta", "Psylocke", "Angel"]
}

// Mystique, debe poder ser cualquiera de esos dos mutantes (charles o apocalipsis)
var mystique: Charles | Apocalipsis;

mystique = charles;
mystique = apocalipsis;