module.exports = class Libro {
    constructor(id, titulo, autor, categoria) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.categoria = categoria;
        this.disponible = true;
    }

    detallesLibro() {
        console.log("Libro ID:",this.id,"Titulo:",this.titulo,"Autor:",this.autor,"Categoria:",this.categoria, `Disponible: ${this.disponible ? "Sí" : "No"}`)
    }

    cambiarDisponibilidad(estado) {
        this.disponible = estado;
    }
}
