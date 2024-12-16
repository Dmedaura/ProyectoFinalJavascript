module.exports = class Prestamos {
    constructor(id, idLibro, idUsuario) {
        this.id = id;
        this.idLibro = idLibro;
        this.idUsuario = idUsuario;
        //this.fechaPrestamo = new Date();
        //this.fechaDevolucion = null;
        this.devuelto = false;
        this.penalizado = false;
    }

    detallesPrestamo() {
        console.log("Prestamos ID:", this.id,"Libro ID:",this.idLibro, "Usuario ID:",this.idUsuario, `Devuelto: ${!this.devuelto ? "Sí" : "No"}`);
        
    }
}