module.exports = class Usuarios {
    constructor(id, nombre, apellido, libros = []) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.penalizaciones = 0;
    }

    agregarLibro(libro) {
        this.libros.push(libro);
    }

    devolverLibro(idLibro) {
        this.libros = this.libros.filter(libro => libro.id !== idLibro);
    }

    mostrarLibrosPrestados() {
        console.log(`Libros prestados a ${this.nombre}:`, this.libros.map(libro => libro.titulo));
    }

    verificarPenalizaciones() {
        console.log(`${this.nombre} tiene ${this.penalizaciones} penalizaciones.`);
    }
}